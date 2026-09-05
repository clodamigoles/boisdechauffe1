/**
 * La validation d'un numéro de téléphone.
 *
 * L'expression précédente — `/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/` —
 * n'acceptait que des numéros **français**. Sur une boutique qui vend en
 * Allemagne, elle rejetait `+49 30 12345678` : le client allemand remplissait
 * un formulaire allemand et se voyait refuser son propre numéro. Elle était
 * recopiée à trois endroits : le formulaire de contact, celui de devis et le
 * modèle Contact.
 *
 * Celle-ci accepte les formats internationaux courants — indicatif `+` ou `00`,
 * ou un `0` national — sans chercher à valider le plan de numérotation de
 * chaque pays. Le transporteur appelle ce numéro : ce qui compte est qu'il ne
 * soit pas manifestement faux, pas qu'il soit certifié.
 */
export const PHONE_PATTERN = /^(?:\+|00)?[1-9]\d{0,3}[\s.\-/()]*\d(?:[\s.\-/()]*\d){5,13}$/

/** La même règle, pour Mongoose. */
export const PHONE_VALIDATOR = [PHONE_PATTERN, "Numéro de téléphone invalide"]
