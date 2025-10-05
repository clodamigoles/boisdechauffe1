// Configuration de base pour les appels API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

// Classe d'erreur personnalisée pour l'API
export class APIError extends Error {
    constructor(message, status, type, errors = null) {
        super(message)
        this.name = 'APIError'
        this.status = status
        this.type = type
        this.errors = errors
    }
}

// Utilitaire sécurisé pour localStorage
const safeLocalStorage = {
    getItem: (key) => {
        if (typeof window === 'undefined') return null
        try {
            return localStorage.getItem(key)
        } catch (error) {
            console.warn('localStorage non disponible:', error)
            return null
        }
    },
    setItem: (key, value) => {
        if (typeof window === 'undefined') return false
        try {
            localStorage.setItem(key, value)
            return true
        } catch (error) {
            console.warn('Impossible de sauvegarder dans localStorage:', error)
            return false
        }
    },
    removeItem: (key) => {
        if (typeof window === 'undefined') return
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.warn('Impossible de supprimer de localStorage:', error)
        }
    }
}

// Intercepteur de requête pour ajouter des headers communs
const createRequestConfig = (options = {}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    }

    // Ajouter l'API key si disponible (pour les routes admin)
    const apiKey = safeLocalStorage.getItem('admin_api_key')
    if (apiKey) {
        config.headers['x-api-key'] = apiKey
    }

    return config
}

// Fonction de base pour les appels API avec gestion d'erreur standardisée
export const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    const config = createRequestConfig(options)

    try {
        const response = await fetch(url, config)
        let data

        // Essayer de parser le JSON
        try {
            data = await response.json()
        } catch (parseError) {
            throw new APIError(
                'Réponse du serveur invalide',
                response.status,
                'INVALID_RESPONSE'
            )
        }

        // Vérifier si la réponse est un succès
        if (!response.ok) {
            throw new APIError(
                data.message || 'Erreur du serveur',
                response.status,
                data.type || 'SERVER_ERROR',
                data.errors || null
            )
        }

        return data
    } catch (error) {
        // Si c'est déjà une APIError, la re-lancer
        if (error instanceof APIError) {
            throw error
        }

        // Erreurs réseau ou autres
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new APIError(
                'Erreur de connexion au serveur',
                0,
                'NETWORK_ERROR'
            )
        }

        // Autres erreurs
        throw new APIError(
            error.message || 'Erreur inattendue',
            0,
            'UNKNOWN_ERROR'
        )
    }
}

// Service pour les catégories
export const categoriesService = {
    // Récupérer toutes les catégories
    getAll: async (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.featured) searchParams.append('featured', 'true')
        if (params.active !== undefined) searchParams.append('active', params.active.toString())

        const query = searchParams.toString()
        return apiCall(`/api/categories${query ? `?${query}` : ''}`)
    },

    // Récupérer les catégories featured
    getFeatured: async () => {
        return apiCall('/api/categories/featured')
    },

    // Récupérer une catégorie par slug
    getBySlug: async (slug) => {
        return apiCall(`/api/categories/${slug}`)
    }
}

// Service pour les produits
export const productsService = {
    // Rechercher des produits avec filtres
    search: async (filters = {}) => {
        const searchParams = new URLSearchParams()

        Object.keys(filters).forEach(key => {
            const value = filters[key]
            if (value !== undefined && value !== '' && value !== false) {
                searchParams.append(key, value.toString())
            }
        })

        return apiCall(`/api/products/search?${searchParams.toString()}`)
    },

    // Récupérer les produits featured
    getFeatured: async (filter = 'all', limit = 8) => {
        return apiCall(`/api/products/featured?filter=${filter}&limit=${limit}`)
    },

    // Récupérer un produit par slug
    getBySlug: async (slug) => {
        return apiCall(`/api/products/${slug}`)
    },

    // Récupérer les produits similaires
    getSimilar: async (productId, limit = 4) => {
        return apiCall(`/api/products/${productId}/similar?limit=${limit}`)
    }
}

