import { createTranslator } from "@/lib/i18n"
import { resolveLocale } from "@/lib/localize-doc"

/**
 * `t` pour une route d'API.
 *
 * Les messages que renvoient les routes ne restent pas sur le serveur : le
 * client les affiche tels quels — `throw new Error(result.message)` dans le
 * formulaire de contact, `setFormError(payload.message)` sous le champ d'avis,
 * `data.message` sous l'inscription à la lettre d'information. Un acheteur
 * allemand remplissait donc un formulaire allemand et se le voyait refuser
 * en français : « Le prénom est requis ».
 *
 * `createTranslator` est une fonction pure — pas de hook, pas de routeur —,
 * elle s'utilise donc côté serveur sans adaptation. La langue vient du même
 * endroit que pour le catalogue : le paramètre `locale`, puis le cookie, puis
 * l'allemand.
 */
export function serverT(req) {
    return createTranslator(resolveLocale(req))
}

export default serverT
