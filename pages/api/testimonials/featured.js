import { DatabaseUtils } from '../../../lib/mongodb'

export default async function handler(req, res) {
    // Autorise seulement GET
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`
        })
    }

    try {
        const { limit = 6, verified = true } = req.query

        // Construire le filtre
        let filter = {
            featured: true,
            isActive: true
        }

        // Ajouter le filtre de vérification si demandé
        if (verified === 'true') {
            filter.verified = true
        }

        // Récupérer les témoignages featured
        const testimonials = await DatabaseUtils.findMany(
            'testimonials',
            filter,
            {
                sort: { order: 1, rating: -1, createdAt: -1 },
                limit: parseInt(limit)
            }
        )

        // Si aucun témoignage featured trouvé, récupérer les mieux notés
        if (testimonials.length === 0) {
            const fallbackTestimonials = await DatabaseUtils.findMany(
                'testimonials',
                {
                    isActive: true,
                    verified: true,
                    rating: { $gte: 4 } // Minimum 4 étoiles
                },
                {
                    sort: { rating: -1, createdAt: -1 },
                    limit: parseInt(limit)
                }
            )

            return res.status(200).json({
                success: true,
                data: fallbackTestimonials,
                message: 'Témoignages par défaut retournés (aucun featured trouvé)',
                count: fallbackTestimonials.length
            })
        }

        // Calculer des statistiques sur les témoignages
        const stats = {
            totalTestimonials: testimonials.length,
            averageRating: testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length,
            verifiedCount: testimonials.filter(t => t.verified).length,
            ratingDistribution: {
                5: testimonials.filter(t => t.rating === 5).length,
                4: testimonials.filter(t => t.rating === 4).length,
                3: testimonials.filter(t => t.rating === 3).length,
                2: testimonials.filter(t => t.rating === 2).length,
                1: testimonials.filter(t => t.rating === 1).length
            }
        }

        // Cache headers pour optimiser les performances
        res.setHeader('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=86400')

        return res.status(200).json({
            success: true,
            data: testimonials,
            count: testimonials.length,
            stats,
            message: 'Témoignages featured récupérés avec succès'
        })

    } catch (error) {
        console.error('Erreur API testimonials/featured:', error)

        return res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

// Configuration pour Next.js
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}