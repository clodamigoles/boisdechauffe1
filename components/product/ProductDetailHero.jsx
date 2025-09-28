"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn, Flame } from "lucide-react"

export default function ProductDetailHero({ product }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)
    const [imageError, setImageError] = useState(false)

    const images =
        product.images?.length > 0
            ? product.images
            : [{ url: "/images/placeholder-product.jpg", alt: product.name, isPrimary: true }]

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
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

    return (
        <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
                {!imageError ? (
                    <Image
                        src={images[currentImageIndex]?.url || "/placeholder.svg"}
                        alt={images[currentImageIndex]?.alt || product.name}
                        fill
                        className="object-cover"
                        priority
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Flame className="w-12 h-12 text-gray-400" />
                        </div>
                    </div>
                )}

                {/* Badges */}
                {product.badges && product.badges.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {product.badges.slice(0, 3).map((badge) => (
                            <motion.span
                                key={badge}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeStyle(badge)} shadow-sm`}
                            >
                                {badge.charAt(0).toUpperCase() + badge.slice(1)}
                            </motion.span>
                        ))}
                    </div>
                )}

                {/* Réduction */}
                {product.discountPercentage > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-full text-lg font-bold shadow-lg"
                    >
                        -{product.discountPercentage}%
                    </motion.div>
                )}

                {/* Navigation des images */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </>
                )}

                {/* Bouton zoom */}
                <button
                    onClick={() => setIsZoomed(true)}
                    className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>

                {/* Indicateurs d'images */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Miniatures */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.slice(0, 4).map((image, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex ? "border-amber-500" : "border-gray-200"
                                }`}
                        >
                            <Image
                                src={image.url || "/placeholder.svg"}
                                alt={image.alt || `${product.name} ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Modal zoom */}
            <AnimatePresence>
                {isZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setIsZoomed(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative max-w-4xl max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[currentImageIndex]?.url || "/placeholder.svg"}
                                alt={images[currentImageIndex]?.alt || product.name}
                                width={800}
                                height={800}
                                className="object-contain max-h-[90vh]"
                            />
                            <button
                                onClick={() => setIsZoomed(false)}
                                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
                            >
                                ×
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}