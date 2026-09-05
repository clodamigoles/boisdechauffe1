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
import { countActiveProducts, getHomeCatalog } from '@/lib/catalog-stats'
import { useSettings } from '@/hooks/useSettings'
import SeoHead from "@/components/layout/SeoHead"
import { useT } from "@/lib/i18n"

export default function HomePage({
    initialCategories,
    initialProducts,
    initialShowcase,
    productCount,
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
                        productCount={productCount}
                        rating={initialShowcase?.average ?? 0}
                    />

                    <ProductsSection products={products} />

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

export async function getStaticProps({ locale }) {
    // Les données sont lues en base, pas demandées à l'API de ce même site :
    // `getStaticProps` s'exécute à la construction, quand aucun serveur
    // n'écoute encore. L'appel HTTP échouait, le repli rendait des tableaux
    // vides, et la page partait en production sans catégories ni produits.
    try {
        const [{ categories, products }, showcase, productCount] = await Promise.all([
            getHomeCatalog(locale, 8),
            getReviewShowcase().catch(() => null),
            countActiveProducts().catch(() => 0),
        ])

        return {
            props: JSON.parse(
                JSON.stringify({
                    initialCategories: categories,
                    initialProducts: products,
                    initialShowcase: showcase,
                    productCount,
                    hasErrors: false,
                }),
            ),
            // Régénération toutes les heures : le catalogue bouge peu, les
            // avis un peu plus.
            revalidate: 3600,
        }
    } catch (error) {
        console.error("Accueil : lecture des données impossible", error)

        return {
            props: {
                initialCategories: [],
                initialProducts: [],
                initialShowcase: null,
                productCount: 0,
                hasErrors: true,
            },
            revalidate: 300,
        }
    }
}
