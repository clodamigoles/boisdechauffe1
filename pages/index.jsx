import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import ProductsSection from '@/components/home/ProductsSection'
import DeliverySection from '@/components/home/DeliverySection'
import DepotGallery from '@/components/home/DepotGallery'
import VideoReels from '@/components/home/VideoReels'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import { pageVariants } from '@/utils/animations'
import { cachedAPI } from '@/lib/api'
import { getReviewShowcase } from '@/lib/reviews'
import { useSettings } from '@/hooks/useSettings'
import SeoHead from "@/components/layout/SeoHead"
import { useT } from "@/lib/i18n"

export default function HomePage({
    initialCategories,
    initialProducts,
    initialShowcase,
    hasErrors
}) {
    const t = useT()
    const { siteName } = useSettings()
    const [categories, setCategories] = useState(initialCategories || [])
    const [products, setProducts] = useState(initialProducts || [])

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
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données manquantes:', error)
            }
        }

        if (hasErrors) {
            loadMissingData()
        }
    }, [hasErrors, categories.length, products.length])

    return (
        <>
            <SeoHead
                title={t('meta.homeTitle')}
                description={t('meta.homeDescription')}
            />

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

                    <DeliverySection />

                    {/* La preuve avant l'avis : le visiteur voit d'abord d'où
                        part sa commande, puis ce qu'en disent les clients. */}
                    <DepotGallery />

                    <VideoReels />

                    <TestimonialsSection showcase={initialShowcase} />

                    <NewsletterSection />
                </main>

                <Footer />
            </motion.div>
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

        // Chargement des données en parallèle.
        //
        // Les avis sont lus directement en base plutôt qu'à travers l'API :
        // une page statique qui appelle sa propre API au moment de la
        // construction dépend d'un serveur qui n'est pas encore démarré, et le
        // repli renvoyait alors une liste vide. C'est ce qui faisait servir
        // « 6 avis, moyenne 0 » dans le HTML.
        const [categories, products, showcase] = await Promise.all([
            loadWithTimeout(() => cachedAPI.categories.getFeatured(false)),
            loadWithTimeout(() => cachedAPI.products.getFeatured('all', 8, false)),
            getReviewShowcase().catch(() => null)
        ])

        const hasErrors = !categories.length && !products.length

        return {
            props: {
                initialCategories: categories,
                initialProducts: products,
                initialShowcase: showcase
                    ? JSON.parse(JSON.stringify(showcase))
                    : null,
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
                initialShowcase: null,
                hasErrors: true
            },
            // Revalidation plus fréquente en cas d'erreur
            revalidate: 300 // 5 minutes
        }
    }
}