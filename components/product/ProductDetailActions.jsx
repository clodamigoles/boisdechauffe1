"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Heart, Share2, Minus, Plus, Calculator } from "lucide-react"
import { useCartStore } from "../../store/cartStore"
import Button from "../ui/Button"
import CartToast from "../ui/CartToast"

export default function ProductDetailActions({ product }) {
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const addToCart = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        const productData = {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.url || "/images/placeholder-product.jpg",
            unit: product.unit,
        }

        for (let i = 0; i < quantity; i++) {
            addToCart(productData)
        }

        setShowToast(true)
        setTimeout(() => setShowToast(false), 4000)
    }

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.shortDescription,
                    url: window.location.href,
                })
            } catch (err) {
                console.log("Erreur lors du partage:", err)
            }
        } else {
            navigator.clipboard.writeText(window.location.href)
        }
    }

    const totalPrice = (product.price * quantity).toFixed(2)

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-6 space-y-6"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Quantité ({product.unit})</label>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[60px] text-center">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= product.stock}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600">
                                Stock disponible: {/*product.stock*/} __ {product.unit}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Prix unitaire:</span>
                        <span className="font-medium">
                            {product.price}€ / {product.unit}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-amber-600">{totalPrice}€</span>
                    </div>
                    {product.compareAtPrice && (
                        <div className="mt-2 text-sm text-green-600">
                            Économie totale: {((product.compareAtPrice - product.price) * quantity).toFixed(2)}€
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        variant="primary"
                        size="lg"
                        className="w-full flex items-center justify-center space-x-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{product.inStock ? "Ajouter au panier" : "Produit indisponible"}</span>
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${isWishlisted
                                    ? "border-red-300 bg-red-50 text-red-600"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                            <span className="text-sm font-medium">{isWishlisted ? "Ajouté" : "Favoris"}</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleShare}
                            className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Partager</span>
                        </motion.button>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <button className="w-full flex items-center justify-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors">
                        <Calculator className="w-4 h-4" />
                        <span className="text-sm font-medium">Calculer mes besoins</span>
                    </button>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Livraison</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Livraison 24-48h partout en France</li>
                        <li>• Gratuite dès 200€ d'achat</li>
                        <li>• Déchargement inclus</li>
                    </ul>
                </div>
            </motion.div>

            <CartToast
                product={{
                    name: product.name,
                    price: product.price,
                    unit: product.unit,
                    image: product.images?.[0]?.url || "/images/placeholder-product.jpg",
                }}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </>
    )
}