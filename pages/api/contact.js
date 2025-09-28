import { withPublicAPI, createResponse } from '@/middleware/api'
import { Contact, Newsletter } from '@/models'
import Joi from 'joi'

// Schéma de validation pour les messages de contact
const contactSchema = Joi.object({
    // Informations personnelles
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

    company: Joi.string().trim().max(100).allow('').optional(),

    // Détails du message
    subject: Joi.string().valid('devis', 'livraison', 'produits', 'commande', 'support', 'autre').required()
        .messages({
            'any.only': 'Sujet invalide',
            'string.empty': 'Le sujet est requis'
        }),

    message: Joi.string().trim().min(10).max(2000).required()
        .messages({
            'string.empty': 'Le message est requis',
            'string.min': 'Le message doit contenir au moins 10 caractères',
            'string.max': 'Le message ne peut dépasser 2000 caractères'
        }),

    // Préférences
    preferredContact: Joi.string().valid('email', 'phone', 'both').default('email'),
    urgency: Joi.string().valid('normal', 'urgent', 'low').default('normal'),

    // Consentements
    acceptTerms: Joi.boolean().valid(true).required()
        .messages({
            'any.only': 'Vous devez accepter les conditions d\'utilisation'
        }),
    acceptNewsletter: Joi.boolean().default(false),

    // Métadonnées
    source: Joi.string().default('contact_page'),
    metadata: Joi.object().optional()
})

async function handler(req, res) {
    if (req.method === 'POST') {
        return handleContactSubmission(req, res)
    } else if (req.method === 'GET') {
        return handleGetContacts(req, res) // Admin only
    }
}

