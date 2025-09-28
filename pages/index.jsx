import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/home/HeroSection'
import CategoriesSection from '../components/home/CategoriesSection'
import ProductsSection from '../components/home/ProductsSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import NewsletterSection from '../components/home/NewsletterSection'
import { pageVariants } from '../utils/animations'
import { cachedAPI } from '../lib/api'

export default function HomePage({
    initialCategories,
    initialProducts,
    initialTestimonials,
    hasErrors
}) {
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
                <title>BoisChauffage Pro - Bois de Chauffage Premium | Livraison Rapide France</title>
                <meta name="description" content="Découvrez notre sélection premium de bois de chauffage : chêne, hêtre, charme séchés < 18% d'humidité. Qualité garantie, livraison 24-48h partout en France. Devis gratuit !" />
                <meta name="keywords" content="bois de chauffage, chêne, hêtre, charme, granulés, livraison rapide, premium, qualité, sec, france" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://boischauffagepro.fr/" />
                <meta property="og:title" content="BoisChauffage Pro - Bois de Chauffage Premium" />
                <meta property="og:description" content="Bois de chauffage premium avec livraison rapide partout en France. Chêne, hêtre, charme séchés < 18% d'humidité." />
                <meta property="og:image" content="https://boischauffagepro.fr/images/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://boischauffagepro.fr/" />
                <meta property="twitter:title" content="BoisChauffage Pro - Bois de Chauffage Premium" />
                <meta property="twitter:description" content="Bois de chauffage premium avec livraison rapide partout en France." />
                <meta property="twitter:image" content="https://boischauffagepro.fr/images/og-image.jpg" />

                {/* Autres meta tags */}
                <meta name="robots" content="index, follow" />
                <meta name="author" content="BoisChauffage Pro" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="canonical" href="https://boischauffagepro.fr" />

                {/* Preload des ressources critiques */}
                <link rel="preload" href="/videos/hero-background.mp4" as="video" type="video/mp4" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

                {/* JSON-LD Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "BoisChauffage Pro",
                            "url": "https://boischauffagepro.fr",
                            "logo": "https://boischauffagepro.fr/images/logo.png",
                            "description": "Spécialiste du bois de chauffage premium avec livraison rapide en France",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "123 Route Forestière",
                                "addressLocality": "Lyon",
                                "postalCode": "69000",
                                "addressCountry": "FR"
                            },
                            "telephone": "+33123456789",
                            "email": "contact@boischauffagepro.fr",
                            "sameAs": [
                                "https://facebook.com/boischauffagepro",
                                "https://instagram.com/boischauffagepro"
                            ]
                        })
                    }}
                />
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
                                    <motion.span
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-2xl"
                                    >
                                        🔥
                                    </motion.span>
                                </motion.div>

                                <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
                            </div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl font-semibold text-gray-900 mb-2"
                            >
                                BoisChauffage Pro
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