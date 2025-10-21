"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal, Grid3X3, List } from "lucide-react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import ProductCard from "../components/ui/ProductCard"
import ProductFilters from "../components/shop/ProductFilters"
import ProductSort from "../components/shop/ProductSort"
import ProductSearch from "../components/shop/ProductSearch"
import Pagination from "../components/shop/Pagination"
import Breadcrumb from "../components/ui/Breadcrumb"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import EmptyState from "../components/ui/EmptyState"
import { pageVariants } from "../utils/animations"
import { useTranslation } from "@/lib/useTranslation"
import { translateCategories } from "@/lib/translateCategory"

export default function ShopPage({ initialProducts, categories, totalProducts: initialTotal, totalPages: initialTotalPages }) {
    const router = useRouter()
    const { t } = useTranslation('shop')
    const [products, setProducts] = useState(initialProducts || [])
    const [totalProducts, setTotalProducts] = useState(initialTotal || 0)
    const [totalPages, setTotalPages] = useState(initialTotalPages || 0)
    const [loading, setLoading] = useState(false)
    const [viewMode, setViewMode] = useState("grid")
    const [showFilters, setShowFilters] = useState(false)

    // Extraction des filtres depuis l'URL - memoized pour éviter recalculs
    const filters = useMemo(() => ({
        category: router.query.category || "",
        essence: router.query.essence || "",
        priceRange: router.query.priceRange || "",
        inStock: router.query.inStock === "true",
        search: router.query.search || "",
        sort: router.query.sort || "name-asc",
        page: Number.parseInt(router.query.page) || 1,
        badges: router.query.badges || "",
        promotion: router.query.promotion || ""
    }), [router.query])

    // Référence pour savoir si c'est le premier chargement
    const isFirstLoad = useRef(true)
    const previousQueryRef = useRef('')

    // Chargement des produits
    const loadProducts = useCallback(async (currentFilters) => {
        setLoading(true)
        try {
            const searchParams = new URLSearchParams()
            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value && value !== "" && value !== false) {
                    searchParams.append(key, value.toString())
                }
            })

            const response = await fetch(`/api/products/search?${searchParams.toString()}`)
            const data = await response.json()

            if (data.success) {
                setProducts(data.products || [])
                setTotalProducts(data.total || 0)
                setTotalPages(data.totalPages || 0)
            }
        } catch (error) {
            console.error("Erreur lors du chargement des produits:", error)
            setProducts([])
            setTotalProducts(0)
            setTotalPages(0)
        } finally {
            setLoading(false)
        }
    }, [])

    // Effet pour charger les produits UNIQUEMENT quand l'URL change
    useEffect(() => {
        if (!router.isReady) return

        const currentQuery = router.asPath.split('?')[1] || ''
        
        // Ne charger que si l'URL a vraiment changé
        if (isFirstLoad.current) {
            isFirstLoad.current = false
            previousQueryRef.current = currentQuery
            return // Ne rien faire au premier chargement (SSR a déjà chargé)
        }

        if (currentQuery !== previousQueryRef.current) {
            previousQueryRef.current = currentQuery
            loadProducts(filters)
        }
    }, [router.isReady, router.asPath, filters, loadProducts])

    // Mise à jour de l'URL - optimisée
    const updateFilters = useCallback((key, value) => {
        const newQuery = { ...router.query }
        
        // Supprimer la clé si valeur vide/false
        if (!value || value === "" || value === false) {
            delete newQuery[key]
        } else {
            newQuery[key] = value.toString()
        }
        
        // Reset page si ce n'est pas un changement de page
        if (key !== 'page') {
            delete newQuery.page
        }

        router.push({
            pathname: "/shop",
            query: newQuery
        }, undefined, { shallow: true })
    }, [router])

    // Gestion du changement de page
    const handlePageChange = useCallback((page) => {
        updateFilters('page', page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [updateFilters])

    // Reset des filtres
    const resetFilters = useCallback(() => {
        router.push("/shop", undefined, { shallow: true })
    }, [router])

    // Traduire les catégories
    const translatedCategories = useMemo(() => {
        if (typeof window !== 'undefined' && window.__TRANSLATIONS__?.categories) {
            return translateCategories(categories, window.__TRANSLATIONS__.categories)
        }
        return categories
    }, [categories])

    // Breadcrumb memoized
    const breadcrumbItems = useMemo(() => {
        const items = [
            { label: t('breadcrumb.home'), href: "/" },
            { label: t('breadcrumb.shop'), href: "/shop" }
        ]
        
        if (filters.category) {
            const category = translatedCategories?.find((c) => c.slug === filters.category)
            if (category) {
                items.push({ label: category.name })
            }
        }
        
        return items
    }, [filters.category, translatedCategories, t])

    // Compteur de filtres actifs
    const activeFiltersCount = useMemo(() => {
        return Object.entries(filters).filter(([key, value]) => 
            value && value !== "" && value !== false && 
            key !== 'sort' && key !== 'page'
        ).length
    }, [filters])

    return (
        <>
            <Head>
                <title>{t('seo.title')}</title>
                <meta
                    name="description"
                    content={t('seo.description')}
                />
                <meta name="keywords" content={t('seo.keywords')} />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="pt-20">
                    {/* Breadcrumb */}
                    <div className="bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>

                    {/* En-tête de la boutique */}
                    <motion.div
                        initial="initial"
                        animate="enter"
                        variants={pageVariants}
                        className="bg-white border-b border-gray-200"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('header.title')}</h1>
                                    <p className="text-lg text-gray-600">
                                        {t('header.productsCount', { count: totalProducts })}
                                    </p>
                                </div>

                                {/* Barre de recherche */}
                                <div className="flex-1 max-w-md">
                                    <ProductSearch
                                        value={filters.search}
                                        onChange={(value) => updateFilters("search", value)}
                                        placeholder={t('header.searchPlaceholder')}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sidebar Filtres - Desktop */}
                            <aside className="hidden lg:block w-80 flex-shrink-0">
                                <div className="sticky top-24">
                                    <ProductFilters
                                        filters={filters}
                                        categories={translatedCategories}
                                        onChange={updateFilters}
                                        onReset={resetFilters}
                                    />
                                </div>
                            </aside>

                            {/* Contenu principal */}
                            <div className="flex-1 min-w-0">
                                {/* Barre d'outils */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        {/* Bouton filtres mobile + résultats */}
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setShowFilters(!showFilters)}
                                                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <SlidersHorizontal className="w-4 h-4" />
                                                <span>{t('toolbar.filters')}</span>
                                                {activeFiltersCount > 0 && (
                                                    <span className="bg-amber-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                                        {activeFiltersCount}
                                                    </span>
                                                )}
                                            </button>

                                            <div className="text-sm text-gray-600">
                                                {t('toolbar.results', { count: products.length })}
                                            </div>
                                        </div>

                                        {/* Contrôles de vue et tri */}
                                        <div className="flex items-center gap-4">
                                            {/* Mode d'affichage */}
                                            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => setViewMode("grid")}
                                                    className={`p-2 rounded-md transition-colors ${
                                                        viewMode === "grid"
                                                            ? "bg-white text-gray-900 shadow-sm"
                                                            : "text-gray-600 hover:text-gray-900"
                                                    }`}
                                                    aria-label={t('toolbar.viewGrid')}
                                                >
                                                    <Grid3X3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setViewMode("list")}
                                                    className={`p-2 rounded-md transition-colors ${
                                                        viewMode === "list"
                                                            ? "bg-white text-gray-900 shadow-sm"
                                                            : "text-gray-600 hover:text-gray-900"
                                                    }`}
                                                    aria-label={t('toolbar.viewList')}
                                                >
                                                    <List className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Tri */}
                                            <ProductSort 
                                                value={filters.sort} 
                                                onChange={(value) => updateFilters("sort", value)} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Filtres mobile */}
                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="lg:hidden mb-6 overflow-hidden"
                                        >
                                            <ProductFilters
                                                filters={filters}
                                                categories={translatedCategories}
                                                onChange={updateFilters}
                                                onReset={resetFilters}
                                                mobile
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Liste des produits */}
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex justify-center items-center py-20"
                                        >
                                            <LoadingSpinner />
                                        </motion.div>
                                    ) : products.length === 0 ? (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <EmptyState
                                                type="search"
                                                onAction={resetFilters}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="products" 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            exit={{ opacity: 0 }}
                                        >
                                            <div
                                                className={`grid gap-6 ${
                                                    viewMode === "grid" 
                                                        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                                                        : "grid-cols-1"
                                                }`}
                                            >
                                                {products.map((product, index) => (
                                                    <motion.div
                                                        key={product._id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: Math.min(index * 0.05, 0.3) }}
                                                    >
                                                        <ProductCard product={product} viewMode={viewMode} />
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Pagination */}
                                            {totalPages > 1 && (
                                                <div className="mt-12">
                                                    <Pagination
                                                        currentPage={filters.page}
                                                        totalPages={totalPages}
                                                        onPageChange={handlePageChange}
                                                    />
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    )
}

export async function getServerSideProps({ query, locale }) {
    const { loadTranslations } = await import('../lib/i18n-server')
    
    try {
        // Charger les traductions
        const translations = await loadTranslations(locale || 'en', ['common', 'shop', 'categories', 'products'])
        
        const searchParams = new URLSearchParams()
        Object.entries(query).forEach(([key, value]) => {
            if (value && value !== "" && value !== "false") {
                searchParams.append(key, value.toString())
            }
        })

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        
        const [productsRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/api/products/search?${searchParams.toString()}`),
            fetch(`${baseUrl}/api/categories`)
        ])

        const [productsData, categoriesData] = await Promise.all([
            productsRes.ok ? productsRes.json() : { products: [], total: 0, totalPages: 0 },
            categoriesRes.ok ? categoriesRes.json() : { data: [] }
        ])

        return {
            props: {
                translations,
                initialProducts: productsData.products || [],
                categories: categoriesData.data || [],
                totalProducts: productsData.total || 0,
                totalPages: productsData.totalPages || 0
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement de la boutique:", error)

        const translations = await loadTranslations(locale || 'en', ['common', 'shop', 'categories', 'products'])
        
        return {
            props: {
                translations,
                initialProducts: [],
                categories: [],
                totalProducts: 0,
                totalPages: 0
            }
        }
    }
}