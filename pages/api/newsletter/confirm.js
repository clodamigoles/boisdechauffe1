import { withPublicAPI, createResponse } from '@/middleware/api'
import { Newsletter } from '@/models'
import crypto from 'crypto'

async function handler(req, res) {
    try {
        const { token } = req.body

        if (!token) {
            return res.status(400).json(
                createResponse.error('Token de confirmation requis', 'MISSING_TOKEN')
            )
        }

        // Décoder le token pour extraire l'ID de l'abonné
        let subscriberId
        try {
            // Format du token: base64(subscriberId:timestamp:hash)
            const decoded = Buffer.from(token, 'base64').toString('utf8')
            const [id, timestamp, hash] = decoded.split(':')

            // Vérifier que le token n'est pas expiré (7 jours max)
            const tokenAge = Date.now() - parseInt(timestamp)
            const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 jours en millisecondes

            if (tokenAge > maxAge) {
                return res.status(400).json(
                    createResponse.error('Token de confirmation expiré', 'TOKEN_EXPIRED')
                )
            }

            // Vérifier l'intégrité du token
            const expectedHash = crypto
                .createHash('sha256')
                .update(`${id}${timestamp}${process.env.JWT_SECRET}`)
                .digest('hex')

            if (hash !== expectedHash) {
                return res.status(401).json(
                    createResponse.error('Token de confirmation invalide', 'INVALID_TOKEN')
                )
            }

            subscriberId = id
        } catch (error) {
            return res.status(400).json(
                createResponse.error('Format de token invalide', 'MALFORMED_TOKEN')
            )
        }

        // Récupérer l'abonné
        const subscriber = await Newsletter.findById(subscriberId)

        if (!subscriber) {
            return res.status(404).json(
                createResponse.error('Abonné non trouvé', 'SUBSCRIBER_NOT_FOUND')
            )
        }

        // Vérifier si déjà confirmé
        if (subscriber.confirmedAt) {
            return res.status(200).json(
                createResponse.success(
                    {
                        email: subscriber.email,
                        alreadyConfirmed: true,
                        confirmedAt: subscriber.confirmedAt
                    },
                    'Cette adresse email était déjà confirmée'
                )
            )
        }

        // Vérifier si l'abonné est toujours actif
        if (!subscriber.isActive) {
            return res.status(400).json(
                createResponse.error('Cet abonnement a été annulé', 'SUBSCRIPTION_CANCELLED')
            )
        }

        // Confirmer l'abonnement
        const updatedSubscriber = await Newsletter.findByIdAndUpdate(
            subscriberId,
            {
                $set: {
                    confirmedAt: new Date(),
                    isActive: true,
                    'metadata.confirmationIP': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                    'metadata.confirmationUserAgent': req.headers['user-agent']
                }
            },
            { new: true, runValidators: true }
        )

        // Statistiques post-confirmation
        const stats = await getConfirmationStats()

        // Log pour analytics
        console.log(`Newsletter confirmation: ${subscriber.email}`)

        // TODO: Envoyer email de bienvenue
        // await sendWelcomeEmail(subscriber.email, subscriber.firstName)

        return res.status(200).json(
            createResponse.success(
                {
                    email: subscriber.email,
                    firstName: subscriber.firstName,
                    confirmedAt: updatedSubscriber.confirmedAt,
                    interests: subscriber.interests
                },
                'Abonnement confirmé avec succès ! Bienvenue dans notre communauté.',
                { stats }
            )
        )

    } catch (error) {
        throw error // Géré par le middleware withErrorHandling
    }
}

// Fonction utilitaire pour les statistiques de confirmation
async function getConfirmationStats() {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const [totalSubscribers, confirmedSubscribers, todayConfirmations] = await Promise.all([
            Newsletter.countDocuments({ isActive: true }),
            Newsletter.countDocuments({
                isActive: true,
                confirmedAt: { $exists: true, $ne: null }
            }),
            Newsletter.countDocuments({
                confirmedAt: { $gte: today }
            })
        ])

        return {
            total: totalSubscribers,
            confirmed: confirmedSubscribers,
            pending: totalSubscribers - confirmedSubscribers,
            todayConfirmations,
            confirmationRate: totalSubscribers > 0 ? Math.round((confirmedSubscribers / totalSubscribers) * 100) : 0
        }
    } catch (error) {
        console.error('Erreur lors du calcul des stats de confirmation:', error)
        return null
    }
}

// Fonction utilitaire pour générer un token de confirmation
export function generateConfirmationToken(subscriberId) {
    const timestamp = Date.now().toString()
    const hash = crypto
        .createHash('sha256')
        .update(`${subscriberId}${timestamp}${process.env.JWT_SECRET}`)
        .digest('hex')

    const tokenData = `${subscriberId}:${timestamp}:${hash}`
    return Buffer.from(tokenData).toString('base64')
}

export default withPublicAPI({
    methods: ['POST'],
    cacheSeconds: 0, // Pas de cache
    rateLimitMax: 20
})(handler)