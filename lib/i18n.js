import { useRouter } from "next/router"
import { useMemo } from "react"

import de from "@/messages/de.json"
import fr from "@/messages/fr.json"

/**
 * Les textes de l'interface, en allemand et en français.
 *
 * Le site s'adressait jusqu'ici à la France, et l'allemand était produit à la
 * volée par le widget GTranslate. Un moteur de recherche n'en voyait rien : la
 * traduction arrivait après le rendu, l'URL était la même dans les deux
 * langues, et le titre et la description de la page — les deux lignes qui font
 * venir un acheteur — restaient françaises. C'est ce fichier qui remplace ce
 * widget.
 *
 * Les deux dictionnaires sont importés en dur plutôt que chargés à la demande.
 * Ils pèsent une vingtaine de kilo-octets chacun, quelques-uns une fois
 * compressés, et cela évite d'avoir à faire traverser les textes par le
 * `getStaticProps` de chacune des vingt pages — un oubli s'y traduirait par
 * une page entière affichée en clés brutes.
 */

export const LOCALES = ["de", "fr"]
export const DEFAULT_LOCALE = "de"

/** Le nom de chaque langue dans cette langue : un francophone cherche
 *  « Français », pas « Französisch ». */
export const LOCALE_NAMES = { de: "Deutsch", fr: "Français" }

/** Étiquette de langue complète, pour `Intl` et l'attribut `lang`. */
export const LOCALE_TAGS = { de: "de-DE", fr: "fr-FR" }

const MESSAGES = { de, fr }

export function normalizeLocale(locale) {
    return LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
}

/** Descend « home.heroTitle » dans un dictionnaire. */
function lookup(messages, key) {
    let node = messages
    for (const segment of key.split(".")) {
        if (node == null || typeof node !== "object") return undefined
        node = node[segment]
    }
    return typeof node === "string" ? node : undefined
}

/** Remplace `{city}` par sa valeur. Une variable absente reste visible telle
 *  quelle : mieux vaut lire `{city}` en page qu'un trou silencieux. */
function interpolate(template, values) {
    if (!values) return template
    return template.replace(/\{(\w+)\}/g, (match, name) =>
        values[name] === undefined ? match : String(values[name]),
    )
}

/**
 * Fabrique la fonction `t` d'une langue.
 *
 * Une clé absente du français retombe sur l'allemand plutôt que de disparaître :
 * l'allemand est la langue de référence, c'est là que les textes sont écrits en
 * premier. Si elle manque des deux côtés, on rend le dernier segment de la clé
 * — `heroTitle` s'affiche, ce qui est laid mais repérable, là où une chaîne
 * vide passerait inaperçue jusqu'en production.
 */
export function createTranslator(locale) {
    const active = normalizeLocale(locale)
    const primary = MESSAGES[active]
    const fallback = MESSAGES[DEFAULT_LOCALE]

    function t(key, values) {
        const template = lookup(primary, key) ?? lookup(fallback, key)
        if (template === undefined) {
            if (process.env.NODE_ENV !== "production") {
                console.warn(`[i18n] clé absente : ${key} (${active})`)
            }
            return key.split(".").pop()
        }
        return interpolate(template, values)
    }

    /**
     * Le pluriel, sans ICU.
     *
     * Allemand et français comptent tous deux en « un / plusieurs », mais pas
     * au même endroit : le français dit « 0 avis » au singulier, l'allemand
     * « 0 Bewertungen » au pluriel. `Intl.PluralRules` connaît cette
     * différence, on la lui laisse plutôt que de la coder.
     *
     * Les clés attendues sont `<clé>_one` et `<clé>_other`, et `{count}` y est
     * remplacé comme partout ailleurs.
     */
    const pluralRules = new Intl.PluralRules(LOCALE_TAGS[active])

    function plural(key, count, values) {
        const category = pluralRules.select(count)
        const suffixed = lookup(primary, `${key}_${category}`)
            ?? lookup(primary, `${key}_other`)
            ?? lookup(fallback, `${key}_${category}`)
            ?? lookup(fallback, `${key}_other`)

        if (suffixed === undefined) {
            if (process.env.NODE_ENV !== "production") {
                console.warn(`[i18n] pluriel absent : ${key} (${active})`)
            }
            return `${count}`
        }
        return interpolate(suffixed, { count, ...values })
    }

    t.plural = plural
    t.locale = active
    t.tag = LOCALE_TAGS[active]

    return t
}

/**
 * Les formats qui suivent la langue.
 *
 * Un prix allemand s'écrit « 73,13 € », un prix français « 73,13 € » aussi —
 * mais un millier s'écrit « 1.000 » d'un côté et « 1 000 » de l'autre, et une
 * date « 5. September 2026 » contre « 5 septembre 2026 ». Ces objets sont
 * coûteux à construire ; ils sont créés une fois par langue et gardés.
 */
const formatterCache = new Map()

export function createFormatter(locale) {
    const active = normalizeLocale(locale)
    if (formatterCache.has(active)) return formatterCache.get(active)

    const tag = LOCALE_TAGS[active]
    const currency = new Intl.NumberFormat(tag, {
        style: "currency",
        currency: "EUR",
    })
    const decimal = new Intl.NumberFormat(tag)
    const longDate = new Intl.DateTimeFormat(tag, {
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    const formatter = {
        price: (value) => currency.format(Number(value) || 0),
        number: (value) => decimal.format(Number(value) || 0),
        date: (value) => {
            const date = value instanceof Date ? value : new Date(value)
            return Number.isNaN(date.getTime()) ? "" : longDate.format(date)
        },
    }

    formatterCache.set(active, formatter)
    return formatter
}

/** `t` pour un composant. Suit la langue de l'URL, sans avoir à la passer. */
export function useT() {
    const { locale } = useRouter()
    return useMemo(() => createTranslator(locale), [locale])
}

/** Les formats de la langue courante. */
export function useFormatter() {
    const { locale } = useRouter()
    return useMemo(() => createFormatter(locale), [locale])
}

/**
 * Le champ d'un document traduit — produit, catégorie, page.
 *
 * En base, ces champs sont des objets `{ de, fr }`. Deux précautions : les
 * documents d'avant la migration portent encore une chaîne simple, et une
 * traduction peut manquer sur un produit fraîchement créé. Dans les deux cas
 * on préfère afficher l'allemand qu'un blanc.
 */
export function localized(field, locale) {
    if (field == null) return ""
    if (typeof field === "string") return field
    const active = normalizeLocale(locale)
    return field[active] || field[DEFAULT_LOCALE] || field.fr || ""
}
