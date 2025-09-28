import connectDB, { handleDBErrors } from '@/lib/mongoose'
import { Product, Category } from '@/models'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`
        })
    }

    try {
        // Connexion à la base de données
        await connectDB()

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
            const categoryDoc = await Category.findOne({ slug: category }).lean()
            if (categoryDoc) {
                filter.categoryId = categoryDoc._id
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

        // Recherche textuelle avec Mongoose
        if (search) {
            filter.$text = { $search: search }
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

        // Si recherche textuelle, ajouter le score de pertinence au tri
        if (search) {
            sortOptions = { score: { $meta: 'textScore' }, ...sortOptions }
        }

        // Pagination
        const pageNum = Math.max(1, parseInt(page))
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
        const skip = (pageNum - 1) * limitNum

        // Exécution des requêtes en parallèle pour optimiser les performances
        const [products, totalCount] = await Promise.all([
            Product
                .find(filter)
                .populate('categoryId', 'name slug') // Populate la catégorie
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Product.countDocuments(filter)
        ])

        const totalPages = Math.ceil(totalCount / limitNum)

        // Transformation des données pour inclure les virtuals
        const enrichedProducts = products.map(product => ({
            ...product,
            category: product.categoryId, // Renommage pour compatibilité frontend
            discountPercentage: product.compareAtPrice && product.compareAtPrice > product.price
                ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                : 0,
            inStock: product.stock > 0
        }))

        // Statistiques de recherche
        const searchStats = {
            total: totalCount,
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
            products: enrichedProducts,
            stats: searchStats,
            total: totalCount,
            totalPages,
            currentPage: pageNum,
            message: `${enrichedProducts.length} produits trouvés`
        })

    } catch (error) {
        console.error('Erreur API products/search:', error)
        const dbError = handleDBErrors(error)

        return res.status(500).json({
            success: false,
            message: dbError.message,
            type: dbError.type,
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message,
                stack: error.stack
            })
        })
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}