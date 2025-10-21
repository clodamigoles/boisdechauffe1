"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Star, Zap, Droplets, Flame } from "lucide-react"
import { useCartStore } from "../../store/cartStore"
import Button from "./Button"
import CartToast from "./CartToast"
import { useTranslation } from '@/lib/useTranslation'

export default function ProductCard({ product }) {
    const { t } = useTranslation('common')
    const [isImageLoading, setIsImageLoading] = useState(true)
    const [imageError, setImageError] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const addToCart = useCartStore((state) => state.addItem)

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const productData = {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.url || "/images/placeholder-product.jpg",
            unit: product.unit,
        }
        addToCart(productData)

        setShowToast(true)
        setTimeout(() => setShowToast(false), 4000)
    }

    const getBadgeStyle = (badge) => {
        const styles = {
            premium: "bg-amber-600 text-white",
            bestseller: "bg-red-600 text-white",
            nouveau: "bg-green-600 text-white",
            populaire: "bg-blue-600 text-white",
            offre: "bg-purple-600 text-white",
            écologique: "bg-emerald-600 text-white",
            innovation: "bg-indigo-600 text-white",
        }
        return styles[badge] || "bg-gray-600 text-white"
    }

    const getSpecIcon = (specName) => {
        const icons = {
            Humidité: Droplets,
            "Pouvoir calorifique": Flame,
            Densité: Zap,
        }
        return icons[specName] || Zap
    }

    const discount = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : null

    return (
        <>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3, ease: "easeOut" }} className="group">
                <Link href={`/produits/${product.slug}`}>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                        {/* Image Container */}
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                            {!imageError ? (
                                <Image
                                    src={product.images?.[0]?.url || "/images/placeholder-product.jpg"}
                                    alt={product.images?.[0]?.alt || product.name}
                                    fill
                                    className={`object-cover transition-all duration-500 group-hover:scale-110 ${isImageLoading ? "blur-sm" : "blur-0"
                                        }`}
                                    onLoad={() => setIsImageLoading(false)}
                                    onError={() => {
                                        setImageError(true)
                                        setIsImageLoading(false)
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                                        <Flame className="w-8 h-8 text-gray-400" />
                                    </div>
                                </div>
                            )}

                            {/* Overlay au hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    whileHover={{ scale: 1, opacity: 1 }}
                                    className="text-white font-medium"
                                >
                                    {t('product.viewProduct')}
                                </motion.div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                {product.badges?.slice(0, 2).map((badge) => (
                                    <motion.span
                                        key={badge}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${getBadgeStyle(badge)} shadow-sm`}
                                    >
                                        {badge.charAt(0).toUpperCase() + badge.slice(1)}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Réduction */}
                            {discount && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-bold"
                                >
                                    -{discount}%
                                </motion.div>
                            )}

                            {/* Étoiles */}
                            {product.averageRating && (
                                <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < Math.floor(product.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-600">({product.reviewCount})</span>
                                </div>
                            )}
                        </div>

                        {/* Contenu */}
                        <div className="p-4">
                            {/* En-tête produit */}
                            <div className="mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{product.shortDescription}</p>
                            </div>

                            {/* Spécifications */}
                            {product.specifications && product.specifications.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    {product.specifications.slice(0, 2).map((spec, index) => {
                                        const SpecIcon = getSpecIcon(spec.name)
                                        return (
                                            <div key={index} className="flex items-center justify-between text-sm">
                                                <span className="flex items-center space-x-2 text-gray-600">
                                                    <SpecIcon className="w-4 h-4" />
                                                    <span>{spec.name}</span>
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {spec.value} {spec.unit}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Prix */}
                            <div className="mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xl font-bold text-gray-900">{product.price}€</span>
                                    {product.compareAtPrice && (
                                        <span className="text-lg text-gray-500 line-through">{product.compareAtPrice}€</span>
                                    )}
                                    <span className="text-sm text-gray-600">/ {product.unit}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2">
                                <Button
                                    onClick={handleAddToCart}
                                    variant="primary"
                                    size="sm"
                                    className="flex-1 flex items-center justify-center space-x-2"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>{t('product.addToCart')}</span>
                                </Button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 border border-gray-200 rounded-lg hover:border-amber-400 hover:text-amber-600 transition-colors"
                                    aria-label={t('product.addToFavorites')}
                                >
                                    <Heart className="w-4 h-4" />
                                </motion.button>
                            </div>

                            {/* Indicateurs de stock et livraison */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span>{t('product.inStock')}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Zap className="w-3 h-3" />
                                        <span>{t('product.delivery')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
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