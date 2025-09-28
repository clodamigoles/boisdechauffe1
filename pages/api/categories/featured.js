import { DatabaseUtils } from '../../../lib/mongodb'

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
        // Récupérer les catégories featured
        const categories = await DatabaseUtils.findMany(
            'categories',
            {
                featured: true,
                isActive: true
            },
            {
                sort: { order: 1, createdAt: -1 },
                limit: 4
            }
        )

        // Si aucune catégorie featured trouvée, retourner les 4 premières actives
        if (categories.length === 0) {
            const fallbackCategories = await DatabaseUtils.findMany(
                'categories',
                { isActive: true },
                {
                    sort: { productCount: -1, createdAt: -1 },
                    limit: 4
                }
            )

            return res.status(200).json({
                success: true,
                data: fallbackCategories,
                message: 'Catégories par défaut retournées (aucune featured trouvée)',
                count: fallbackCategories.length
            })
        }

        // Cache headers pour optimiser les performances
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

        return res.status(200).json({
            success: true,
            data: categories,
            count: categories.length,
            message: 'Catégories featured récupérées avec succès'
        })

    } catch (error) {
        console.error('Erreur API categories/featured:', error)

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