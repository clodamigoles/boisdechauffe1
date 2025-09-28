"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, X, Eye } from "lucide-react"

export default function CartToast({ product, onClose, isVisible }) {
    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 max-w-sm w-full"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">Ajouté au panier !</span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </motion.button>
            </div>

            {/* Product Info */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate text-sm">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                        {product.price}€ / {product.unit}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
                <Link href="/panier" className="flex-1">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Eye className="w-4 h-4" />
                        <span>Voir le panier</span>
                    </motion.button>
                </Link>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Continuer
                </motion.button>
            </div>
        </motion.div>
    )
}