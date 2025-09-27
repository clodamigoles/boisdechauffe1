import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import useCartStore from '@/lib/store/cartStore'
import { useState, useEffect } from 'react'

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
)

const MinusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
)

const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
)

const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
)

export default function CartSidebar() {
    const router = useRouter()
    const [settings, setSettings] = useState({
        freeShippingThreshold: 500,
        shippingCost: 50,
        taxRate: 0.20
    })

    const {
        isOpen,
        items,
        closeCart,
        removeItem,
        updateQuantity,
        getSubtotal,
        getShippingCost,
        getTax,
        getTotal,
        getItemsCount
    } = useCartStore()

    // Récupérer les paramètres depuis l'API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings/all')
                if (response.ok) {
                    const data = await response.json()
                    setSettings(data)
                }
            } catch (error) {
                console.error('Erreur lors du chargement des paramètres:', error)
            }
        }

        if (isOpen) {
            fetchSettings()
        }
    }, [isOpen])

    const subtotal = getSubtotal()
    const shippingCost = getShippingCost(settings.freeShippingThreshold, settings.shippingCost)
    const tax = getTax(settings.taxRate)
    const total = getTotal(settings)
    const itemsCount = getItemsCount()

    const handleCheckout = () => {
        closeCart()
        router.push('/panier')
    }

    const sidebarVariants = {
        closed: {
            x: '100%',
            transition: {
                type: 'tween',
                duration: 0.3
            }
        },
        open: {
            x: 0,
            transition: {
                type: 'tween',
                duration: 0.3
            }
        }
    }

    const backdropVariants = {
        closed: {
            opacity: 0,
            transition: {
                duration: 0.3
            }
        },
        open: {
            opacity: 1,
            transition: {
                duration: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        variants={sidebarVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-heading text-gray-800">
                                Panier ({itemsCount})
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={closeCart}
                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <CloseIcon />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                    <div className="text-6xl mb-4">🛒</div>
                                    <p className="text-lg font-medium">Votre panier est vide</p>
                                    <p className="text-sm text-gray-400">Ajoutez des produits pour commencer</p>
                                </div>
                            ) : (
                                <div className="p-6 space-y-4">
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                                        >
                                            {/* Image */}
                                            <div className="w-16 h-16 bg-wood-100 rounded-lg flex items-center justify-center">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <span className="text-2xl">🪵</span>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-800 truncate">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 capitalize">
                                                    {item.essence}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-semibold text-primary-600">
                                                        {item.price}€/{item.unit}
                                                    </span>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center space-x-2">
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                                        >
                                                            <MinusIcon />
                                                        </motion.button>

                                                        <span className="w-8 text-center font-medium">
                                                            {item.quantity}
                                                        </span>

                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                                            disabled={item.quantity >= item.stock}
                                                        >
                                                            <PlusIcon />
                                                        </motion.button>

                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-1 text-red-500 hover:text-red-700 transition-colors ml-2"
                                                        >
                                                            <TrashIcon />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer avec totaux */}
                        {items.length > 0 && (
                            <div className="border-t bg-gray-50 p-6 space-y-4">
                                {/* Calculs */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Sous-total</span>
                                        <span>{subtotal.toFixed(2)}€</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Livraison</span>
                                        <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                                            {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)}€`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>TVA (20%)</span>
                                        <span>{tax.toFixed(2)}€</span>
                                    </div>

                                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                        <span>Total</span>
                                        <span className="text-primary-600">{total.toFixed(2)}€</span>
                                    </div>
                                </div>

                                {/* Seuil livraison gratuite */}
                                {shippingCost > 0 && (
                                    <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded">
                                        💡 Plus que {(settings.freeShippingThreshold - subtotal).toFixed(2)}€
                                        pour la livraison gratuite !
                                    </div>
                                )}

                                {/* Bouton Commander */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCheckout}
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Commander maintenant
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        closeCart()
                                        router.push('/produits')
                                    }}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                                >
                                    Continuer mes achats
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}