// Service pour la newsletter
export const newsletterService = {
    // S'abonner à la newsletter
    subscribe: async (data) => {
        return apiCall('/api/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    },

    // Se désabonner
    unsubscribe: async (email, token) => {
        return apiCall('/api/newsletter/unsubscribe', {
            method: 'POST',
            body: JSON.stringify({ email, token })
        })
    },

    // Confirmer l'abonnement
    confirm: async (token) => {
        return apiCall('/api/newsletter/confirm', {
            method: 'POST',
            body: JSON.stringify({ token })
        })
    }
}

// Service pour les témoignages
export const testimonialsService = {
    // Récupérer les témoignages featured
    getFeatured: async (limit = 6) => {
        return apiCall(`/api/testimonials/featured?limit=${limit}`)
    },

    // Récupérer tous les témoignages
    getAll: async (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.verified) searchParams.append('verified', 'true')
        if (params.featured) searchParams.append('featured', 'true')
        if (params.limit) searchParams.append('limit', params.limit.toString())

        const query = searchParams.toString()
        return apiCall(`/api/testimonials${query ? `?${query}` : ''}`)
    }
}

// Service pour les commandes
export const ordersService = {
    // Créer une commande
    create: async (orderData) => {
        return apiCall('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        })
    },

    // Récupérer une commande par ID
    getById: async (orderId) => {
        return apiCall(`/api/orders/${orderId}`)
    },

    // Suivre une commande
    track: async (trackingNumber) => {
        return apiCall(`/api/orders/track/${trackingNumber}`)
    }
}

// Service pour les devis
export const quotesService = {
    // Demander un devis
    request: async (quoteData) => {
        return apiCall('/api/quotes', {
            method: 'POST',
            body: JSON.stringify(quoteData)
        })
    },

    // Récupérer un devis par ID
    getById: async (quoteId) => {
        return apiCall(`/api/quotes/${quoteId}`)
    }
}

// Cache en mémoire (pas localStorage pour éviter les problèmes SSR)
let memoryCache = {}

// Utilitaires pour la gestion du cache
export const cacheUtils = {
    // Clés de cache standardisées
    keys: {
        categories: (params = {}) => `categories_${JSON.stringify(params)}`,
        products: (filters = {}) => `products_${JSON.stringify(filters)}`,
        testimonials: (params = {}) => `testimonials_${JSON.stringify(params)}`
    },

    // Récupérer depuis le cache
    get: (key) => {
        // Essayer d'abord le cache mémoire
        if (memoryCache[key]) {
            const { data, timestamp, ttl } = memoryCache[key]
            if (Date.now() <= timestamp + ttl) {
                return data
            }
            delete memoryCache[key]
        }

        // Fallback vers localStorage si disponible
        if (typeof window === 'undefined') return null

        try {
            const item = safeLocalStorage.getItem(`cache_${key}`)
            if (!item) return null

            const { data, timestamp, ttl } = JSON.parse(item)

            // Vérifier l'expiration
            if (Date.now() > timestamp + ttl) {
                safeLocalStorage.removeItem(`cache_${key}`)
                return null
            }

            // Mettre en cache mémoire
            memoryCache[key] = { data, timestamp, ttl }
            return data
        } catch (error) {
            console.warn('Erreur lors de la lecture du cache:', error)
            return null
        }
    },

    // Sauvegarder dans le cache
    set: (key, data, ttlMinutes = 5) => {
        const ttl = ttlMinutes * 60 * 1000
        const item = {
            data,
            timestamp: Date.now(),
            ttl
        }

        // Toujours mettre en cache mémoire
        memoryCache[key] = item

        // Essayer localStorage comme backup
        try {
            safeLocalStorage.setItem(`cache_${key}`, JSON.stringify(item))
        } catch (error) {
            console.warn('Erreur lors de la sauvegarde du cache:', error)
        }
    },

    // Vider le cache
    clear: (pattern = null) => {
        if (pattern) {
            // Vider le cache mémoire
            Object.keys(memoryCache).forEach(key => {
                if (key.includes(pattern)) {
                    delete memoryCache[key]
                }
            })

            // Vider localStorage
            if (typeof window !== 'undefined') {
                try {
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('cache_') && key.includes(pattern)) {
                            safeLocalStorage.removeItem(key)
                        }
                    })
                } catch (error) {
                    console.warn('Erreur lors du nettoyage du cache:', error)
                }
            }
        } else {
            // Vider tout
            memoryCache = {}
            
            if (typeof window !== 'undefined') {
                try {
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('cache_')) {
                            safeLocalStorage.removeItem(key)
                        }
                    })
                } catch (error) {
                    console.warn('Erreur lors du nettoyage du cache:', error)
                }
            }
        }
    }
}

// Service avec cache intégré
export const cachedAPI = {
    categories: {
        getAll: async (params = {}, useCache = true) => {
            const cacheKey = cacheUtils.keys.categories(params)

            if (useCache) {
                const cached = cacheUtils.get(cacheKey)
                if (cached) return cached
            }

            const result = await categoriesService.getAll(params)
            if (useCache) cacheUtils.set(cacheKey, result, 30) // Cache 30min
            return result
        },

        getFeatured: async (useCache = true) => {
            const cacheKey = 'categories_featured'

            if (useCache) {
                const cached = cacheUtils.get(cacheKey)
                if (cached) return cached
            }

            const result = await categoriesService.getFeatured()
            if (useCache) cacheUtils.set(cacheKey, result, 60) // Cache 1h
            return result
        }
    },

    products: {
        search: async (filters = {}, useCache = true) => {
            const cacheKey = cacheUtils.keys.products(filters)

            if (useCache) {
                const cached = cacheUtils.get(cacheKey)
                if (cached) return cached
            }

            const result = await productsService.search(filters)
            if (useCache) cacheUtils.set(cacheKey, result, 10) // Cache 10min
            return result
        },

        getFeatured: async (filter = 'all', limit = 8, useCache = true) => {
            const cacheKey = `products_featured_${filter}_${limit}`

            if (useCache) {
                const cached = cacheUtils.get(cacheKey)
                if (cached) return cached
            }

            const result = await productsService.getFeatured(filter, limit)
            if (useCache) cacheUtils.set(cacheKey, result, 15) // Cache 15min
            return result
        }
    }
}

// Export par défaut avec tous les services
export default {
    apiCall,
    categories: categoriesService,
    products: productsService,
    newsletter: newsletterService,
    testimonials: testimonialsService,
    orders: ordersService,
    quotes: quotesService,
    cached: cachedAPI,
    cache: cacheUtils,
    APIError
}