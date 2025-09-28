import { DatabaseUtils } from '../../../lib/mongodb'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`
        })
    }

    try {
        const { featured, active = 'true' } = req.query

        // Construction du filtre
        let filter = {}

        if (active === 'true') {
            filter.isActive = true
        }

        if (featured === 'true') {
            filter.featured = true
        }

        // Options de tri
        const sortOptions = { order: 1, name: 1 }

        // Récupérer les catégories
        const categories = await DatabaseUtils.findMany(
            'categories',
            filter,
            { sort: sortOptions }
        )

        // Enrichir avec les statistiques de produits
        const enrichedCategories = await Promise.all(
            categories.map(async (category) => {
                try {
                    const productCount = await DatabaseUtils.count('products', {
                        categoryId: category._id,
                        isActive: true
                    })

                    return {
                        ...category,
                        productCount
                    }
                } catch (error) {
                    console.error(`Erreur lors du comptage des produits pour la catégorie ${category._id}:`, error)
                    return {
                        ...category,
                        productCount: 0
                    }
                }
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