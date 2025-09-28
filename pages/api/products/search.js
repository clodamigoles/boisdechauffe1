import { DatabaseUtils } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`
        })
    }

    try {
        const {
            search = '',
            category = '',
            essence = '',
            priceRange = '',
            inStock = '',
            badges = '',
            promotion = '',
            sort = 'name-asc',
            page = '1',
            limit = '12'
        } = req.query

        // Construction du filtre de base
        let filter = { isActive: true }

        // Filtre de stock
        if (inStock === 'true') {
            filter.stock = { $gt: 0 }
        }

        // Filtre de catégorie
        if (category) {
            try {
                const categoryDoc = await DatabaseUtils.findOne('categories', { slug: category })
                if (categoryDoc) {
                    filter.categoryId = categoryDoc._id
                }
            } catch (error) {
                console.error('Erreur lors de la recherche de catégorie:', error)
            }
        }

        // Filtre d'essence
        if (essence) {
            filter.essence = essence
        }

        // Filtre de prix
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(p => p === '+' ? null : parseInt(p))
            if (min !== null && max !== null) {
                filter.price = { $gte: min, $lte: max }
            } else if (min !== null) {
                filter.price = { $gte: min }
            } else if (max !== null) {
                filter.price = { $lte: max }
            }
        }

        // Filtre de badges
        if (badges) {
            filter.badges = { $in: [badges] }
        }

        // Filtre de promotion
        if (promotion === 'true') {
            filter.compareAtPrice = { $exists: true, $ne: null }
        }

        // Recherche textuelle
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { shortDescription: { $regex: search, $options: 'i' } },
                { essence: { $regex: search, $options: 'i' } }
            ]
        }

        // Options de tri
        let sortOptions = {}
        switch (sort) {
            case 'name-asc':
                sortOptions = { name: 1 }
                break
            case 'name-desc':
                sortOptions = { name: -1 }
                break
            case 'price-asc':
                sortOptions = { price: 1 }
                break
            case 'price-desc':
                sortOptions = { price: -1 }
                break
            case 'rating-desc':
                sortOptions = { averageRating: -1, reviewCount: -1 }
                break
            case 'sales-desc':
                sortOptions = { salesCount: -1 }
                break
            case 'created-desc':
                sortOptions = { createdAt: -1 }
                break
            case 'created-asc':
                sortOptions = { createdAt: 1 }
                break
            default:
                sortOptions = { name: 1 }
        }

        // Pagination
        const pageNum = Math.max(1, parseInt(page))
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
        const skip = (pageNum - 1) * limitNum

        // Requête avec agrégation pour joindre les catégories
        const aggregationPipeline = [
            { $match: filter },
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
            { $skip: skip },
            { $limit: limitNum }
        ]

        // Récupérer les produits
        const products = await DatabaseUtils.aggregate('products', aggregationPipeline)

        // Compter le total pour la pagination
        const totalCountPipeline = [
            { $match: filter },
            { $count: 'total' }
        ]
        const totalCountResult = await DatabaseUtils.aggregate('products', totalCountPipeline)
        const total = totalCountResult.length > 0 ? totalCountResult[0].total : 0
        const totalPages = Math.ceil(total / limitNum)

        // Statistiques de recherche
        const searchStats = {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        }

        // Cache headers
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')

        return res.status(200).json({
            success: true,
            products,
            stats: searchStats,
            total,
            totalPages,
            currentPage: pageNum,
            message: `${products.length} produits trouvés`
        })

    } catch (error) {
        console.error('Erreur API products/search:', error)

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