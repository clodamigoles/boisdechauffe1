import connectDB, { handleDBErrors, withTransaction } from '@/lib/mongoose'
import { Newsletter } from '@/models'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`
        })
    }

    try {
        // Connexion à la base de données
        await connectDB()

        const { email, firstName, interests = [], source = 'unknown' } = req.body

        // Validation des données avec Mongoose
        const newsletterData = {
            email: email?.toLowerCase().trim(),
            firstName: firstName?.trim() || undefined,
            interests: Array.isArray(interests) ? interests : [],
            source,
            metadata: {
                ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                referer: req.headers.referer
            }
        }

        // Utilisation d'une transaction pour garantir la cohérence
        const result = await withTransaction(async (session) => {
            // Vérifier si l'email existe déjà
            const existingSubscriber = await Newsletter.findOne({
                email: newsletterData.email
            }).session(session)

            if (existingSubscriber) {
                // Si l'abonné existe et est actif
                if (existingSubscriber.isActive) {
                    throw new Error('EMAIL_EXISTS')
                }

                // Si l'abonné existe mais est inactif, le réactiver
                const updatedSubscriber = await Newsletter.findOneAndUpdate(
                    { email: newsletterData.email },
                    {
                        $set: {
                            isActive: true,
                            firstName: newsletterData.firstName || existingSubscriber.firstName,
                            interests: newsletterData.interests.length > 0
                                ? newsletterData.interests
                                : existingSubscriber.interests,
                            source: newsletterData.source,
                            subscribedAt: new Date(),
                            unsubscribedAt: null,
                            'metadata.ipAddress': newsletterData.metadata.ipAddress,
                            'metadata.userAgent': newsletterData.metadata.userAgent,
                            'metadata.referer': newsletterData.metadata.referer
                        }
                    },
                    {
                        new: true,
                        session,
                        runValidators: true
                    }
                )

                return {
                    subscriber: updatedSubscriber,
                    reactivated: true
                }
            }

            // Créer un nouvel abonné avec validation Mongoose automatique
            const newSubscriber = new Newsletter(newsletterData)
            await newSubscriber.save({ session })

            return {
                subscriber: newSubscriber,
                reactivated: false
            }
        })

        // Statistiques pour le tableau de bord
        const stats = await getNewsletterStats()

        if (result.reactivated) {
            return res.status(200).json({
                success: true,
                message: 'Votre abonnement a été réactivé avec succès !',
                data: {
                    email: result.subscriber.email,
                    subscriberId: result.subscriber._id,
                    reactivated: true
                },
                stats
            })
        }

        return res.status(201).json({
            success: true,
            message: 'Inscription réussie ! Vérifiez votre boîte mail pour confirmer votre abonnement.',
            data: {
                email: result.subscriber.email,
                subscriberId: result.subscriber._id,
                requiresConfirmation: true
            },
            stats
        })

    } catch (error) {
        console.error('Erreur API newsletter/subscribe:', error)

        // Gestion spécifique de l'erreur d'email existant
        if (error.message === 'EMAIL_EXISTS') {
            return res.status(409).json({
                success: false,
                message: 'Cette adresse email est déjà inscrite à notre newsletter'
            })
        }

        const dbError = handleDBErrors(error)

        // Erreur de contrainte unique (email déjà existant)
        if (dbError.type === 'DUPLICATE_ERROR') {
            return res.status(409).json({
                success: false,
                message: 'Cette adresse email est déjà inscrite'
            })
        }

        // Erreur de validation
        if (dbError.type === 'VALIDATION_ERROR') {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: dbError.errors
            })
        }

        return res.status(500).json({
            success: false,
            message: dbError.message,
            type: dbError.type,
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message
            })
        })
    }
}

// Fonction utilitaire pour récupérer les statistiques de la newsletter avec Mongoose
async function getNewsletterStats() {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const [totalSubscribers, activeSubscribers, todaySubscribers] = await Promise.all([
            Newsletter.countDocuments(),
            Newsletter.countDocuments({ isActive: true }),
            Newsletter.countDocuments({
                subscribedAt: { $gte: today }
            })
        ])

        return {
            total: totalSubscribers,
            active: activeSubscribers,
            today: todaySubscribers,
            growthRate: totalSubscribers > 0 ? (todaySubscribers / totalSubscribers * 100).toFixed(2) : 0
        }
    } catch (error) {
        console.error('Erreur lors du calcul des stats newsletter:', error)
        return null
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}