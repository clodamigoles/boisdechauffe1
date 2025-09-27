import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
    persist(
        (set, get) => ({
            // État du panier
            items: [],
            isOpen: false,

            // Actions du panier
            addItem: (product, quantity = 1) => {
                set((state) => {
                    const existingItem = state.items.find(item => item.id === product._id)

                    if (existingItem) {
                        return {
                            items: state.items.map(item =>
                                item.id === product._id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            )
                        }
                    }

                    return {
                        items: [
                            ...state.items,
                            {
                                id: product._id,
                                name: product.name,
                                slug: product.slug,
                                price: product.price,
                                compareAtPrice: product.compareAtPrice,
                                unit: product.unit,
                                essence: product.essence,
                                image: product.images?.[0]?.url || '',
                                quantity: quantity,
                                stock: product.stock
                            }
                        ]
                    }
                })
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter(item => item.id !== productId)
                }))
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }

                set((state) => ({
                    items: state.items.map(item =>
                        item.id === productId
                            ? { ...item, quantity: Math.min(quantity, item.stock) }
                            : item
                    )
                }))
            },

            clearCart: () => {
                set({ items: [] })
            },

            // Gestion de l'ouverture/fermeture du panier
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            // Calculateurs
            getItemsCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
            },

            getShippingCost: (freeShippingThreshold = 500, standardShippingCost = 50) => {
                const subtotal = get().getSubtotal()
                return subtotal >= freeShippingThreshold ? 0 : standardShippingCost
            },

            getTax: (taxRate = 0.20) => {
                const subtotal = get().getSubtotal()
                return subtotal * taxRate
            },

            getTotal: (settings = {}) => {
                const subtotal = get().getSubtotal()
                const shipping = get().getShippingCost(
                    settings.freeShippingThreshold,
                    settings.shippingCost
                )
                const tax = get().getTax(settings.taxRate)
                return subtotal + shipping + tax
            },

            // Validation du panier
            validateCart: (minOrderAmount = 50) => {
                const items = get().items
                const subtotal = get().getSubtotal()
                const errors = []

                if (items.length === 0) {
                    errors.push('Votre panier est vide')
                }

                if (subtotal < minOrderAmount) {
                    errors.push(`Commande minimum : ${minOrderAmount}€`)
                }

                // Vérifier le stock pour chaque item
                items.forEach(item => {
                    if (item.quantity > item.stock) {
                        errors.push(`Stock insuffisant pour ${item.name}`)
                    }
                })

                return {
                    isValid: errors.length === 0,
                    errors
                }
            },

            // Préparer les données pour la commande
            getOrderItems: () => {
                return get().items.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    productImage: item.image,
                    essence: item.essence,
                    price: item.price,
                    quantity: item.quantity,
                    unit: item.unit,
                    subtotal: item.price * item.quantity
                }))
            }
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                items: state.items
            })
        }
    )
)

// Hook pour récupérer les statistiques du panier
export const useCartStats = () => {
    const items = useCartStore(state => state.items)
    const getSubtotal = useCartStore(state => state.getSubtotal)
    const getItemsCount = useCartStore(state => state.getItemsCount)

    return {
        itemsCount: getItemsCount(),
        subtotal: getSubtotal(),
        hasItems: items.length > 0
    }
}

export default useCartStore