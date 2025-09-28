import { DatabaseUtils } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

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

        // Options de tri
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
                // Trier par pourcentage de réduction
                sortOptions = { compareAtPrice: -1, price: 1 }
                break
            default:
                sortOptions = { featured: -1, bestseller: -1, averageRating: -1, salesCount: -1 }
        }

        // Récupérer les produits avec agrégation pour joindre les catégories
        const aggregationPipeline = [
            { $match: baseFilter },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ['$category', 0] },
                    discountPercentage: {
                        $cond: {
                            if: { $and: ['$compareAtPrice', { $gt: ['$compareAtPrice', 0] }] },
                            then: {
                                $round: [
                                    {
                                        $multiply: [
                                            {
                                                $divide: [
                                                    { $subtract: ['$compareAtPrice', '$price'] },
                                                    '$compareAtPrice'
                                                ]
                                            },
                                            100
                                        ]
                                    },
                                    0
                                ]
                            },
                            else: 0
                        }
                    }
                }
            },
            { $sort: sortOptions },
            { $limit: parseInt(limit) }
        ]

        const products = await DatabaseUtils.aggregate('products', aggregationPipeline)

        // Si aucun produit trouvé avec les filtres, récupérer les produits par défaut
        if (products.length === 0 && filter !== 'all') {
            const fallbackProducts = await DatabaseUtils.findMany(
                'products',
                { isActive: true, stock: { $gt: 0 } },
                {
                    sort: { averageRating: -1, salesCount: -1 },
                    limit: parseInt(limit)
                }
            )

            return res.status(200).json({
                success: true,
                data: fallbackProducts,
                message: `Aucun produit ${filter} trouvé, produits par défaut retournés`,
                count: fallbackProducts.length,
                filter: 'default'
            })
        }

        // Calculer des statistiques supplémentaires
        const stats = {
            totalProducts: products.length,
            averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
            averageRating: products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length,
            inStock: products.filter(p => p.stock > 0).length,
            withPromotion: products.filter(p => p.compareAtPrice).length
        }

        // Cache headers pour optimiser les performances
        res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')

        return res.status(200).json({
            success: true,
            data: products,
            count: products.length,
            filter,
            stats,
            message: 'Produits récupérés avec succès'
        })

    } catch (error) {
        console.error('Erreur API products/featured:', error)

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