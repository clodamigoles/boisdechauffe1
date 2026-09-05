import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n"

/**
 * Aplatit les champs `{ de, fr }` d'un document avant qu'il ne quitte l'API.
 *
 * L'alternative aurait été de résoudre la langue dans chaque composant qui
 * affiche un nom de produit — la carte du catalogue, la fiche, le fil
 * d'Ariane, le panier, l'e-mail de confirmation, l'objet du message au
 * support. Une quinzaine d'endroits, dont deux ou trois auraient été oubliés,
 * et l'oubli ne se voit qu'en allemand.
 *
 * L'API publique rend donc des chaînes, comme avant la migration : les
 * composants n'ont pas changé, et la langue est décidée une fois, au seul
 * endroit qui sait laquelle a été demandée.
 *
 * L'API d'administration, elle, garde les objets entiers : c'est là qu'on
 * écrit les deux langues.
 */

/** Les champs traduits du catalogue. */
export const LOCALIZED_FIELDS = [
    "name",
    "shortDescription",
    "description",
    "seoTitle",
    "seoDescription",
]

/**
 * La langue d'une requête API.
 *
 * Les routes `/api` ne passent pas par le routage multilingue de Next : elles
 * ne connaissent pas la langue de la page qui les appelle. Trois sources, dans
 * l'ordre : le paramètre explicite, le cookie que Next pose au changement de
 * langue, puis l'allemand.
 */
export function resolveLocale(req) {
    const fromQuery = req.query?.locale
    if (LOCALES.includes(fromQuery)) return fromQuery

    const fromCookie = req.cookies?.NEXT_LOCALE
    if (LOCALES.includes(fromCookie)) return fromCookie

    return DEFAULT_LOCALE
}

function pick(value, locale) {
    if (value == null) return value
    if (typeof value === "string") return value
    // Un champ vide en allemand retombe sur le français : mieux vaut une fiche
    // à moitié traduite qu'une fiche à moitié vide.
    return value[locale] || value[DEFAULT_LOCALE] || value.fr || ""
}

/** Reconnaît un champ traduit : un objet dont les seules clés sont des langues. */
function isLocalizedValue(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) return false
    const keys = Object.keys(value)
    return keys.length > 0 && keys.every((key) => LOCALES.includes(key))
}

/**
 * Une copie de la charge utile où les champs traduits sont des chaînes.
 *
 * La descente est récursive, et c'est nécessaire : la fiche produit répond
 * `{ product, similarProducts, seo }`. Une version qui ne regardait que le
 * premier niveau ne trouvait aucun champ traduit dans cet objet-là et laissait
 * passer les `{ de, fr }` jusqu'au navigateur, où ils s'affichaient
 * « [object Object] ».
 *
 * Deux garde-fous : on ne convertit que les clés déclarées dans
 * `LOCALIZED_FIELDS` — un objet `{ de: …, fr: … }` qui serait une vraie donnée
 * métier n'est pas écrasé — et la profondeur est bornée, pour qu'un document
 * mal formé ne fasse pas tourner la récursion sans fin.
 */
const MAX_DEPTH = 6

export function localizeDoc(value, locale, fields = LOCALIZED_FIELDS, depth = 0) {
    if (value == null || depth > MAX_DEPTH) return value

    if (Array.isArray(value)) {
        return value.map((entry) => localizeDoc(entry, locale, fields, depth + 1))
    }

    if (typeof value !== "object" || value instanceof Date) return value

    const out = {}
    for (const [key, entry] of Object.entries(value)) {
        out[key] =
            fields.includes(key) && isLocalizedValue(entry)
                ? pick(entry, locale)
                : localizeDoc(entry, locale, fields, depth + 1)
    }
    return out
}

export function localizeDocs(docs, locale, fields = LOCALIZED_FIELDS) {
    return Array.isArray(docs) ? docs.map((doc) => localizeDoc(doc, locale, fields)) : docs
}
