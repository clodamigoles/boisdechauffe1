import { DatabaseUtils } from '../../../lib/mongodb'

export default async function handler(req, res) {
    // Autorise seulement POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`
        })
    }

    try {
        const { email, firstName, interests = [], source = 'unknown' } = req.body

        // Validation des données
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'L\'adresse email est requise'
            })
        }

        // Validation du format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'email invalide'
            })
        }

        // Normaliser l'email
        const normalizedEmail = email.toLowerCase().trim()

        // Vérifier si l'email existe déjà
        const existingSubscriber = await DatabaseUtils.findOne(
            'newsletter_subscribers',
            { email: normalizedEmail }
        )

        if (existingSubscriber) {
            // Si l'abonné existe et est actif
            if (existingSubscriber.isActive) {
                return res.status(409).json({
                    success: false,
                    message: 'Cette adresse email est déjà inscrite à notre newsletter'
                })
            }

            // Si l'abonné existe mais est inactif, le réactiver
            await DatabaseUtils.updateOne(
                'newsletter_subscribers',
                { email: normalizedEmail },
                {
                    $set: {
                        isActive: true,
                        firstName: firstName || existingSubscriber.firstName,
                        interests: interests.length > 0 ? interests : existingSubscriber.interests,
                        source,
                        subscribedAt: new Date(),
                        unsubscribedAt: null
                    }
                }
            )

            return res.status(200).json({
                success: true,
                message: 'Votre abonnement a été réactivé avec succès !',
                data: {
                    email: normalizedEmail,
                    reactivated: true
                }
            })
        }

        // Créer un nouvel abonné
        const newSubscriber = {
            email: normalizedEmail,
            firstName: firstName?.trim() || null,
            source,
            interests: Array.isArray(interests) ? interests : [],
            isActive: true,
            confirmedAt: null, // À confirmer par double opt-in
            subscribedAt: new Date(),
            unsubscribedAt: null,
            metadata: {
                ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                referer: req.headers.referer
            }
        }

        const insertedSubscriber = await DatabaseUtils.insertOne(
            'newsletter_subscribers',
            newSubscriber
        )

        // TODO: Envoyer un email de confirmation (double opt-in)
        // await sendConfirmationEmail(normalizedEmail, insertedSubscriber._id)

        // Statistiques pour le tableau de bord
        const stats = await getNewsletterStats()

        return res.status(201).json({
            success: true,
            message: 'Inscription réussie ! Vérifiez votre boîte mail pour confirmer votre abonnement.',
            data: {
                email: normalizedEmail,
                subscriberId: insertedSubscriber._id,
                requiresConfirmation: true
            },
            stats
        })

    } catch (error) {
        console.error('Erreur API newsletter/subscribe:', error)

        // Erreur de contrainte unique (email déjà existant)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Cette adresse email est déjà inscrite'
            })
        }

        return res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

// Fonction utilitaire pour récupérer les statistiques de la newsletter
async function getNewsletterStats() {
    try {
        const [totalSubscribers, activeSubscribers, todaySubscribers] = await Promise.all([
            DatabaseUtils.count('newsletter_subscribers'),
            DatabaseUtils.count('newsletter_subscribers', { isActive: true }),
            DatabaseUtils.count('newsletter_subscribers', {
                subscribedAt: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            })
        ])

        return {
            total: totalSubscribers,
            active: activeSubscribers,
            today: todaySubscribers
        }
    } catch (error) {
        console.error('Erreur lors du calcul des stats newsletter:', error)
        return null
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