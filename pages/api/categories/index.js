import connectDB, { handleDBErrors } from '@/lib/mongoose'
import { Category } from '@/models'

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

        const { featured, active = 'true' } = req.query

        // Construction du filtre
        let filter = {}

        if (active === 'true') {
            filter.isActive = true
        }

        if (featured === 'true') {
            filter.featured = true
        }

        // Récupérer les catégories avec le nombre de produits
        const categories = await Category
            .find(filter)
            .populate('productCount') // Utilise le virtual
            .sort({ order: 1, name: 1 })
            .lean() // Pour de meilleures performances

        // Enrichir avec les statistiques de produits si le virtual ne fonctionne pas
        const enrichedCategories = await Promise.all(
            categories.map(async (category) => {
                if (!category.productCount) {
                    // Fallback si le virtual ne fonctionne pas
                    const Product = (await import('../../../models')).Product
                    const productCount = await Product.countDocuments({
                        categoryId: category._id,
                        isActive: true
                    })
                    return { ...category, productCount }
                }
                return category
            })
        )

        // Cache headers
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

        return res.status(200).json({
            success: true,
            data: enrichedCategories,
            count: enrichedCategories.length,
            message: 'Catégories récupérées avec succès'
        })

    } catch (error) {
        console.error('Erreur API categories:', error)
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