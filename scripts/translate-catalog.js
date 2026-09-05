import { MongoClient } from "mongodb"

import { CATEGORY_TRANSLATIONS, PRODUCT_TRANSLATIONS } from "./catalog-de.js"

/**
 * Applique `catalog-de.js` sur la base.
 *
 * Le script ne touche qu'au sous-champ `de` : le français en base reste la
 * référence et n'est jamais écrasé. Il est rejouable — corriger une phrase
 * dans `catalog-de.js` puis relancer suffit.
 */
process.loadEnvFile(".env.local")

const FIELDS = ["name", "shortDescription", "description", "seoTitle", "seoDescription"]

async function applyTranslations(collection, translations, label) {
    const docs = await collection.find({}).toArray()
    const bySlug = new Map(docs.map((doc) => [doc.slug, doc]))

    let updated = 0
    const orphans = []

    for (const [slug, translation] of Object.entries(translations)) {
        const doc = bySlug.get(slug)
        if (!doc) {
            orphans.push(slug)
            continue
        }

        const update = {}
        for (const field of FIELDS) {
            if (translation[field] === undefined) continue
            update[`${field}.de`] = translation[field]
        }

        await collection.updateOne({ _id: doc._id }, { $set: { ...update, updatedAt: new Date() } })
        updated++
    }

    // Un document en base sans entrée dans le fichier n'a pas de version
    // allemande : il s'affichera en français sur le site allemand.
    const untranslated = docs.filter((doc) => !translations[doc.slug]).map((doc) => doc.slug)

    console.log(`${label} : ${updated}/${docs.length} traduit(s)`)
    if (orphans.length) console.log(`  ⚠ slugs du fichier absents de la base : ${orphans.join(", ")}`)
    if (untranslated.length) console.log(`  ⚠ sans traduction allemande : ${untranslated.join(", ")}`)
}

const client = new MongoClient(process.env.MONGODB_URI)
await client.connect()
const db = client.db(process.env.MONGODB_DB_NAME)

await applyTranslations(db.collection("products"), PRODUCT_TRANSLATIONS, "produits")
await applyTranslations(db.collection("categories"), CATEGORY_TRANSLATIONS, "catégories")

await client.close()