async function handleContactSubmission(req, res) {
    try {
        // Validation des données
        const { error, value } = contactSchema.validate(req.body, {
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

        const contactData = value

        // Protection anti-spam : vérifier les soumissions récentes du même email
        const recentContact = await Contact.findOne({
            email: contactData.email,
            createdAt: {
                $gte: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes
            }
        })

        if (recentContact) {
            return res.status(429).json(
                createResponse.error(
                    'Veuillez patienter avant d\'envoyer un nouveau message',
                    'RATE_LIMIT_EXCEEDED'
                )
            )
        }

        // Générer un numéro de ticket unique
        const ticketNumber = await generateTicketNumber()

        // Enrichir les métadonnées
        const enrichedMetadata = {
            ...contactData.metadata,
            ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            referer: req.headers.referer,
            timestamp: new Date().toISOString()
        }

        // Créer le message de contact
        const newContact = new Contact({
            ticketNumber,
            status: 'new',
            priority: contactData.urgency === 'urgent' ? 'high' :
                contactData.urgency === 'low' ? 'low' : 'normal',
            customer: {
                firstName: contactData.firstName,
                lastName: contactData.lastName,
                email: contactData.email,
                phone: contactData.phone,
                company: contactData.company || null
            },
            subject: contactData.subject,
            message: contactData.message,
            preferredContact: contactData.preferredContact,
            source: contactData.source,
            metadata: enrichedMetadata,
            tags: generateTags(contactData)
        })

        const savedContact = await newContact.save()

        // Ajouter à la newsletter si accepté
        if (contactData.acceptNewsletter) {
            try {
                await Newsletter.findOneAndUpdate(
                    { email: contactData.email },
                    {
                        $setOnInsert: {
                            email: contactData.email,
                            firstName: contactData.firstName,
                            source: 'contact_form',
                            interests: ['promotions', 'conseils'],
                            isActive: true,
                            subscribedAt: new Date()
                        }
                    },
                    { upsert: true, new: true }
                )
            } catch (newsletterError) {
                console.error('Erreur ajout newsletter:', newsletterError)
                // Ne pas faire échouer le contact pour cette erreur
            }
        }

        // Envoyer les notifications
        try {
            await sendContactNotifications(savedContact)
        } catch (notificationError) {
            console.error('Erreur notifications:', notificationError)
            // Ne pas faire échouer le contact pour cette erreur
        }

        // Log pour analytics
        console.log(`Nouveau contact: ${contactData.subject} - ${contactData.email} - Ticket: ${ticketNumber}`)

        return res.status(201).json(
            createResponse.success(
                {
                    ticketNumber: savedContact.ticketNumber,
                    contactId: savedContact._id,
                    status: savedContact.status,
                    estimatedResponse: getEstimatedResponseTime(contactData.urgency, contactData.subject)
                },
                'Message envoyé avec succès ! Nous vous contacterons rapidement.',
                {
                    trackingUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/contact/suivi/${savedContact.ticketNumber}`
                }
            )
        )

    } catch (error) {
        throw error
    }
}

async function handleGetContacts(req, res) {
    // Cette route nécessiterait une authentification admin
    return res.status(401).json(
        createResponse.error('Authentification requise', 'UNAUTHORIZED')
    )
}

// Fonction utilitaire pour générer un numéro de ticket unique
async function generateTicketNumber() {
    const prefix = 'TKT'
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const day = String(new Date().getDate()).padStart(2, '0')

    // Compter les contacts du jour
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const count = await Contact.countDocuments({
        createdAt: { $gte: startOfDay }
    })

    const sequence = String(count + 1).padStart(4, '0')
    return `${prefix}${year}${month}${day}${sequence}`
}

// Fonction utilitaire pour générer des tags automatiques
function generateTags(contactData) {
    const tags = []

    // Tags basés sur le sujet
    switch (contactData.subject) {
        case 'devis':
            tags.push('devis', 'commercial')
            break
        case 'livraison':
            tags.push('livraison', 'logistique')
            break
        case 'produits':
            tags.push('produits', 'technique')
            break
        case 'commande':
            tags.push('commande', 'suivi')
            break
        case 'support':
            tags.push('support', 'technique')
            break
        default:
            tags.push('general')
    }

    // Tags basés sur l'urgence
    if (contactData.urgency === 'urgent') {
        tags.push('urgent')
    }

    // Tags basés sur la présence d'entreprise
    if (contactData.company) {
        tags.push('professionnel', 'b2b')
    } else {
        tags.push('particulier', 'b2c')
    }

    // Tags basés sur le contenu du message
    const messageWords = contactData.message.toLowerCase()
    if (messageWords.includes('prix') || messageWords.includes('tarif') || messageWords.includes('coût')) {
        tags.push('prix')
    }
    if (messageWords.includes('urgent') || messageWords.includes('rapidement')) {
        tags.push('urgent')
    }
    if (messageWords.includes('livraison') || messageWords.includes('délai')) {
        tags.push('livraison')
    }

    return [...new Set(tags)] // Supprimer les doublons
}

// Fonction utilitaire pour estimer le temps de réponse
function getEstimatedResponseTime(urgency, subject) {
    const baseTime = {
        'urgent': '1 heure',
        'normal': '2-4 heures',
        'low': '24 heures'
    }

    const subjectModifier = {
        'devis': ' (devis détaillé sous 24h)',
        'support': ' (support technique prioritaire)',
        'commande': ' (suivi immédiat)',
        'livraison': '',
        'produits': '',
        'autre': ''
    }

    return baseTime[urgency] + (subjectModifier[subject] || '')
}

// Fonction utilitaire pour envoyer les notifications
async function sendContactNotifications(contact) {
    try {
        // 1. Email de confirmation au client
        await sendCustomerConfirmationEmail(contact)

        // 2. Notification à l'équipe interne
        await sendInternalNotification(contact)

        // 3. Notification selon le sujet
        await sendSubjectSpecificNotification(contact)

    } catch (error) {
        console.error('Erreur lors de l\'envoi des notifications:', error)
        throw error
    }
}

// Email de confirmation au client
async function sendCustomerConfirmationEmail(contact) {
    // TODO: Implémenter l'envoi d'email avec votre service email (SendGrid, Mailgun, etc.)

    const emailData = {
        to: contact.customer.email,
        subject: `Confirmation de réception - Ticket ${contact.ticketNumber}`,
        template: 'customer-contact-confirmation',
        data: {
            customerName: `${contact.customer.firstName} ${contact.customer.lastName}`,
            ticketNumber: contact.ticketNumber,
            subject: getSubjectLabel(contact.subject),
            message: contact.message,
            estimatedResponse: getEstimatedResponseTime(contact.priority, contact.subject),
            trackingUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/contact/suivi/${contact.ticketNumber}`
        }
    }

    console.log('Email de confirmation à envoyer:', emailData)
    // await emailService.send(emailData)
}

// Notification interne à l'équipe
async function sendInternalNotification(contact) {
    const teamEmails = getTeamEmailsBySubject(contact.subject)

    const emailData = {
        to: teamEmails,
        subject: `[${contact.priority.toUpperCase()}] Nouveau contact: ${contact.ticketNumber}`,
        template: 'internal-contact-notification',
        data: {
            ticketNumber: contact.ticketNumber,
            customer: contact.customer,
            subject: getSubjectLabel(contact.subject),
            message: contact.message,
            priority: contact.priority,
            preferredContact: contact.preferredContact,
            tags: contact.tags,
            adminUrl: `${process.env.ADMIN_URL}/contacts/${contact._id}`
        }
    }

    console.log('Notification interne à envoyer:', emailData)
    // await emailService.send(emailData)
}

// Notification spécifique selon le sujet
async function sendSubjectSpecificNotification(contact) {
    switch (contact.subject) {
        case 'devis':
            // Notifier l'équipe commerciale
            await notifyCommercialTeam(contact)
            break
        case 'livraison':
            // Notifier l'équipe logistique
            await notifyLogisticsTeam(contact)
            break
        case 'support':
            // Créer un ticket de support technique
            await createSupportTicket(contact)
            break
        case 'urgent':
            // Notification SMS pour les urgences
            await sendUrgentSMSNotification(contact)
            break
    }
}

// Obtenir les emails de l'équipe selon le sujet
function getTeamEmailsBySubject(subject) {
    const teamEmails = {
        'devis': ['commercial@boischauffagepro.fr'],
        'livraison': ['livraison@boischauffagepro.fr', 'logistique@boischauffagepro.fr'],
        'produits': ['technique@boischauffagepro.fr'],
        'commande': ['service@boischauffagepro.fr'],
        'support': ['support@boischauffagepro.fr'],
        'autre': ['contact@boischauffagepro.fr']
    }

    return [
        'contact@boischauffagepro.fr', // Email principal toujours notifié
        ...(teamEmails[subject] || [])
    ]
}

// Obtenir le libellé du sujet
function getSubjectLabel(subject) {
    const labels = {
        'devis': 'Demande de devis',
        'livraison': 'Questions livraison',
        'produits': 'Informations produits',
        'commande': 'Suivi de commande',
        'support': 'Support technique',
        'autre': 'Autre demande'
    }
    return labels[subject] || 'Contact général'
}

// Fonctions spécialisées pour chaque type de notification
async function notifyCommercialTeam(contact) {
    // Logique spécifique pour l'équipe commerciale
    console.log(`Notification équipe commerciale pour devis: ${contact.ticketNumber}`)

    // TODO: Intégration CRM
    // await crmService.createLead({
    //     source: 'contact_form',
    //     customer: contact.customer,
    //     message: contact.message,
    //     ticketNumber: contact.ticketNumber
    // })
}

async function notifyLogisticsTeam(contact) {
    // Logique spécifique pour l'équipe logistique
    console.log(`Notification équipe logistique: ${contact.ticketNumber}`)

    // TODO: Intégration système de transport
    // if (contact.message.includes('livraison urgente')) {
    //     await transportSystem.flagUrgentDelivery(contact)
    // }
}

async function createSupportTicket(contact) {
    // Logique pour créer un ticket de support
    console.log(`Création ticket support: ${contact.ticketNumber}`)

    // TODO: Intégration système de tickets
    // await ticketingSystem.createTicket({
    //     source: contact.ticketNumber,
    //     customer: contact.customer,
    //     priority: contact.priority,
    //     description: contact.message
    // })
}

async function sendUrgentSMSNotification(contact) {
    // Notification SMS pour les urgences
    console.log(`SMS urgent pour: ${contact.ticketNumber}`)

    // TODO: Service SMS
    // await smsService.send({
    //     to: process.env.URGENT_PHONE_NUMBER,
    //     message: `URGENT - Nouveau contact: ${contact.ticketNumber} - ${contact.customer.firstName} ${contact.customer.lastName} - ${contact.customer.phone}`
    // })
}

export default withPublicAPI({
    methods: ['POST', 'GET'],
    cacheSeconds: 0, // Pas de cache pour cette route
    rateLimitMax: 5   // Limite stricte pour éviter le spam
})(handler)