import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, TrendingUp } from 'lucide-react'

export default function CategoryCard({ category }) {
    const [isImageLoading, setIsImageLoading] = useState(true)
    const [imageError, setImageError] = useState(false)
    const IconComponent = category.icon

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="group"
        >
            <Link href={`/shop?category=${category.slug}`}>
                <div className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-gray-100">
                    {/* Image de fond */}
                    <div className="absolute inset-0">
                        {!imageError ? (
                            <Image
                                src={category.image || '/images/placeholder-category.jpg'}
                                alt={category.name}
                                fill
                                className={`object-cover transition-all duration-500 group-hover:scale-105 ${isImageLoading ? 'blur-sm' : 'blur-0'
                                    }`}
                                onLoad={() => setIsImageLoading(false)}
                                onError={() => {
                                    setImageError(true)
                                    setIsImageLoading(false)
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <IconComponent className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badge Trending */}
                    {category.trending && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-3 right-3 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
                        >
                            <TrendingUp className="w-3 h-3" />
                            <span>Tendance</span>
                        </motion.div>
                    )}

                    {/* Contenu */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                        {/* Icône */}
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <span className="text-white text-sm font-medium">
                                    {category.productCount} produits
                                </span>
                            </div>
                        </div>

                        {/* Contenu principal */}
                        <div>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors"
                            >
                                {category.name}
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-200 text-sm mb-4"
                            >
                                {category.shortDescription}
                            </motion.p>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center justify-between"
                            >
                                <span className="text-white font-medium group-hover:text-amber-200 transition-colors flex items-center space-x-2">
                                    <span>Découvrir</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Hover Effect */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-amber-600/10 pointer-events-none"
                    />
                </div>
            </Link>
        </motion.div>
    )
}