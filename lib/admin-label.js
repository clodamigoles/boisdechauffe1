import { DEFAULT_LOCALE } from "@/lib/i18n"

/**
 * Le libellé d'un champ traduit, dans les écrans d'administration.
 *
 * L'API publique aplatit les champs `{ de, fr }` avant de répondre ; l'API
 * d'administration, non — c'est là qu'on écrit les deux langues, elle doit
 * donc rendre l'objet entier. Les listes de l'administration ont besoin d'une
 * chaîne pour afficher une ligne, et sans cette fonction elles affichaient
 * « [object Object] ».
 *
 * L'allemand passe devant : c'est sous ce nom-là que le produit existe sur le
 * site. Un produit pas encore traduit retombe sur le français plutôt que sur
 * une ligne vide qu'on ne saurait plus identifier.
 */
export function adminLabel(field) {
    if (field == null) return ""
    if (typeof field === "string") return field
    return field[DEFAULT_LOCALE] || field.fr || ""
}

export default adminLabel
