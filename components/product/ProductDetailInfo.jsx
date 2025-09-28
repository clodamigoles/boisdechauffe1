"use client"

import { motion } from "framer-motion"
import { Star, Truck, Shield, Award, Clock } from "lucide-react"

export default function ProductDetailInfo({ product }) {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
        ))
    }

    const features = [
        {
            icon: Truck,
            title: "Livraison 24-48h",
            description: "Partout en France",
        },
        {
            icon: Shield,
            title: "Qualité garantie",
            description: "Bois séché et contrôlé",
        },
        {
            icon: Award,
            title: "Premium",
            description: "Sélection rigoureuse",
        },
        {
            icon: Clock,
            title: "Stock disponible",
            description: `${product.stock} ${product.unit} en stock`,
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
        >
            {/* En-tête */}
            <div>
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        {product.category?.name}
                    </span>
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {product.essence}
                    </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                {/* Évaluation */}
                {product.averageRating > 0 && (
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center space-x-1">{renderStars(product.averageRating)}</div>
                        <span className="text-sm text-gray-600">
                            {product.averageRating.toFixed(1)} ({product.reviewCount} avis)
                        </span>
                    </div>
                )}

                <p className="text-lg text-gray-600 leading-relaxed">{product.shortDescription}</p>
            </div>

            {/* Prix */}
            <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-bold text-gray-900">{product.price}€</span>
                        <span className="text-lg text-gray-600">/ {product.unit}</span>
                    </div>
                    {product.compareAtPrice && (
                        <div className="flex flex-col">
                            <span className="text-xl text-gray-500 line-through">{product.compareAtPrice}€</span>
                            <span className="text-sm font-medium text-green-600">
                                Économie: {Math.round(product.compareAtPrice - product.price)}€
                            </span>
                        </div>
                    )}
                </div>

                {/* Indicateurs de stock */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-400" : "bg-red-400"}`}></div>
                        <span className={`text-sm font-medium ${product.inStock ? "text-green-700" : "text-red-700"}`}>
                            {product.inStock ? "En stock" : "Rupture de stock"}
                        </span>
                    </div>
                    {product.isLowStock && <span className="text-sm text-orange-600 font-medium">Stock limité</span>}
                </div>
            </div>

            {/* Description détaillée */}
            {product.description && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>
                </div>
            )}

            {/* Caractéristiques rapides */}
            <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100"
                    >
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <feature.icon className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                            <p className="text-xs text-gray-600">{feature.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}