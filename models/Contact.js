import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
    {
        ticketNumber: {
            type: String,
            required: [true, 'Le numéro de ticket est requis'],
            unique: true,
            index: true,
        },

        // Statut du contact
        status: {
            type: String,
            enum: {
                values: ['new', 'in_progress', 'pending_customer', 'resolved', 'closed'],
                message: 'Statut invalide'
            },
            default: 'new',
            index: true
        },

        priority: {
            type: String,
            enum: {
                values: ['low', 'normal', 'high', 'urgent'],
                message: 'Priorité invalide'
            },
            default: 'normal',
            index: true
        },

        // Informations client
        customer: {
            firstName: {
                type: String,
                required: [true, 'Le prénom est requis'],
                trim: true,
                maxlength: [50, 'Le prénom ne peut dépasser 50 caractères']
            },
            lastName: {
                type: String,
                required: [true, 'Le nom est requis'],
                trim: true,
                maxlength: [50, 'Le nom ne peut dépasser 50 caractères']
            },
            email: {
                type: String,
                required: [true, 'L\'email est requis'],
                trim: true,
                lowercase: true,
                match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'],
                index: true
            },
            phone: {
                type: String,
                required: [true, 'Le téléphone est requis'],
                trim: true,
                match: [/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide']
            },
            company: {
                type: String,
                trim: true,
                maxlength: [100, 'Le nom de l\'entreprise ne peut dépasser 100 caractères']
            }
        },

        // Détails du contact
        subject: {
            type: String,
            required: [true, 'Le sujet est requis'],
            enum: {
                values: ['devis', 'livraison', 'produits', 'commande', 'support', 'autre'],
                message: 'Sujet invalide'
            },
            index: true
        },

        message: {
            type: String,
            required: [true, 'Le message est requis'],
            trim: true,
            minlength: [10, 'Le message doit contenir au moins 10 caractères'],
            maxlength: [2000, 'Le message ne peut dépasser 2000 caractères']
        },

        // Préférences de contact
        preferredContact: {
            type: String,
            enum: ['email', 'phone', 'both'],
            default: 'email'
        },

        // Source et traçabilité
        source: {
            type: String,
            default: 'contact_page',
            enum: [
                'contact_page', 'phone', 'email', 'chat', 'social_media',
                'referral', 'newsletter', 'website', 'other'
            ]
        },

        // Tags pour la classification
        tags: [{
            type: String,
            trim: true,
            lowercase: true
        }],

        // Assignation
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Référence vers le modèle User (à créer)
            default: null
        },

        assignedTeam: {
            type: String,
            enum: ['commercial', 'support', 'livraison', 'technique', 'direction'],
            default: null
        },

        // Suivi et réponses
        responses: [{
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            respondedAt: {
                type: Date,
                default: Date.now
            },
            method: {
                type: String,
                enum: ['email', 'phone', 'sms', 'chat', 'meeting'],
                required: true
            },
            message: {
                type: String,
                required: true,
                trim: true,
                maxlength: [2000, 'La réponse ne peut dépasser 2000 caractères']
            },
            internal: {
                type: Boolean,
                default: false // true pour les notes internes
            }
        }],

        // Dates importantes
        firstResponseAt: {
            type: Date,
            default: null
        },

        resolvedAt: {
            type: Date,
            default: null
        },

        closedAt: {
            type: Date,
            default: null
        },

        // Évaluation client
        customerSatisfaction: {
            rating: {
                type: Number,
                min: 1,
                max: 5,
                default: null
            },
            feedback: {
                type: String,
                trim: true,
                maxlength: [500, 'Le feedback ne peut dépasser 500 caractères']
            },
            submittedAt: {
                type: Date,
                default: null
            }
        },

        // Métadonnées techniques
        metadata: {
            ipAddress: String,
            userAgent: String,
            referer: String,
            timestamp: String,
            sessionId: String,
            device: String,
            browser: String,
            os: String,
            country: String,
            city: String
        },

        // Données relationnelles
        relatedOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null
        },

        relatedQuote: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quote',
            default: null
        },

        // Historique des statuts
        statusHistory: [{
            status: {
                type: String,
                required: true
            },
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            changedAt: {
                type: Date,
                default: Date.now
            },
            note: {
                type: String,
                trim: true,
                maxlength: [200, 'La note ne peut dépasser 200 caractères']
            }
        }],

        // Flags et options
        isVip: {
            type: Boolean,
            default: false
        },

        isSpam: {
            type: Boolean,
            default: false
        },

        requiresFollowUp: {
            type: Boolean,
            default: true
        },

        followUpDate: {
            type: Date,
            default: null
        },

        // Notes internes
        internalNotes: [{
            note: {
                type: String,
                required: true,
                trim: true,
                maxlength: [1000, 'La note ne peut dépasser 1000 caractères']
            },
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            addedAt: {
                type: Date,
                default: Date.now
            },
            private: {
                type: Boolean,
                default: false
            }
        }]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

// Index composés pour les performances
contactSchema.index({ status: 1, priority: 1 })
contactSchema.index({ 'customer.email': 1, createdAt: -1 })
contactSchema.index({ subject: 1, status: 1 })
contactSchema.index({ assignedTo: 1, status: 1 })
contactSchema.index({ createdAt: -1 })
contactSchema.index({ tags: 1 })
contactSchema.index({ source: 1, createdAt: -1 })

// Virtual pour le nom complet du client
contactSchema.virtual('customer.fullName').get(function () {
    return `${this.customer.firstName} ${this.customer.lastName}`
})

// Virtual pour vérifier si c'est un nouveau contact
contactSchema.virtual('isNew').get(function () {
    return this.status === 'new'
})

