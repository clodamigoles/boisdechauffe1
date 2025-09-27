import { motion } from 'framer-motion'
import Link from 'next/link'

const ArrowIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
)

export default function CategoryCard({ category, className = "" }) {
    const categoryIcons = {
        'bois-feuillus': '🌳',
        'bois-resineux': '🌲',
        'palettes-conditionnes': '📦',
        'mix-economiques': '🔥'
    }

    const categoryColors = {
        'bois-feuillus': 'from-green-400 to-green-600',
        'bois-resineux': 'from-emerald-400 to-emerald-600',
        'palettes-conditionnes': 'from-blue-400 to-blue-600',
        'mix-economiques': 'from-orange-400 to-orange-600'
    }

    const icon = categoryIcons[category.slug] || '🪵'
    const gradient = categoryColors[category.slug] || 'from-wood-400 to-wood-600'

    return (
        <Link href={`/categories/${category.slug}`}>
            <motion.div
                whileHover={{
                    y: -8,
                    scale: 1.03,
                    rotateY: 5
                }}
                whileTap={{ scale: 0.97 }}
                className={`group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${className}`}
            >
                {/* Header avec icône et gradient */}
                <div className={`relative h-32 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                    {/* Pattern background */}
                    <div className="absolute inset-0 bg-wood-texture opacity-10"></div>

                    {/* Floating particles */}
                    <motion.div
                        animate={{
                            y: [-5, 5, -5],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-2 right-2 text-2xl opacity-30"
                    >
                        🌿
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [5, -5, 5],
                            rotate: [0, -5, 5, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="absolute bottom-2 left-2 text-xl opacity-30"
                    >
                        ✨
                    </motion.div>

                    {/* Main icon */}
                    <motion.div
                        whileHover={{
                            scale: 1.2,
                            rotate: 10
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15
                        }}
                        className="text-6xl filter drop-shadow-lg"
                    >
                        {icon}
                    </motion.div>

                    {/* Hover overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-white/10 backdrop-blur-sm"
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <motion.h3
                            className="font-heading text-xl text-gray-800 mb-2 group-hover:text-primary-600 transition-colors duration-300"
                            whileHover={{ scale: 1.02 }}
                        >
                            {category.name}
                        </motion.h3>

                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                            {category.description}
                        </p>
                    </div>

                    {/* CTA avec flèche animée */}
                    <motion.div
                        className="flex items-center justify-between pt-4 border-t border-gray-100"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <span className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                            Découvrir
                        </span>

                        <motion.div
                            className="text-primary-600 group-hover:text-primary-700 transition-colors"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <ArrowIcon />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Shine effect au hover */}
                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{
                        x: '100%',
                        opacity: [0, 1, 0],
                        transition: { duration: 0.6, ease: "easeInOut" }
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                />
            </motion.div>
        </Link>
    )
}