import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import ProductsSection from '@/components/home/ProductsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import { pageVariants } from '@/utils/animations'
import { cachedAPI } from '@/lib/api'
import { useSettings } from '@/hooks/useSettings'

export default function HomePage({
    initialCategories,
    initialProducts,
    initialTestimonials,
    hasErrors
}) {
    const { siteName } = useSettings()
    const [isLoading, setIsLoading] = useState(true)
    const [categories, setCategories] = useState(initialCategories || [])
    const [products, setProducts] = useState(initialProducts || [])
    const [testimonials, setTestimonials] = useState(initialTestimonials || [])

    useEffect(() => {
        // Simuler un temps de chargement pour une meilleure UX
        const timer = setTimeout(() => setIsLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])

    // Recharger les données si elles sont manquantes (fallback côté client)
    useEffect(() => {
        const loadMissingData = async () => {
            try {
                const promises = []

                if (!categories.length) {
                    promises.push(cachedAPI.categories.getFeatured())
                }
                if (!products.length) {
                    promises.push(cachedAPI.products.getFeatured('all', 8))
                }
                if (!testimonials.length) {
                    promises.push(cachedAPI.testimonials.getFeatured(6))
                }

                if (promises.length > 0) {
                    const results = await Promise.allSettled(promises)

                    let index = 0
                    if (!categories.length && results[index]?.status === 'fulfilled') {
                        setCategories(results[index].value.data || [])
                        index++
                    }
                    if (!products.length && results[index]?.status === 'fulfilled') {
                        setProducts(results[index].value.data || [])
                        index++
                    }
                    if (!testimonials.length && results[index]?.status === 'fulfilled') {
                        setTestimonials(results[index].value.data || [])
                    }
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données manquantes:', error)
            }
        }

        if (hasErrors) {
            loadMissingData()
        }
    }, [hasErrors, categories.length, products.length, testimonials.length])

    return (
        <>
            <Head>
                <title>{`${siteName} | Livraison Rapide`}</title>
                <meta name="description" content="Découvrez notre sélection premium de bois de chauffage : chêne, hêtre, charme séchés < 18% d'humidité. Qualité garantie, livraison 24-48h partout en France. Devis gratuit !" />
                <meta name="keywords" content="bois de chauffage, chêne, hêtre, charme, granulés, livraison rapide, premium, qualité, sec" />
            </Head>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 bg-white flex items-center justify-center z-50"
                    >
                        <div className="text-center">
                            <div className="relative mb-8">
                                {/* Logo animé */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                                >
                                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                                        <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl font-semibold text-gray-900 mb-2"
                            >
                                {siteName}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-600"
                            >
                                Chargement de votre expérience premium...
                            </motion.p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        variants={pageVariants}
                        className="min-h-screen bg-white"
                    >
                        <Header />

                        <main>
                            <HeroSection />

                            <CategoriesSection
                                categories={categories}
                                fallbackMessage={hasErrors ? "Chargement des catégories..." : null}
                            />

                            <ProductsSection
                                products={products}
                                fallbackMessage={hasErrors ? "Chargement des produits..." : null}
                            />

                            <TestimonialsSection
                                testimonials={testimonials}
                                fallbackMessage={hasErrors ? "Chargement des témoignages..." : null}
                            />

                            <NewsletterSection />
                        </main>

                        <Footer />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export async function getStaticProps() {
    try {
        // Timeouts pour éviter les blocages
        const TIMEOUT_DURATION = 8000 // 8 secondes

        const createTimeoutPromise = (ms) => new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), ms)
        )

        // Tentative de chargement des données avec timeout
        const loadWithTimeout = async (apiCall, fallback = []) => {
            try {
                const result = await Promise.race([
                    apiCall(),
                    createTimeoutPromise(TIMEOUT_DURATION)
                ])
                return result?.data || fallback
            } catch (error) {
                console.error('Erreur lors du chargement:', error)
                return fallback
            }
        }

        // Chargement des données en parallèle
        const [categories, products, testimonials] = await Promise.all([
            loadWithTimeout(() => cachedAPI.categories.getFeatured(false)),
            loadWithTimeout(() => cachedAPI.products.getFeatured('all', 8, false)),
            loadWithTimeout(() => cachedAPI.testimonials.getFeatured(6, false))
        ])

        // Vérifier si toutes les données ont été chargées
        const hasErrors = !categories.length && !products.length && !testimonials.length

        return {
            props: {
                initialCategories: categories,
                initialProducts: products,
                initialTestimonials: testimonials,
                hasErrors
            },
            // Revalidation ISR - régénérer la page toutes les heures
            revalidate: 3600
        }
    } catch (error) {
        console.error('Erreur critique lors du chargement des données:', error)

        // En cas d'erreur critique, retourner des props vides
        return {
            props: {
                initialCategories: [],
                initialProducts: [],
                initialTestimonials: [],
                hasErrors: true
            },
            // Revalidation plus fréquente en cas d'erreur
            revalidate: 300 // 5 minutes
        }
    }
}