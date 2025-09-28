import { withPublicAPI, createResponse } from '@/middleware/api'
import { Quote } from '@/models'
import Joi from 'joi'

// Schéma de validation pour les demandes de devis
const quoteRequestSchema = Joi.object({
    // Informations client
    firstName: Joi.string().trim().min(2).max(50).required()
        .messages({
            'string.empty': 'Le prénom est requis',
            'string.min': 'Le prénom doit contenir au moins 2 caractères',
            'string.max': 'Le prénom ne peut dépasser 50 caractères'
        }),

    lastName: Joi.string().trim().min(2).max(50).required()
        .messages({
            'string.empty': 'Le nom est requis',
            'string.min': 'Le nom doit contenir au moins 2 caractères'
        }),

    email: Joi.string().email().lowercase().trim().required()
        .messages({
            'string.email': 'Format d\'email invalide',
            'string.empty': 'L\'email est requis'
        }),

    phone: Joi.string().pattern(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/).required()
        .messages({
            'string.pattern.base': 'Numéro de téléphone français invalide',
            'string.empty': 'Le téléphone est requis'
        }),

    // Adresse de livraison
    address: Joi.object({
        street: Joi.string().trim().min(5).max(200).required(),
        city: Joi.string().trim().min(2).max(100).required(),
        postalCode: Joi.string().pattern(/^[0-9]{5}$/).required()
            .messages({
                'string.pattern.base': 'Code postal invalide (5 chiffres requis)'
            }),
        country: Joi.string().valid('FR').default('FR'),
        accessNotes: Joi.string().max(500).optional()
    }).required(),

    // Détails de la commande
    products: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            productName: Joi.string().required(),
            quantity: Joi.number().positive().max(50).required(),
            unit: Joi.string().valid('stère', 'tonne', 'pack', 'kg', 'sac').required(),
            essence: Joi.string().optional(),
            notes: Joi.string().max(200).optional()
        })
    ).min(1).max(10).required()
        .messages({
            'array.min': 'Au moins un produit doit être sélectionné',
            'array.max': 'Maximum 10 produits par devis'
        }),

    // Préférences de livraison
    delivery: Joi.object({
        preferredDate: Joi.date().min('now').optional(),
        timeSlot: Joi.string().valid('morning', 'afternoon', 'evening', 'flexible').default('flexible'),
        urgency: Joi.string().valid('normal', 'urgent', 'flexible').default('normal'),
        specialInstructions: Joi.string().max(500).optional()
    }).optional(),

    // Informations supplémentaires
    message: Joi.string().max(1000).optional(),
    source: Joi.string().valid('website', 'phone', 'email', 'referral').default('website'),
    acceptsMarketing: Joi.boolean().default(false),

    // Captcha/sécurité (si implémenté)
    captchaToken: Joi.string().optional()
})

async function handler(req, res) {
    if (req.method === 'POST') {
        return handleCreateQuote(req, res)
    } else if (req.method === 'GET') {
        return handleGetQuotes(req, res)
    }
}

