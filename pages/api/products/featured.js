import { connectToDatabase, Product } from '@/lib/models'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        await connectToDatabase()

        const { limit = 6 } = req.query

        // Récupérer les produits mis en avant
        const featuredProducts = await Product
            .find({
                featured: true,
                isActive: true,
                stock: { $gt: 0 } // Seulement les produits en stock
            })
            .populate('categoryId', 'name slug')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('name slug price compareAtPrice unit essence images badges averageRating reviewCount stock featured')

        res.status(200).json({
            success: true,
            data: featuredProducts,
            count: featuredProducts.length
        })
    } catch (error) {
        console.error('Error fetching featured products:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        })
    }
}