import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * Cherche du texte resté dans la mauvaise langue.
 *
 * Deux versions de ce contrôle ont échoué avant celle-ci, et pour la même
 * raison : elles partaient de la forme du code — du texte entre `>` et `<`,
 * sur une ligne, commençant par une majuscule. Elles ne voyaient donc ni
 * `Pourquoi Choisir {siteName} ?` (interpolation), ni un texte coupé sur deux
 * lignes, ni `{ label: "Accueil" }` (chaîne dans un objet). Une troisième a
 * raté « Livraison 24-48h partout en France » parce qu'un seul mot de sa liste
 * y figurait.
 *
 * Celui-ci part de la langue, pas de la forme, et sur deux signaux :
 *
 * — **Les élisions.** `d'`, `l'`, `n'`, `qu'`, `c'` n'existent pas en
 *   allemand. Une seule suffit à trancher.
 * — **Les accents propres au français.** à, è, ù, ç, ê, î, ô, œ. L'allemand a
 *   ä, ö, ü, ß, jamais ceux-là.
 *
 * À défaut, un compte de mots outils. Le seuil est bas parce qu'un faux
 * positif se lit en une seconde, alors qu'une phrase oubliée reste en ligne.
 *
 * Usage : `npm run i18n:audit`
 */

const ROOTS = ["pages", "components"]
const SKIP_DIRS = new Set(["delta", "admin", "node_modules", ".next"])

/**
 * Ce qui reste volontairement en français.
 *
 * Toutes ces pages s'adressent au marchand, pas au visiteur :
 *
 * — `card-action` et `card-decision` rendent une page HTML que l'exploitant
 *   ouvre depuis un e-mail pour approuver ou refuser un paiement par carte.
 *   Le client ne la voit jamais.
 * — `quotes` sert un formulaire de devis auquel aucune page ne mène
 *   aujourd'hui ; à traduire le jour où il est remis en service.
 *
 * Ne rien mettre ici sans cette justification-là : une liste d'exceptions qui
 * s'allonge sans raison finit par rendre le contrôle inutile.
 */
const MERCHANT_FACING = [
    "pages/api/payments/card-action.js",
    "pages/api/payments/card-decision.js",
    "pages/api/quotes/index.js",
]

/**
 * Les messages de succès que le client n'affiche jamais.
 *
 * `createResponse.success(data, 'Catégories récupérées')` : le second argument
 * sert au journal, jamais à l'écran — les composants ont leur propre texte.
 * On les laisse plutôt que d'ajouter quarante clés pour rien.
 */
const UNREAD_SUCCESS =
    /récupéré(e|es|s)? avec succès|Avis récupérés|Statut mis à jour vers|addStatusHistory/

/** Élisions et lettres accentuées que l'allemand n'emploie pas. */
const FRENCH_MARKERS = /\b[dlnjcmst]'|\bqu'|[àèùçêîôû]|œ/i

/** Mots outils français. Deux suffisent à signaler la ligne. */
const FRENCH_WORDS =
    /\b(le|la|les|une|des|du|aux|et|ou|est|sont|pour|dans|avec|sur|par|votre|vos|notre|nos|vous|nous|cette|ces|qui|que|plus|tout|tous|toute|toutes|sans|chaque|entre|leur|leurs|partout|inclus|gratuite|gratuit|selon|depuis|jusqu|ainsi|donc|mais|alors)\b/gi

/** Mots outils allemands, pour le contrôle inverse. */
const GERMAN_WORDS =
    /\b(der|die|das|und|oder|ist|sind|für|mit|auf|von|Ihre|Ihren|Ihrem|wir|uns|nicht|werden|wird|haben|einer|einem|eine|einen|dieser|diese|dieses|nach|bei|aus|zum|zur|beim|vom|wenn|dann|aber|auch|noch|schon)\b/g

function walk(dir, files = []) {
    for (const entry of readdirSync(dir)) {
        if (SKIP_DIRS.has(entry)) continue
        const path = join(dir, entry)
        if (statSync(path).isDirectory()) walk(path, files)
        else if (entry.endsWith(".jsx") || entry.endsWith(".js")) files.push(path)
    }
    return files
}

