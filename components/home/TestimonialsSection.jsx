import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import TestimonialCard from '../ui/TestimonialCard'
import { useSettings } from '@/hooks/useSettings'
import { useTranslation } from '@/lib/useTranslation'

export default function TestimonialsSection({ testimonials = [] }) {
    const { siteName } = useSettings()
    const { t } = useTranslation('home')
    const { t: tDemo } = useTranslation('demo')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Générer les témoignages traduits depuis demo.json
    const defaultTestimonials = Array.from({ length: 6 }, (_, i) => ({
        _id: `${i + 1}`,
        name: tDemo(`testimonials.${i}.name`),
        location: tDemo(`testimonials.${i}.location`),
        avatar: '/images/avatar.jpg',
        rating: 5,
        comment: tDemo(`testimonials.${i}.comment`),
        shortComment: tDemo(`testimonials.${i}.shortComment`),
        productPurchased: tDemo(`testimonials.${i}.productPurchased`),
        verified: true
    }))

    const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials

    useEffect(() => {
        if (isAutoPlaying && displayTestimonials.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
            }, 4000)
            return () => clearInterval(interval)
        }
    }, [isAutoPlaying, displayTestimonials.length])

    const goToSlide = (index) => {
        setCurrentIndex(index)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 8000)
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 8000)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 8000)
    }

    if (displayTestimonials.length === 0) return null

    return (
        <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4"
                    >
                        <span className="mr-2">💬</span>
                        {t('testimonials.badge')}
                    </motion.div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        {t('testimonials.title')}
                        <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {t('testimonials.titleHighlight')}
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {t('testimonials.description')}
                    </p>
                </motion.div>

                {/* Carousel Principal */}
                <div className="relative max-w-5xl mx-auto">
                    <div className="overflow-hidden rounded-3xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
                            >
                                <TestimonialCard
                                    testimonial={displayTestimonials[currentIndex]}
                                    featured={true}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Contrôles de Navigation */}
                    <div className="flex items-center justify-center mt-8 space-x-4">
                        {/* Bouton Précédent */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevSlide}
                            className="p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-amber-600 transition-colors duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>

                        {/* Indicateurs */}
                        <div className="flex space-x-2">
                            {displayTestimonials.map((_, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? 'bg-amber-600 w-8'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Bouton Suivant */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextSlide}
                            className="p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-amber-600 transition-colors duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.button>
                    </div>

                    {/* Indicateur Auto-play */}
                    <div className="flex items-center justify-center mt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isAutoPlaying
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {isAutoPlaying ? (
                                <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span>{t('testimonials.autoplay.playing')}</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                    <span>{t('testimonials.autoplay.paused')}</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Grille de témoignages secondaires
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {displayTestimonials.slice(0, 3).map((testimonial, index) => (
                        <motion.div
                            key={testimonial._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                        >
                            <TestimonialCard testimonial={testimonial} compact={true} />
                        </motion.div>
                    ))}
                </motion.div>
 */}
                {/* Statistiques Sociales
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-16 text-center"
                >
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 md:p-12 text-white">
                        <h3 className="text-3xl font-bold mb-8">Rejoignez nos clients satisfaits</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: '50k+', label: 'Clients satisfaits', icon: '😊' },
                                { value: '4.9/5', label: 'Note moyenne', icon: '⭐' },
                                { value: '98%', label: 'Recommandent', icon: '👍' },
                                { value: '15+', label: 'Années d\'expérience', icon: '🏆' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1.2 + index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="text-center"
                                >
                                    <div className="text-3xl mb-2">{stat.icon}</div>
                                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-white/90 text-sm">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.6 }}
                            className="mt-8"
                        >
                            <p className="text-lg text-white/90 mb-6">
                                Vous aussi, découvrez pourquoi nos clients nous font confiance
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                💬 Lire Plus de Témoignages
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div> */}
            </div>
        </section>
    )
}