import { withPublicAPI, createResponse } from '@/middleware/api'
import { Category, Product } from '@/models'

async function handler(req, res) {
    try {
        const { slug } = req.query

        if (!slug) {
            return res.status(400).json(
                createResponse.error('Slug de la catégorie requis', 'MISSING_SLUG')
            )
        }

        // Récupérer la catégorie par slug
        const category = await Category
            .findOne({
                slug,
                isActive: true
            })
            .lean()

        if (!category) {
            return res.status(404).json(
                createResponse.error('Catégorie non trouvée', 'CATEGORY_NOT_FOUND')
            )
        }

        // Statistiques de la catégorie
        const [
            totalProducts,
            inStockProducts,
            averagePrice,
            priceRange,
            essenceDistribution
        ] = await Promise.all([
            // Nombre total de produits
            Product.countDocuments({
                categoryId: category._id,
                isActive: true
            }),

            // Produits en stock
            Product.countDocuments({
                categoryId: category._id,
                isActive: true,
                stock: { $gt: 0 }
            }),

            // Prix moyen
            Product.aggregate([
                { $match: { categoryId: category._id, isActive: true } },
                { $group: { _id: null, avgPrice: { $avg: '$price' } } }
            ]).then(result => result[0]?.avgPrice || 0),

            // Fourchette de prix
            Product.aggregate([
                { $match: { categoryId: category._id, isActive: true } },
                {
                    $group: {
                        _id: null,
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' }
                    }
                }
            ]).then(result => result[0] || { minPrice: 0, maxPrice: 0 }),

            // Distribution des essences
            Product.aggregate([
                { $match: { categoryId: category._id, isActive: true } },
                { $group: { _id: '$essence', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ])
        ])

        // Récupérer les produits populaires de cette catégorie
        const featuredProducts = await Product
            .find({
                categoryId: category._id,
                isActive: true,
                stock: { $gt: 0 }
            })
            .populate('categoryId', 'name slug')
            .sort({ featured: -1, averageRating: -1, salesCount: -1 })
            .limit(8)
            .lean()

        // Enrichir les produits
        const enrichedProducts = featuredProducts.map(product => ({
            ...product,
            category: product.categoryId,
            discountPercentage: product.compareAtPrice && product.compareAtPrice > product.price
                ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                : 0,
            inStock: product.stock > 0
        }))

        // Enrichir la catégorie avec des statistiques
        const enrichedCategory = {
            ...category,
            productCount: totalProducts,
            inStockCount: inStockProducts,
            averagePrice: Math.round(averagePrice || 0),
            priceRange: {
                min: Math.round(priceRange.minPrice || 0),
                max: Math.round(priceRange.maxPrice || 0)
            },
            essences: essenceDistribution.map(essence => ({
                name: essence._id,
                count: essence.count,
                percentage: totalProducts > 0 ? Math.round((essence.count / totalProducts) * 100) : 0
            })),
            stats: {
                stockPercentage: totalProducts > 0 ? Math.round((inStockProducts / totalProducts) * 100) : 0,
                averageRating: featuredProducts.length > 0
                    ? Math.round((featuredProducts.reduce((sum, p) => sum + (p.averageRating || 0), 0) / featuredProducts.length) * 10) / 10
                    : 0,
                bestsellersCount: featuredProducts.filter(p => p.bestseller).length,
                newProductsCount: featuredProducts.filter(p => {
                    const thirtyDaysAgo = new Date()
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                    return new Date(p.createdAt) >= thirtyDaysAgo
                }).length
            }
        }

        // Catégories associées/similaires
        const relatedCategories = await Category
            .find({
                _id: { $ne: category._id },
                isActive: true,
                featured: true
            })
            .select('name slug shortDescription image')
            .limit(3)
            .lean()

        // Métadonnées SEO dynamiques
        const seoMetadata = {
            title: category.seoTitle || `${category.name} | BoisChauffage Pro`,
            description: category.seoDescription || `${category.shortDescription}. ${totalProducts} produits disponibles, livraison 24-48h.`,
            keywords: [
                category.name,
                'bois de chauffage',
                ...essenceDistribution.map(e => e._id),
                'livraison rapide'
            ].filter(Boolean).join(', '),
            canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${category.slug}`,
            ogImage: category.image || '/images/og-category-default.jpg'
        }

        return res.status(200).json(
            createResponse.success(
                {
                    category: enrichedCategory,
                    products: enrichedProducts,
                    relatedCategories,
                    seo: seoMetadata
                },
                'Catégorie récupérée avec succès',
                {
                    totalProducts,
                    inStockProducts,
                    featuredProductsCount: enrichedProducts.length
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