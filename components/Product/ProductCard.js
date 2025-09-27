import { motion } from 'framer-motion'
import Link from 'next/link'
import useCartStore from '@/lib/store/cartStore'
import { useState } from 'react'
import toast from 'react-hot-toast'

const StarIcon = ({ filled = false }) => (
    <svg
        className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
)

const CartIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L6 5H5m0 0L3 3m4 10v6a1 1 0 001 1h9a1 1 0 001-1v-6M7 13l-4-8" />
    </svg>
)

const HeartIcon = ({ filled = false }) => (
    <svg
        className={`w-5 h-5 ${filled ? 'text-red-500' : 'text-gray-400'}`}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
)

export default function ProductCard({ product, className = "" }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const addItem = useCartStore(state => state.addItem)

    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        setIsLoading(true)

        try {
            addItem(product, 1)
            toast.success(`${product.name} ajouté au panier !`, {
                icon: '🛒',
                style: {
                    background: '#10B981',
                    color: 'white',
                },
            })
        } catch (error) {
            toast.error('Erreur lors de l\'ajout au panier')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleFavorite = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorite(!isFavorite)

        toast.success(
            isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
            {
                icon: isFavorite ? '💔' : '❤️',
                duration: 2000,
            }
        )
    }

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <StarIcon key={index} filled={index < Math.floor(rating)} />
        ))
    }

    const renderBadges = () => {
        if (!product.badges?.length) return null

        const badgeStyles = {
            nouveau: 'bg-green-100 text-green-800',
            populaire: 'bg-blue-100 text-blue-800',
            premium: 'bg-purple-100 text-purple-800',
            économique: 'bg-orange-100 text-orange-800',
            local: 'bg-yellow-100 text-yellow-800'
        }

        return (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
                {product.badges.map((badge, index) => (
                    <motion.span
                        key={badge}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${badgeStyles[badge] || 'bg-gray-100 text-gray-800'}`}
                    >
                        {badge}
                    </motion.span>
                ))}
            </div>
        )
    }

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${className}`}
        >
            <Link href={`/produits/${product.slug}`}>
                <div className="cursor-pointer">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-wood-100 to-wood-200">
                        {product.images?.[0]?.url ? (
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                                src={product.images[0].url}
                                alt={product.images[0].alt || product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <motion.span
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-6xl"
                                >
                                    🪵
                                </motion.span>
                            </div>
                        )}

                        {/* Overlay with actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/20 flex items-center justify-center gap-3"
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleFavorite}
                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all"
                            >
                                <HeartIcon filled={isFavorite} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleAddToCart}
                                disabled={isLoading || product.stock === 0}
                                className="p-3 bg-primary-500 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : (
                                    <CartIcon />
                                )}
                            </motion.button>
                        </motion.div>

                        {/* Badges */}
                        {renderBadges()}

                        {/* Favorite button (mobile) */}
                        <button
                            onClick={toggleFavorite}
                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg md:opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <HeartIcon filled={isFavorite} />
                        </button>

                        {/* Stock indicator */}
                        {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                                    Rupture de stock
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Title and essence */}
                        <div className="mb-3">
                            <h3 className="font-heading text-lg text-gray-800 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 capitalize">
                                Essence : {product.essence}
                            </p>
                        </div>

                        {/* Rating */}
                        {product.averageRating > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center">
                                    {renderStars(product.averageRating)}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {product.averageRating} ({product.reviewCount} avis)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-primary-600">
                                    {product.price}€
                                </span>
                                <span className="text-sm text-gray-500">
                                    /{product.unit}
                                </span>
                                {product.compareAtPrice && (
                                    <span className="text-sm text-gray-400 line-through">
                                        {product.compareAtPrice}€
                                    </span>
                                )}
                            </div>

                            {product.compareAtPrice && (
                                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                                    -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                                </span>
                            )}
                        </div>

                        {/* Add to cart button (mobile) */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCart}
                            disabled={isLoading || product.stock === 0}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed md:hidden flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Ajout...
                                </>
                            ) : (
                                <>
                                    <CartIcon />
                                    Ajouter au panier
                                </>
                            )}
                        </motion.button>

                        {/* Stock info */}
                        {product.stock > 0 && product.stock <= 5 && (
                            <p className="text-xs text-orange-600 mt-2 font-medium">
                                ⚠️ Plus que {product.stock} en stock
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}