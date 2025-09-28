import { withPublicAPI, createResponse } from '@/middleware/api'
import { Testimonial } from '@/models'

async function handler(req, res) {
    try {
        const { limit = 6, verified = 'true' } = req.query

        // Construire le filtre
        let filter = {
            featured: true,
            isActive: true
        }

        // Ajouter le filtre de vérification si demandé
        if (verified === 'true') {
            filter.verified = true
        }

        // Récupérer les témoignages featured avec Mongoose
        const testimonials = await Testimonial
            .find(filter)
            .sort({ order: 1, rating: -1, createdAt: -1 })
            .limit(parseInt(limit))
            .lean()

        // Si aucun témoignage featured trouvé, récupérer les mieux notés
        if (testimonials.length === 0) {
            const fallbackTestimonials = await Testimonial
                .find({
                    isActive: true,
                    verified: true,
                    rating: { $gte: 4 } // Minimum 4 étoiles
                })
                .sort({ rating: -1, createdAt: -1 })
                .limit(parseInt(limit))
                .lean()

            return res.status(200).json(
                createResponse.success(
                    fallbackTestimonials,
                    'Témoignages par défaut retournés (aucun featured trouvé)',
                    {
                        count: fallbackTestimonials.length,
                        fallback: true
                    }
                )
            )
        }

        // Calculer des statistiques sur les témoignages
        const stats = {
            totalTestimonials: testimonials.length,
            averageRating: testimonials.length > 0
                ? Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) * 10) / 10
                : 0,
            verifiedCount: testimonials.filter(t => t.verified).length,
            ratingDistribution: {
                5: testimonials.filter(t => t.rating === 5).length,
                4: testimonials.filter(t => t.rating === 4).length,
                3: testimonials.filter(t => t.rating === 3).length,
                2: testimonials.filter(t => t.rating === 2).length,
                1: testimonials.filter(t => t.rating === 1).length
            },
            featuredCount: testimonials.filter(t => t.featured).length,
            recentCount: testimonials.filter(t => {
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                return new Date(t.createdAt) >= thirtyDaysAgo
            }).length
        }

        // Enrichir les témoignages avec des propriétés calculées
        const enrichedTestimonials = testimonials.map(testimonial => ({
            ...testimonial,
            isRecent: (() => {
                const sevenDaysAgo = new Date()
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
                return new Date(testimonial.createdAt) >= sevenDaysAgo
            })(),
            displayRating: '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating)
        }))

        return res.status(200).json(
            createResponse.success(
                enrichedTestimonials,
                'Témoignages featured récupérés avec succès',
                {
                    count: enrichedTestimonials.length,
                    stats
                }
            )
        )

    } catch (error) {
        throw error // Géré par le middleware withErrorHandling
    }
}

export default withPublicAPI({
    methods: ['GET'],
    cacheSeconds: 7200, // Cache 2 heures (contenu stable)
    rateLimitMax: 100
})(handler)