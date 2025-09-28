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

export default function HomePage({ categories, products, testimonials }) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <Head>
                <title>BoisChauffage Pro - Bois de Chauffage Premium | Livraison Rapide</title>
                <meta name="description" content="Découvrez notre sélection premium de bois de chauffage : chêne, hêtre, charme. Qualité garantie, livraison rapide partout en France. Commandez en ligne !" />
                <meta name="keywords" content="bois de chauffage, chêne, hêtre, charme, livraison, premium, qualité" />
                <meta property="og:title" content="BoisChauffage Pro - Bois de Chauffage Premium" />
                <meta property="og:description" content="Bois de chauffage premium avec livraison rapide partout en France" />
                <meta property="og:image" content="/images/og-image.jpg" />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://boischauffagepro.fr" />
                <link rel="preload" href="/videos/hero-background.mp4" as="video" />
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
                            <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xl font-semibold text-gray-900 mb-2"
                            >
                                BoisChauffage Pro
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-600"
                            >
                                Chargement...
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
                            <CategoriesSection categories={categories} />
                            <ProductsSection products={products} />
                            <TestimonialsSection testimonials={testimonials} />
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
        const [categoriesRes, productsRes, testimonialsRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories/featured`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/featured`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/testimonials/featured`)
        ])

        const [categories, products, testimonials] = await Promise.all([
            categoriesRes.ok ? categoriesRes.json() : { data: [] },
            productsRes.ok ? productsRes.json() : { data: [] },
            testimonialsRes.ok ? testimonialsRes.json() : { data: [] }
        ])

        return {
            props: {
                categories: categories.data || [],
                products: products.data || [],
                testimonials: testimonials.data || []
            },
            revalidate: 3600
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error)

        return {
            props: {
                categories: [],
                products: [],
                testimonials: []
            },
            revalidate: 60
        }
    }
}