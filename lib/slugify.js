import { DEFAULT_LOCALE } from "@/lib/i18n"

/**
 * Le slug d'un nom de produit ou de catégorie.
 *
 * Trois raisons de le centraliser ici, alors que la même dizaine de lignes
 * était recopiée dans le modèle et dans deux routes d'administration :
 *
 * 1. **Le nom n'est plus une chaîne.** Depuis le passage au catalogue
 *    bilingue, c'est un objet `{ de, fr }` ; les trois copies appelaient
 *    `.toLowerCase()` dessus et produisaient `[object-object]`.
 *
 * 2. **L'allemand a des lettres que l'URL ne veut pas.** `[^a-z0-9]` remplaçait
 *    chaque `ä` par un tiret : « Buchenholzpellets für Öfen » devenait
 *    `buchenholzpellets-f-r--fen`. Une umlaut se translittère — c'est la règle
 *    allemande (ä → ae), pas un accent qu'on efface.
 *
 * 3. **Le slug se dérive de l'allemand.** C'est la langue de référence du
 *    catalogue, et l'URL est unique pour les deux versions de la fiche.
 */
const TRANSLITERATIONS = {
    ä: "ae", ö: "oe", ü: "ue", ß: "ss",
    à: "a", â: "a", ç: "c", é: "e", è: "e", ê: "e", ë: "e",
    î: "i", ï: "i", ô: "o", û: "u", ù: "u", "œ": "oe", "æ": "ae",
}

export function slugify(value, locale = DEFAULT_LOCALE) {
    // Un champ traduit : on prend la langue de référence, et le français à
    // défaut — un produit peut être créé avant d'être traduit.
    const text =
        typeof value === "string"
            ? value
            : (value?.[locale] || value?.[DEFAULT_LOCALE] || value?.fr || "")

    return text
        .toLowerCase()
        .replace(/[äöüßàâçéèêëîïôûùœæ]/g, (char) => TRANSLITERATIONS[char] ?? char)
        // Ce qui reste hors de l'alphabet latin de base (les guillemets, le
        // signe « ³ » des volumes, une espace insécable) devient un tiret.
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

export default slugify
