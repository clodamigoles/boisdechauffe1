import { withPublicAPI, createResponse } from '@/middleware/api'
import { Product, Category } from '@/models'

async function handler(req, res) {
    try {
        const { filter = 'all', limit = 8 } = req.query

        // Construire le filtre de base
        let baseFilter = {
            isActive: true,
            stock: { $gt: 0 } // Seulement les produits en stock
        }

        // Ajouter des filtres spécifiques
        switch (filter) {
            case 'featured':
                baseFilter.featured = true
                break
            case 'bestseller':
                baseFilter.bestseller = true
                break
            case 'trending':
                baseFilter.trending = true
                break
            case 'new':
                // Produits créés dans les 30 derniers jours
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                baseFilter.createdAt = { $gte: thirtyDaysAgo }
                break
            case 'promotion':
                baseFilter.compareAtPrice = { $exists: true, $ne: null }
                break
            default:
                // Pour 'all', on privilégie les produits featured, puis bestseller
                baseFilter = {
                    ...baseFilter,
                    $or: [
                        { featured: true },
                        { bestseller: true },
                        { trending: true }
                    ]
                }
        }

        // Options de tri optimisées
        let sortOptions = {}
        switch (filter) {
            case 'bestseller':
                sortOptions = { salesCount: -1, averageRating: -1 }
                break
            case 'trending':
                sortOptions = { viewCount: -1, salesCount: -1 }
                break
            case 'new':
                sortOptions = { createdAt: -1 }
                break
            case 'promotion':
                // Créer un tri par pourcentage de réduction calculé
                sortOptions = { compareAtPrice: -1, price: 1 }
                break
            default:
                sortOptions = { featured: -1, bestseller: -1, averageRating: -1, salesCount: -1 }
        }

        // Récupérer les produits avec Mongoose
        const products = await Product
            .find(baseFilter)
            .populate('categoryId', 'name slug') // Populate la catégorie
            .sort(sortOptions)
            .limit(parseInt(limit))
            .lean()

        // Si aucun produit trouvé avec les filtres, récupérer les produits par défaut
        if (products.length === 0 && filter !== 'all') {
            const fallbackProducts = await Product
                .find({
                    isActive: true,
                    stock: { $gt: 0 }
                })
                .populate('categoryId', 'name slug')
                .sort({ averageRating: -1, salesCount: -1 })
                .limit(parseInt(limit))
                .lean()

            return res.status(200).json(
                createResponse.success(
                    fallbackProducts.map(product => ({
                        ...product,
                        category: product.categoryId, // Renommage pour compatibilité frontend
                        discountPercentage: product.compareAtPrice && product.compareAtPrice > product.price
                            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                            : 0,
                        inStock: product.stock > 0
                    })),
                    `Aucun produit ${filter} trouvé, produits par défaut retournés`,
                    {
                        count: fallbackProducts.length,
                        filter: 'default',
                        fallback: true
                    }
                )
            )
        }

        // Transformation des données pour inclure les propriétés calculées
        const enrichedProducts = products.map(product => ({
            ...product,
            category: product.categoryId, // Renommage pour compatibilité frontend
            discountPercentage: product.compareAtPrice && product.compareAtPrice > product.price
                ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                : 0,
            inStock: product.stock > 0
        }))

        // Calculer des statistiques supplémentaires
        const stats = {
            totalProducts: enrichedProducts.length,
            averagePrice: enrichedProducts.length > 0
                ? Math.round(enrichedProducts.reduce((sum, p) => sum + p.price, 0) / enrichedProducts.length)
                : 0,
            averageRating: enrichedProducts.length > 0
                ? Math.round((enrichedProducts.reduce((sum, p) => sum + (p.averageRating || 0), 0) / enrichedProducts.length) * 10) / 10
                : 0,
            inStock: enrichedProducts.filter(p => p.stock > 0).length,
            withPromotion: enrichedProducts.filter(p => p.compareAtPrice).length,
            essences: [...new Set(enrichedProducts.map(p => p.essence))].length
        }

        return res.status(200).json(
            createResponse.success(
                enrichedProducts,
                'Produits featured récupérés avec succès',
                {
                    count: enrichedProducts.length,
                    filter,
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
    cacheSeconds: 1800, // Cache 30 minutes
    rateLimitMax: 150
})(handler)