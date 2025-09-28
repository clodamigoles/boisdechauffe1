// Utilitaires pour les API
import { handleDBErrors } from "./mongoose"

// Wrapper pour les handlers d'API avec gestion d'erreurs
export function withErrorHandling(handler) {
    return async (req, res) => {
        try {
            await handler(req, res)
        } catch (error) {
            console.error("API Error:", error)

            const dbError = handleDBErrors(error)

            if (dbError.type === "VALIDATION_ERROR") {
                return res.status(400).json({
                    success: false,
                    message: dbError.message,
                    errors: dbError.errors,
                })
            }

            if (dbError.type === "DUPLICATE_ERROR") {
                return res.status(409).json({
                    success: false,
                    message: dbError.message,
                    field: dbError.field,
                })
            }

            if (dbError.type === "CAST_ERROR") {
                return res.status(400).json({
                    success: false,
                    message: "Format de données invalide",
                    field: dbError.field,
                })
            }

            // Erreur générique
            res.status(500).json({
                success: false,
                message: "Erreur interne du serveur",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            })
        }
    }
}

// Validation des méthodes HTTP
export function validateMethods(allowedMethods) {
    return (req, res, next) => {
        if (!allowedMethods.includes(req.method)) {
            res.setHeader("Allow", allowedMethods)
            return res.status(405).json({
                success: false,
                message: `Méthode ${req.method} non autorisée`,
            })
        }
        next()
    }
}

// Pagination helper
export function getPaginationParams(req) {
    const page = Math.max(1, Number.parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit) || 10))
    const skip = (page - 1) * limit

    return { page, limit, skip }
}

// Formatage des réponses de succès
export function successResponse(data, message = "Succès") {
    return {
        success: true,
        message,
        data,
    }
}

// Formatage des réponses d'erreur
export function errorResponse(message, errors = null) {
    const response = {
        success: false,
        message,
    }

    if (errors) {
        response.errors = errors
    }

    return response
}

// Validation des paramètres requis
export function validateRequiredFields(data, requiredFields) {
    const missingFields = []

    for (const field of requiredFields) {
        if (!data[field] || (typeof data[field] === "string" && !data[field].trim())) {
            missingFields.push(field)
        }
    }

    return missingFields
}

// Sanitisation des données
export function sanitizeData(data, allowedFields) {
    const sanitized = {}

    for (const field of allowedFields) {
        if (data.hasOwnProperty(field)) {
            sanitized[field] = data[field]
        }
    }

    return sanitized
}

// Helper pour les filtres de recherche
export function buildSearchFilters(query) {
    const filters = {}

    // Recherche textuelle
    if (query.search) {
        filters.$or = [
            { name: { $regex: query.search, $options: "i" } },
            { shortDescription: { $regex: query.search, $options: "i" } },
        ]
    }

    // Filtres par catégorie
    if (query.category) {
        filters.categoryId = query.category
    }

    // Filtres par essence
    if (query.essence) {
        filters.essence = query.essence
    }

    // Filtres par prix
    if (query.minPrice || query.maxPrice) {
        filters.price = {}
        if (query.minPrice) filters.price.$gte = Number.parseFloat(query.minPrice)
        if (query.maxPrice) filters.price.$lte = Number.parseFloat(query.maxPrice)
    }

    // Filtres par disponibilité
    if (query.inStock === "true") {
        filters.stock = { $gt: 0 }
    }

    // Filtres par statut
    filters.isActive = true

    return filters
}

// Helper pour le tri
export function buildSortOptions(sortBy) {
    const sortOptions = {}

    switch (sortBy) {
        case "price_asc":
            sortOptions.price = 1
            break
        case "price_desc":
            sortOptions.price = -1
            break
        case "name_asc":
            sortOptions.name = 1
            break
        case "name_desc":
            sortOptions.name = -1
            break
        case "rating":
            sortOptions.averageRating = -1
            break
        case "sales":
            sortOptions.salesCount = -1
            break
        case "newest":
            sortOptions.createdAt = -1
            break
        default:
            sortOptions.featured = -1
            sortOptions.createdAt = -1
    }

    return sortOptions
}