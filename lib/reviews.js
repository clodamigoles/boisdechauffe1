import connectDB from "@/lib/mongoose"
import { Testimonial } from "@/models"

/**
 * La synthèse des avis, lue directement en base.
 *
 * L'endpoint `/api/testimonials/showcase` sert le navigateur ; cette fonction
 * sert `getStaticProps`. Les deux calculent la même chose, et c'est voulu
 * qu'elles ne passent pas par le même chemin : une page statique qui appelle
 * sa propre API en HTTP au moment de la construction dépend d'un serveur qui
 * n'est pas encore démarré.
 *
 * Sans cet amorçage, le HTML servi annonçait « 6 avis » — la liste des mieux
 * notés — avec une moyenne à zéro et une répartition vide, que le JavaScript
 * corrigeait ensuite. Un robot d'indexation ne voit que la première version.
 */
export const REVIEWS_PAGE_SIZE = 10

export async function getReviewShowcase(limit = REVIEWS_PAGE_SIZE, skip = 0) {
    await connectDB()

    // Un avis en attente de modération ne compte ni dans la moyenne, ni dans
    // la répartition, ni dans la liste.
    const published = { isActive: true }

    const [testimonials, count, buckets] = await Promise.all([
        Testimonial.find(published)
            .sort({ featured: -1, order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Testimonial.countDocuments(published),
        Testimonial.aggregate([
            { $match: published },
            { $group: { _id: "$rating", count: { $sum: 1 } } },
        ]),
    ])

    // `distribution[0]` vaut une étoile, `distribution[4]` cinq.
    const distribution = [0, 0, 0, 0, 0]
    let weighted = 0
    for (const bucket of buckets) {
        const stars = Number(bucket._id)
        if (stars >= 1 && stars <= 5) {
            distribution[stars - 1] = bucket.count
            weighted += stars * bucket.count
        }
    }

    return {
        // Non arrondie : le formatage suit la langue, il se décide à l'affichage.
        average: count > 0 ? weighted / count : 0,
        count,
        distribution,
        testimonials,
    }
}