async function handleCreateQuote(req, res) {
    try {
        // Validation des données
        const { error, value } = quoteRequestSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })

        if (error) {
            return res.status(400).json(
                createResponse.error(
                    'Données invalides',
                    'VALIDATION_ERROR',
                    error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    }))
                )
            )
        }

        const quoteData = value

        // Vérifier si un devis récent existe déjà pour cet email (protection anti-spam)
        const recentQuote = await Quote.findOne({
            email: quoteData.email,
            createdAt: {
                $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24h
            }
        })

        if (recentQuote) {
            return res.status(429).json(
                createResponse.error(
                    'Un devis a déjà été demandé dans les dernières 24h',
                    'RATE_LIMIT_EXCEEDED'
                )
            )
        }

        // Générer un numéro de devis unique
        const quoteNumber = await generateQuoteNumber()

        // Calculer une estimation de prix (logique métier)
        const priceEstimate = await calculatePriceEstimate(quoteData.products)

        // Créer le devis
        const newQuote = new Quote({
            quoteNumber,
            status: 'pending',
            customer: {
                firstName: quoteData.firstName,
                lastName: quoteData.lastName,
                email: quoteData.email,
                phone: quoteData.phone
            },
            address: quoteData.address,
            products: quoteData.products,
            delivery: quoteData.delivery || {},
            priceEstimate,
            message: quoteData.message,
            source: quoteData.source,
            acceptsMarketing: quoteData.acceptsMarketing,
            metadata: {
                ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                referer: req.headers.referer
            }
        })

        const savedQuote = await newQuote.save()

        // TODO: Envoyer notifications
        // - Email de confirmation au client
        // - Notification à l'équipe commerciale
        // await sendQuoteNotifications(savedQuote)

        // Ajouter à la newsletter si accepté
        if (quoteData.acceptsMarketing) {
            try {
                const { Newsletter } = await import('../../models')
                await Newsletter.findOneAndUpdate(
                    { email: quoteData.email },
                    {
                        $setOnInsert: {
                            email: quoteData.email,
                            firstName: quoteData.firstName,
                            source: 'quote_request',
                            interests: ['promotions'],
                            isActive: true,
                            subscribedAt: new Date()
                        }
                    },
                    { upsert: true, new: true }
                )
            } catch (newsletterError) {
                console.error('Erreur ajout newsletter:', newsletterError)
                // Ne pas faire échouer la demande de devis pour cette erreur
            }
        }

        return res.status(201).json(
            createResponse.success(
                {
                    quoteNumber: savedQuote.quoteNumber,
                    quoteId: savedQuote._id,
                    estimatedPrice: priceEstimate.total,
                    estimatedDelivery: calculateDeliveryEstimate(quoteData.address.postalCode),
                    status: savedQuote.status
                },
                'Demande de devis créée avec succès ! Nous vous contacterons sous 24h.',
                {
                    trackingUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/devis/${savedQuote.quoteNumber}`
                }
            )
        )

    } catch (error) {
        throw error
    }
}

async function handleGetQuotes(req, res) {
    // Cette route nécessiterait une authentification admin
    return res.status(401).json(
        createResponse.error('Authentification requise', 'UNAUTHORIZED')
    )
}

// Fonction utilitaire pour générer un numéro de devis unique
async function generateQuoteNumber() {
    const prefix = 'DEV'
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')

    // Compter les devis du mois
    const startOfMonth = new Date(year, new Date().getMonth(), 1)
    const count = await Quote.countDocuments({
        createdAt: { $gte: startOfMonth }
    })

    const sequence = String(count + 1).padStart(4, '0')
    return `${prefix}${year}${month}${sequence}`
}

// Fonction utilitaire pour calculer l'estimation de prix
async function calculatePriceEstimate(products) {
    try {
        const { Product } = await import('../../models')

        let subtotal = 0
        const details = []

        for (const item of products) {
            const product = await Product.findById(item.productId).lean()
            if (product) {
                const itemPrice = product.price * item.quantity
                subtotal += itemPrice

                details.push({
                    productName: product.name,
                    quantity: item.quantity,
                    unit: item.unit,
                    unitPrice: product.price,
                    totalPrice: itemPrice
                })
            }
        }

        // Calcul des frais de livraison (logique simplifiée)
        const deliveryFee = subtotal > 200 ? 0 : 50
        const total = subtotal + deliveryFee

        return {
            subtotal: Math.round(subtotal),
            deliveryFee,
            total: Math.round(total),
            details
        }
    } catch (error) {
        console.error('Erreur calcul estimation:', error)
        return {
            subtotal: 0,
            deliveryFee: 50,
            total: 50,
            details: []
        }
    }
}

// Fonction utilitaire pour estimer la livraison
function calculateDeliveryEstimate(postalCode) {
    // Logique simplifiée basée sur les zones de livraison
    const zone1PostalCodes = ['69', '01', '38', '42', '07'] // Zone proche Lyon
    const userZone = postalCode.substring(0, 2)

    if (zone1PostalCodes.includes(userZone)) {
        return '24-48h'
    } else {
        return '3-5 jours'
    }
}

export default withPublicAPI({
    methods: ['POST', 'GET'],
    cacheSeconds: 0,
    rateLimitMax: 10 // Limite stricte pour les devis
})(handler)