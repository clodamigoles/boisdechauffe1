import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useCartStore = create(
    persist(
        (set, get) => ({
            // État initial
            items: [],
            isOpen: false,

            // Actions
            addItem: (product) => {
                const items = get().items
                const existingItem = items.find(item => item.id === product.id)

                if (existingItem) {
                    // Si le produit existe déjà, augmenter la quantité
                    set({
                        items: items.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    })
                } else {
                    // Ajouter un nouveau produit
                    set({
                        items: [...items, { ...product, quantity: 1 }]
                    })
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter(item => item.id !== productId)
                })
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }

                set({
                    items: get().items.map(item =>
                        item.id === productId
                            ? { ...item, quantity }
                            : item
                    )
                })
            },

            clearCart: () => {
                set({ items: [] })
            },

            toggleCart: () => {
                set({ isOpen: !get().isOpen })
            },

            openCart: () => {
                set({ isOpen: true })
            },

            closeCart: () => {
                set({ isOpen: false })
            },

            // Getters calculés
            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
            },

            getItemCount: (productId) => {
                const item = get().items.find(item => item.id === productId)
                return item ? item.quantity : 0
            },

            isInCart: (productId) => {
                return get().items.some(item => item.id === productId)
            }
        }),
        {
            name: 'cart-storage', // nom unique pour le localStorage
            storage: createJSONStorage(() => {
                // Vérifier si nous sommes côté client
                if (typeof window !== 'undefined') {
                    return localStorage
                }
                // Retourner un storage mock côté serveur
                return {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { }
                }
            }),
            // Fonction de partition pour ne persister que certaines parties du state
            partialize: (state) => ({
                items: state.items
            }),
            // Fonction appelée lors de la rehydratation
            onRehydrateStorage: () => (state) => {
                console.log('Panier restauré depuis le localStorage')
            }
        }
    )
)

export { useCartStore }