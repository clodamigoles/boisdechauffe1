import { withPublicAPI, createResponse, rateLimiters } from '@/middleware/api'
import { Newsletter } from '@/models'
import crypto from 'crypto'

async function handler(req, res) {
    try {
        const { email, token, reason } = req.body

        // Validation des données requises
        if (!email) {
            return res.status(400).json(
                createResponse.error('Adresse email requise', 'MISSING_EMAIL')
            )
        }

        // Normaliser l'email
        const normalizedEmail = email.toLowerCase().trim()

        // Vérifier si l'abonné existe
        const subscriber = await Newsletter.findOne({
            email: normalizedEmail
        })

        if (!subscriber) {
            return res.status(404).json(
                createResponse.error('Adresse email non trouvée dans notre liste', 'EMAIL_NOT_FOUND')
            )
        }

        // Si déjà désabonné
        if (!subscriber.isActive) {
            return res.status(200).json(
                createResponse.success(
                    { email: normalizedEmail, alreadyUnsubscribed: true },
                    'Cette adresse email était déjà désabonnée'
                )
            )
        }

        // Vérification du token si fourni (pour les liens de désabonnement sécurisés)
        if (token) {
            const expectedToken = crypto
                .createHash('sha256')
                .update(`${subscriber._id}${subscriber.email}${process.env.JWT_SECRET}`)
                .digest('hex')

            if (token !== expectedToken) {
                return res.status(401).json(
                    createResponse.error('Token de désabonnement invalide', 'INVALID_TOKEN')
                )
            }
        }

        // Mettre à jour l'abonné
        const updatedSubscriber = await Newsletter.findByIdAndUpdate(
            subscriber._id,
            {
                $set: {
                    isActive: false,
                    unsubscribedAt: new Date(),
                    unsubscribeReason: reason || 'Non spécifiée',
                    'metadata.unsubscribeIP': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                    'metadata.unsubscribeUserAgent': req.headers['user-agent']
                }
            },
            { new: true, runValidators: true }
        )

        // Statistiques post-désabonnement
        const stats = await getUnsubscribeStats()

        // Log pour analytics (optionnel)
        console.log(`Newsletter unsubscribe: ${normalizedEmail} - Reason: ${reason || 'Non spécifiée'}`)

        return res.status(200).json(
            createResponse.success(
                {
                    email: normalizedEmail,
                    unsubscribedAt: updatedSubscriber.unsubscribedAt,
                    subscriberId: updatedSubscriber._id
                },
                'Désabonnement effectué avec succès',
                { stats }
            )
        )

    } catch (error) {
        throw error // Géré par le middleware withErrorHandling
    }
}

// Fonction utilitaire pour les statistiques de désabonnement
async function getUnsubscribeStats() {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const [totalSubscribers, activeSubscribers, todayUnsubscribes, totalUnsubscribes] = await Promise.all([
            Newsletter.countDocuments(),
            Newsletter.countDocuments({ isActive: true }),
            Newsletter.countDocuments({
                unsubscribedAt: { $gte: today }
            }),
            Newsletter.countDocuments({ isActive: false })
        ])

        return {
            total: totalSubscribers,
            active: activeSubscribers,
            unsubscribed: totalUnsubscribes,
            todayUnsubscribes,
            retentionRate: totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0
        }
    } catch (error) {
        console.error('Erreur lors du calcul des stats de désabonnement:', error)
        return null
    }
}

export default withPublicAPI({
    methods: ['POST'],
    cacheSeconds: 0, // Pas de cache pour cette route
    rateLimitMax: 10   // Limite stricte pour éviter l'abus
})(handler)