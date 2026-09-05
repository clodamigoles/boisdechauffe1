/**
 * Les mots qui font poser une étiquette sur un message de contact.
 *
 * Ils étaient écrits en français dans la route d'API. Sur un marché allemand,
 * plus aucun message n'y correspondait : l'étiquetage cessait de fonctionner
 * sans que rien ne le signale, et tous les messages arrivaient en « general ».
 *
 * Les deux langues vivent ici, à un seul endroit — c'est aussi ce qui rend la
 * liste modifiable sans toucher à la route.
 */
export const MESSAGE_TAGS = {
    prix: ["prix", "tarif", "coût", "devis", "preis", "kosten", "angebot"],
    urgent: ["urgent", "rapidement", "dringend", "schnell", "eilig"],
    livraison: ["livraison", "délai", "transport", "lieferung", "liefer", "versand", "frist"],
}
