import { withPublicAPI, createResponse } from '@/middleware/api'
import { Category } from '@/models'

async function handler(req, res) {
    try {
        const { limit = 4 } = req.query

        // Récupérer les catégories featured avec le nombre de produits
        const categories = await Category
            .find({
                isActive: true
            })
            .populate('productCount') // Utilise le virtual défini dans le modèle
            .sort({ order: 1, createdAt: 1 })
            .limit(parseInt(limit))
            .lean()

        // Si aucune catégorie featured trouvée, récupérer les 4 premières actives
        if (categories.length === 0) {
            const fallbackCategories = await Category
                .find({ isActive: true })
                .populate('productCount')
                .sort({ productCount: -1, createdAt: -1 })
                .limit(parseInt(limit))
                .lean()

            return res.status(200).json(
                createResponse.success(
                    fallbackCategories,
                    'Catégories par défaut retournées (aucune featured trouvée)',
                    { count: fallbackCategories.length, fallback: true }
                )
            )
        }

        // Enrichir avec les statistiques si le virtual ne fonctionne pas
        const enrichedCategories = await Promise.all(
            categories.map(async (category) => {
                if (typeof category.productCount !== 'number') {
                    const { Product } = await import('../../../models')
                    const productCount = await Product.countDocuments({
                        categoryId: category._id,
                        isActive: true
                    })
                    return { ...category, productCount }
                }
                return category
            })
        )

        return res.status(200).json(
            createResponse.success(
                enrichedCategories,
                'Catégories featured récupérées avec succès',
                { count: enrichedCategories.length }
            )
        )

    } catch (error) {
        throw error // Géré par le middleware withErrorHandling
    }
}

export default withPublicAPI({
    methods: ['GET'],
    cacheSeconds: 3600, // Cache 1 heure
    rateLimitMax: 200   // Limite généreuse pour cette route publique
})(handler)