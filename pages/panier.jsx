"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Heart, Truck } from "lucide-react"
import { useCartStore } from "../store/cartStore"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
}

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
}

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simuler un petit délai de chargement pour éviter l'hydration mismatch
        const timer = setTimeout(() => setIsLoading(false), 100)
        return () => clearTimeout(timer)
    }, [])

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(productId)
        } else {
            updateQuantity(productId, newQuantity)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <motion.main
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="pt-20 pb-16"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <Link href="/shop">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span>Continuer mes achats</span>
                                </motion.button>
                            </Link>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Panier</h1>
                                <p className="text-gray-600">
                                    {items.length === 0
                                        ? "Votre panier est vide"
                                        : `${items.length} article${items.length > 1 ? "s" : ""} dans votre panier`}
                                </p>
                            </div>

                            {items.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearCart}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Vider le panier
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {items.length === 0 ? (
                        /* Panier vide */
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Votre panier est vide</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Découvrez notre sélection de bois de chauffage premium et commencez vos achats.
                            </p>
                            <Link href="/shop">
                                <Button variant="primary" size="lg" className="flex items-center space-x-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>Découvrir nos produits</span>
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        /* Contenu du panier */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Liste des produits */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100">
                                        <h2 className="text-lg font-semibold text-gray-900">Articles</h2>
                                    </div>

                                    <div className="divide-y divide-gray-100">
                                        <AnimatePresence>
                                            {items.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="p-6"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        {/* Image produit */}
                                                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={item.image || "/placeholder.svg"}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>

                                                        {/* Informations produit */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {formatPrice(item.price)} / {item.unit}
                                                            </p>
                                                        </div>

                                                        {/* Contrôles quantité */}
                                                        <div className="flex items-center space-x-3">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-amber-400 hover:text-amber-600 transition-colors"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </motion.button>

                                                            <span className="w-12 text-center font-medium text-gray-900">{item.quantity}</span>

                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-amber-400 hover:text-amber-600 transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>

                                                        {/* Prix total et actions */}
                                                        <div className="text-right">
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </p>
                                                            <div className="flex items-center space-x-2 mt-2">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="text-gray-400 hover:text-amber-600 transition-colors"
                                                                    aria-label="Ajouter aux favoris"
                                                                >
                                                                    <Heart className="w-4 h-4" />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => removeItem(item.id)}
                                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                                    aria-label="Supprimer"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Résumé de commande */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Résumé</h2>

                                    {/* Détails prix */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Sous-total</span>
                                            <span>{formatPrice(getTotalPrice())}</span>
                                        </div>
                                        {/* <div className="flex justify-between text-gray-600">
                                            <span>Livraison</span>
                                            <span className="text-green-600 font-medium">Gratuite</span>
                                        </div> */}
                                        <div className="border-t border-gray-100 pt-4">
                                            <div className="flex justify-between text-lg font-semibold text-gray-900">
                                                <span>Total</span>
                                                <span>{formatPrice(getTotalPrice())}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations livraison
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-center space-x-2 text-green-700">
                                            <Truck className="w-5 h-5" />
                                            <span className="font-medium">Livraison gratuite</span>
                                        </div>
                                        <p className="text-sm text-green-600 mt-1">Livraison sous 24-48h dans toute la France</p>
                                    </div> */}

                                    {/* Boutons d'action */}
                                    <div className="space-y-3">
                                        <Link href="/commander">
                                            <Button variant="primary" size="lg" className="w-full" style={{ marginBottom: 7  }}>
                                                Passer la commande
                                            </Button>
                                        </Link>
                                        <Link href="/shop">
                                            <Button variant="outline" size="lg" className="w-full bg-transparent">
                                                Continuer mes achats
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Garanties */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span>Paiement sécurisé</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span>Satisfaction garantie</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span>Service client 7j/7</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.main>

            <Footer />
        </div>
    )
}