// Virtual pour vérifier si le contact est en retard
contactSchema.virtual('isOverdue').get(function () {
    if (this.status === 'resolved' || this.status === 'closed') return false

    const now = new Date()
    const createdHoursAgo = (now - this.createdAt) / (1000 * 60 * 60)

    // Délais selon la priorité
    const slaHours = {
        'urgent': 1,
        'high': 4,
        'normal': 24,
        'low': 48
    }

    return createdHoursAgo > (slaHours[this.priority] || 24)
})

// Virtual pour calculer le temps de première réponse
contactSchema.virtual('firstResponseTime').get(function () {
    if (!this.firstResponseAt) return null

    const diffMs = this.firstResponseAt - this.createdAt
    const diffHours = Math.round(diffMs / (1000 * 60 * 60) * 100) / 100

    return {
        hours: diffHours,
        formatted: diffHours < 1 ?
            `${Math.round(diffMs / (1000 * 60))} minutes` :
            `${diffHours} heures`
    }
})

// Virtual pour calculer le temps total de résolution
contactSchema.virtual('resolutionTime').get(function () {
    if (!this.resolvedAt) return null

    const diffMs = this.resolvedAt - this.createdAt
    const diffHours = Math.round(diffMs / (1000 * 60 * 60) * 100) / 100

    return {
        hours: diffHours,
        formatted: diffHours < 24 ?
            `${diffHours} heures` :
            `${Math.round(diffHours / 24 * 100) / 100} jours`
    }
})

// Middleware pre-save pour gérer l'historique des statuts
contactSchema.pre('save', function (next) {
    // Si le statut a changé, l'ajouter à l'historique
    if (this.isModified('status') && !this.isNew) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date()
        })
    }

    // Mettre à jour les dates selon le statut
    if (this.isModified('status')) {
        const now = new Date()

        switch (this.status) {
            case 'resolved':
                if (!this.resolvedAt) this.resolvedAt = now
                break
            case 'closed':
                if (!this.closedAt) this.closedAt = now
                if (!this.resolvedAt) this.resolvedAt = now
                break
        }
    }

    next()
})

// Méthode pour ajouter une réponse
contactSchema.methods.addResponse = function (responseData) {
    this.responses.push(responseData)

    // Marquer la première réponse
    if (!this.firstResponseAt && !responseData.internal) {
        this.firstResponseAt = new Date()
    }

    // Changer le statut si c'était nouveau
    if (this.status === 'new' && !responseData.internal) {
        this.status = 'in_progress'
    }

    return this.save()
}

// Méthode pour ajouter une note interne
contactSchema.methods.addInternalNote = function (note, addedBy, isPrivate = false) {
    this.internalNotes.push({
        note,
        addedBy,
        private: isPrivate
    })

    return this.save()
}

// Méthode pour assigner le contact
contactSchema.methods.assignTo = function (userId, team) {
    this.assignedTo = userId
    this.assignedTeam = team

    if (this.status === 'new') {
        this.status = 'in_progress'
    }

    return this.save()
}

// Méthode pour marquer comme résolu
contactSchema.methods.resolve = function (resolvedBy, resolution) {
    this.status = 'resolved'
    this.resolvedAt = new Date()

    if (resolution) {
        this.addResponse({
            respondedBy: resolvedBy,
            method: 'email',
            message: resolution,
            internal: false
        })
    }

    return this.save()
}

// Méthode pour fermer le contact
contactSchema.methods.close = function (closedBy, reason) {
    this.status = 'closed'
    this.closedAt = new Date()

    if (!this.resolvedAt) {
        this.resolvedAt = this.closedAt
    }

    if (reason) {
        this.addInternalNote(`Contact fermé: ${reason}`, closedBy)
    }

    return this.save()
}

// Méthode statique pour générer des statistiques
contactSchema.statics.getStats = async function (dateRange = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - dateRange)

    const stats = await this.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
                inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
                resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
                avgResponseTime: { $avg: '$firstResponseTime' },
                avgResolutionTime: { $avg: '$resolutionTime' }
            }
        }
    ])

    return stats[0] || {}
}

// Méthode statique pour chercher les contacts
contactSchema.statics.search = function (query, options = {}) {
    const {
        status,
        priority,
        subject,
        assignedTo,
        dateFrom,
        dateTo,
        page = 1,
        limit = 50,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = options

    let filter = {}

    // Filtre de recherche textuelle
    if (query) {
        filter.$or = [
            { 'customer.firstName': { $regex: query, $options: 'i' } },
            { 'customer.lastName': { $regex: query, $options: 'i' } },
            { 'customer.email': { $regex: query, $options: 'i' } },
            { 'customer.company': { $regex: query, $options: 'i' } },
            { message: { $regex: query, $options: 'i' } },
            { ticketNumber: { $regex: query, $options: 'i' } }
        ]
    }

    // Filtres additionnels
    if (status) filter.status = status
    if (priority) filter.priority = priority
    if (subject) filter.subject = subject
    if (assignedTo) filter.assignedTo = assignedTo

    // Filtre de date
    if (dateFrom || dateTo) {
        filter.createdAt = {}
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom)
        if (dateTo) filter.createdAt.$lte = new Date(dateTo)
    }

    const skip = (page - 1) * limit
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }

    return this.find(filter)
        .populate('assignedTo', 'firstName lastName email')
        .populate('relatedOrder', 'orderNumber status')
        .populate('relatedQuote', 'quoteNumber status')
        .sort(sort)
        .skip(skip)
        .limit(limit)
}

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema)

export default Contact