/** Les commentaires restent en français : c'est la langue du dépôt. */
function stripComments(source) {
    return source
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        // Les commentaires de fin de ligne aussi : `rateLimitMax: 200 // Limite
        // généreuse` faisait remonter la ligne pour son commentaire, pas pour
        // son code.
        .replace(/^\s*\/\/.*$/gm, "")
        .replace(/([^:"'`\\])\/\/[^\n]*/g, "$1")
}

/** Ce qui ne s'affiche pas : imports, appels console, clés de traduction. */
function isCode(line) {
    return (
        /^\s*(import|export)\s/.test(line) ||
        /console\.(log|warn|error|info)/.test(line) ||
        /^\s*\/\//.test(line)
    )
}

/** Retire ce qui est déjà traduit, pour ne juger que le reste. */
function withoutTranslations(line) {
    return line
        .replace(/t\.plural\([^)]*\)/g, "")
        .replace(/t\([^)]*\)/g, "")
        .replace(/localized\([^)]*\)/g, "")
        .replace(/className="[^"]*"/g, "")
        .replace(/href="[^"]*"/g, "")
}

const findings = []

for (const root of ROOTS) {
    for (const file of walk(root)) {
        if (MERCHANT_FACING.includes(file)) continue

        const lines = stripComments(readFileSync(file, "utf8")).split("\n")

        lines.forEach((line, index) => {
            const trimmed = line.trim()
            if (!trimmed || isCode(line)) return

            const rest = withoutTranslations(trimmed)
            if (!/[a-zà-ÿ]{4}/i.test(rest)) return

            const marker = FRENCH_MARKERS.test(rest)
            const words = (rest.match(FRENCH_WORDS) ?? []).length

            if (UNREAD_SUCCESS.test(trimmed)) return

            if (marker || words >= 2) {
                findings.push({ file, line: index + 1, text: trimmed.slice(0, 100) })
            }
        })
    }
}

if (findings.length === 0) {
    console.log("✓ aucune chaîne française trouvée hors des dictionnaires et des commentaires")
} else {
    console.log(`${findings.length} ligne(s) à vérifier :\n`)
    let current = null
    for (const finding of findings) {
        if (finding.file !== current) {
            current = finding.file
            console.log(`── ${current}`)
        }
        console.log(`   ${String(finding.line).padStart(4)}  ${finding.text}`)
    }
}

// ── Parité des dictionnaires ────────────────────────────────────────────────
const flatten = (object, prefix = "") =>
    Object.entries(object).flatMap(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key
        return typeof value === "object" && value !== null ? flatten(value, path) : [path]
    })

const de = JSON.parse(readFileSync("messages/de.json", "utf8"))
const fr = JSON.parse(readFileSync("messages/fr.json", "utf8"))
const keysDe = new Set(flatten(de))
const keysFr = new Set(flatten(fr))

const onlyDe = [...keysDe].filter((key) => !keysFr.has(key))
const onlyFr = [...keysFr].filter((key) => !keysDe.has(key))

console.log(`\ndictionnaires : ${keysDe.size} clés`)
if (onlyDe.length) console.log(`  ⚠ absentes du français : ${onlyDe.join(", ")}`)
if (onlyFr.length) console.log(`  ⚠ absentes de l'allemand : ${onlyFr.join(", ")}`)

// Une valeur allemande écrite en français passerait la parité sans être vue.
const read = (object, path) => path.split(".").reduce((node, key) => node?.[key], object)
const frenchInGerman = [...keysDe].filter((key) => {
    const value = read(de, key)
    return typeof value === "string" && FRENCH_MARKERS.test(value)
})
const germanInFrench = [...keysFr].filter((key) => {
    const value = read(fr, key)
    return typeof value === "string" && (value.match(GERMAN_WORDS) ?? []).length >= 3
})

if (frenchInGerman.length) console.log(`  ⚠ français dans le dictionnaire allemand : ${frenchInGerman.join(", ")}`)
if (germanInFrench.length) console.log(`  ⚠ allemand dans le dictionnaire français : ${germanInFrench.join(", ")}`)
if (!onlyDe.length && !onlyFr.length && !frenchInGerman.length && !germanInFrench.length) {
    console.log("  ✓ parité stricte, aucune langue mélangée")
}

process.exit(findings.length > 0 ? 1 : 0)
