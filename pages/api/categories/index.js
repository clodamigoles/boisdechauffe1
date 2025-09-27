import { connectToDatabase, Category } from '@/lib/models'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        await connectToDatabase()

        // Récupérer toutes les catégories actives, triées par ordre
        const categories = await Category
            .find({ isActive: true })
            .sort({ order: 1, createdAt: 1 })
            .select('name slug description image order')

        res.status(200).json({
            success: true,
            data: categories,
            count: categories.length
        })
    } catch (error) {
        console.error('Error fetching categories:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        })
    }
}