import { connectToDatabase, Order } from '@/lib/models'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        await connectToDatabase()

        const { orderNumber } = req.query

        // Récupérer la commande par numéro
        const order = await Order
            .findOne({ orderNumber })
            .populate('items.productId', 'name slug images')
            .lean()

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande introuvable'
            })
        }

        res.status(200).json({
            success: true,
            data: order
        })

    } catch (error) {
        console.error('Error fetching order:', error)
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la commande',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
        })
    }
}