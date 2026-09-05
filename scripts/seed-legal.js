import { MongoClient } from "mongodb"

import { LEGAL_CONTENT } from "./legal-content.js"

/**
 * Écrit les quatre textes légaux en base, dans les deux langues.
 *
 * Les substitutions — {company}, {street}, {siren} — sont résolues à partir
 * des paramètres réels : l'adresse et le numéro d'immatriculation ne sont
 * saisis qu'à un seul endroit, l'administration, et une correction s'y
 * répercute au prochain passage de ce script.
 *
 * Rejouable : `npm run legal:seed`.
 */
process.loadEnvFile(".env.local")

const client = new MongoClient(process.env.MONGODB_URI)
await client.connect()
const settings = client.db(process.env.MONGODB_DB_NAME).collection("sitesettings")

const current = await settings.findOne({})
if (!current) {
    console.error("aucun document de paramètres : lancez d'abord `npm run settings:init`")
    process.exit(1)
}

const values = {
    company: current.companyName || current.siteName || "",
    street: current.address?.street || "",
    postalCode: current.address?.postalCode || "",
    city: current.address?.city || "",
    country: current.address?.country || "",
    siren: current.siren || "",
    siret: current.siret || "",
    email: current.contactEmail || "",
    phone: current.contactPhone || "",
}

const missing = Object.entries(values).filter(([, value]) => !value).map(([key]) => key)
if (missing.length) {
    console.warn(`⚠ paramètres vides, la mention restera à trou : ${missing.join(", ")}`)
}

const fill = (text) => text.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)

// L'objet est reconstruit en entier plutôt qu'écrit par chemins pointés :
// avant migration, `legalContent.cgv` est une chaîne, et Mongo refuse d'y
// créer un sous-champ `de`.
const legalContent = {}
for (const [documentKey, translations] of Object.entries(LEGAL_CONTENT)) {
    const existing = current.legalContent?.[documentKey]

    legalContent[documentKey] = {
        de: fill(translations.de),
        fr: fill(translations.fr),
    }

    // Un texte déjà saisi depuis l'administration n'est pas écrasé en silence :
    // on le signale, et on le garde.
    for (const locale of ["de", "fr"]) {
        const previous = typeof existing === "string" ? (locale === "fr" ? existing : "") : existing?.[locale]
        if (previous && previous.trim() && previous !== legalContent[documentKey][locale]) {
            console.warn(`⚠ ${documentKey}.${locale} contenait déjà un texte — conservé, non écrasé`)
            legalContent[documentKey][locale] = previous
        }
    }
}

await settings.updateOne({}, { $set: { legalContent, updatedAt: new Date() } })

const after = await settings.findOne({})
console.log("textes légaux écrits :\n")
for (const documentKey of Object.keys(LEGAL_CONTENT)) {
    const doc = after.legalContent[documentKey]
    const de = doc?.de?.length ?? 0
    const fr = doc?.fr?.length ?? 0
    console.log(`  ${documentKey.padEnd(26)} de ${String(de).padStart(5)} car.  fr ${String(fr).padStart(5)} car.`)
}

await client.close()
