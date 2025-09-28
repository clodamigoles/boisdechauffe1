import { withPublicAPI, createResponse } from '@/middleware/api'
import { Product, Category } from '@/models'

async function handler(req, res) {
    try {
        const { slug } = req.query

        if (!slug) {
            return res.status(400).json(
                createResponse.error('Slug du produit requis', 'MISSING_SLUG')
            )
        }

        // Récupérer le produit par slug avec sa catégorie
        const product = await Product
            .findOne({
                slug,
                isActive: true
            })
            .populate('categoryId', 'name slug shortDescription')
            .lean()

        if (!product) {
            return res.status(404).json(
                createResponse.error('Produit non trouvé', 'PRODUCT_NOT_FOUND')
            )
        }

        // Incrémenter le compteur de vues (en arrière-plan)
        Product.findByIdAndUpdate(
            product._id,
            { $inc: { viewCount: 1 } },
            { new: false }
        ).exec().catch(err => console.error('Erreur mise à jour viewCount:', err))

        // Enrichir le produit avec des propriétés calculées
        const enrichedProduct = {
            ...product,
            category: product.categoryId, // Renommage pour compatibilité frontend
            discountPercentage: product.compareAtPrice && product.compareAtPrice > product.price
                ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                : 0,
            inStock: product.stock > 0,
            isLowStock: product.stock > 0 && product.stock <= 5,
            isNew: (() => {
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                return new Date(product.createdAt) >= thirtyDaysAgo
            })(),
            economyPerStere: product.compareAtPrice
                ? Math.round(product.compareAtPrice - product.price)
                : 0,
            deliveryEstimate: '24-48h', // À calculer selon la région
            carbonFootprint: product.essence === 'granulés' ? 'Faible' : 'Très faible'
        }

        // Récupérer des produits similaires
        const similarProducts = await Product
            .find({
                _id: { $ne: product._id },
                $or: [
                    { categoryId: product.categoryId },
                    { essence: product.essence }
                ],
                isActive: true,
                stock: { $gt: 0 }
            })
            .populate('categoryId', 'name slug')
            .sort({ averageRating: -1, salesCount: -1 })
            .limit(4)
            .lean()

        // Enrichir les produits similaires
        const enrichedSimilarProducts = similarProducts.map(similarProduct => ({
            ...similarProduct,
            category: similarProduct.categoryId,
            discountPercentage: similarProduct.compareAtPrice && similarProduct.compareAtPrice > similarProduct.price
                ? Math.round(((similarProduct.compareAtPrice - similarProduct.price) / similarProduct.compareAtPrice) * 100)
                : 0,
            inStock: similarProduct.stock > 0
        }))

        // Métadonnées SEO dynamiques
        const seoMetadata = {
            title: product.seoTitle || `${product.name} | BoisChauffage Pro`,
            description: product.seoDescription || `${product.shortDescription}. Livraison 24-48h partout en France.`,
            keywords: [
                product.essence,
                'bois de chauffage',
                'livraison rapide',
                product.categoryId?.name
            ].filter(Boolean).join(', '),
            canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/produits/${product.slug}`,
            ogImage: product.images?.[0]?.url || '/images/og-product-default.jpg'
        }

        return res.status(200).json(
            createResponse.success(
                {
                    product: enrichedProduct,
                    similarProducts: enrichedSimilarProducts,
                    seo: seoMetadata
                },
                'Produit récupéré avec succès',
                {
                    hasStock: enrichedProduct.inStock,
                    similarCount: enrichedSimilarProducts.length
                }
            )
        )

    } catch (error) {
        throw error // Géré par le middleware withErrorHandling
    }
}

export default withPublicAPI({
    methods: ['GET'],
    cacheSeconds: 600, // Cache 10 minutes (contenu dynamique)
    rateLimitMax: 200
})(handler)