import { withPublicAPI, createResponse } from '@/middleware/api'
import { getReviewShowcase, REVIEWS_PAGE_SIZE } from '@/lib/reviews'

/**
 * La synthèse des avis : moyenne, répartition par note, et la liste.
 *
 * L'ancienne section d'avis n'appelait rien : treize avis étaient écrits en
 * dur dans le composant, et le compteur affichait « 234 avis déposés »
 * au-dessus. Les deux chiffres se calculent, ils ne se saisissent pas.
 *
 * La moyenne et la répartition portent sur **tous** les avis publiés, pas
 * seulement sur ceux affichés : c'est le fonctionnement attendu d'un mur
 * d'avis, « 4,6 sur 128 » au-dessus d'une liste qui se déplie.
 */
async function handler(req, res) {
    const limit = Math.min(parseInt(req.query.limit) || REVIEWS_PAGE_SIZE, 50)
    const skip = Math.max(parseInt(req.query.skip) || 0, 0)

    const showcase = await getReviewShowcase(limit, skip)

    return res.status(200).json(createResponse.success(showcase, 'Avis récupérés'))
}

export default withPublicAPI({ methods: ['GET'], cacheSeconds: 300 })(handler)
