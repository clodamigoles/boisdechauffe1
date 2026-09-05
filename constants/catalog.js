/**
 * Les valeurs énumérées du catalogue.
 *
 * Elles doivent être exactement celles du modèle Mongoose (`models/index.js`) :
 * le filtre de la boutique envoie ces chaînes à l'API, qui les compare telles
 * quelles au champ en base. Les avoir recopiées à la main dans le composant de
 * filtres — sans accents — faisait que le filtre par essence ne remontait
 * jamais aucun produit.
 *
 * Ce sont des identifiants, pas des libellés : leur traduction vit dans les
 * dictionnaires, sous `species.*`, `unit.*` et `badge.*`.
 */
export const ESSENCES = ["chêne", "hêtre", "charme", "mix", "granulés", "compressé", "allume-feu"]

export const UNITS = ["stère", "tonne", "pack", "kg", "sac"]

export const BADGES = ["premium", "bestseller", "nouveau", "populaire", "offre", "écologique", "innovation"]
