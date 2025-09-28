import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/ui/ProductCard'
import ProductFilters from '../components/shop/ProductFilters'
import ProductSort from '../components/shop/ProductSort'
import ProductSearch from '../components/shop/ProductSearch'
import Pagination from '../components/shop/Pagination'
import Breadcrumb from '../components/ui/Breadcrumb'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { pageVariants } from '../utils/animations'

export default function ShopPage({ initialProducts, categories, totalProducts, totalPages }) {
    const router = useRouter()
    const [products, setProducts] = useState(initialProducts || [])
    const [loading, setLoading] = useState(false)
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [showFilters, setShowFilters] = useState(false)

    // État des filtres depuis l'URL
    const [filters, setFilters] = useState({
        category: router.query.category || '',
        essence: router.query.essence || '',
        priceRange: router.query.priceRange || '',
        inStock: router.query.inStock === 'true',
        search: router.query.search || '',
        sort: router.query.sort || 'name-asc',
        page: parseInt(router.query.page) || 1
    })

    // Mettre à jour l'URL quand les filtres changent
    const updateURL = useCallback((newFilters) => {
        const query = {}
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key] && newFilters[key] !== '' && newFilters[key] !== false) {
                query[key] = newFilters[key].toString()
            }
        })

        router.push({
            pathname: '/shop',
            query
        }, undefined, { shallow: true })
    }, [router])

    // Fonction pour charger les produits
    const loadProducts = useCallback(async (newFilters) => {
        setLoading(true)
        try {
            const searchParams = new URLSearchParams()
            Object.keys(newFilters).forEach(key => {
                if (newFilters[key] && newFilters[key] !== '' && newFilters[key] !== false) {
                    searchParams.append(key, newFilters[key].toString())
                }
            })

            const response = await fetch(`/api/products/search?${searchParams.toString()}`)
            const data = await response.json()

            if (data.success) {
                setProducts(data.products)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Gérer les changements de filtres
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 }
        setFilters(newFilters)
        updateURL(newFilters)
        loadProducts(newFilters)
    }

    // Gérer le changement de page
    const handlePageChange = (page) => {
        const newFilters = { ...filters, page }
        setFilters(newFilters)
        updateURL(newFilters)
        loadProducts(newFilters)
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Réinitialiser les filtres
    const resetFilters = () => {
        const newFilters = {
            category: '',
            essence: '',
            priceRange: '',
            inStock: false,
            search: '',
            sort: 'name-asc',
            page: 1
        }
        setFilters(newFilters)
        updateURL(newFilters)
        loadProducts(newFilters)
    }

    const breadcrumbItems = [
        { label: 'Accueil', href: '/' },
        { label: 'Boutique', href: '/shop' }
    ]

    if (filters.category) {
        const category = categories?.find(c => c.slug === filters.category)
        if (category) {
            breadcrumbItems.push({ label: category.name })
        }
    }

    return (
        <>
            <Head>
                <title>Boutique - Tous nos Produits | BoisChauffage Pro</title>
                <meta name="description" content="Découvrez tous nos produits de bois de chauffage premium : chêne, hêtre, charme, granulés. Filtres avancés, livraison rapide." />
                <meta name="keywords" content="boutique, bois chauffage, chêne, hêtre, charme, granulés, acheter" />
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
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="mb-6 lg:mb-0">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        Notre Boutique
                                    </h1>
                                    <p className="text-lg text-gray-600">
                                        {totalProducts} produits disponibles
                                    </p>
                                </div>

                                {/* Barre de recherche */}
                                <div className="flex-1 max-w-md lg:ml-8">
                                    <ProductSearch
                                        value={filters.search}
                                        onChange={(value) => handleFilterChange('search', value)}
                                        placeholder="Rechercher un produit..."
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sidebar Filtres - Desktop */}
                            <div className="hidden lg:block w-80 flex-shrink-0">
                                <div className="sticky top-24">
                                    <ProductFilters
                                        filters={filters}
                                        categories={categories}
                                        onChange={handleFilterChange}
                                        onReset={resetFilters}
                                    />
                                </div>
                            </div>

                            {/* Contenu principal */}
                            <div className="flex-1">
                                {/* Barre d'outils */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        {/* Bouton filtres mobile */}
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => setShowFilters(!showFilters)}
                                                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <SlidersHorizontal className="w-4 h-4" />
                                                <span>Filtres</span>
                                            </button>

                                            <div className="text-sm text-gray-600">
                                                {products.length} résultat{products.length > 1 ? 's' : ''}
                                            </div>
                                        </div>

                                        {/* Contrôles de vue et tri */}
                                        <div className="flex items-center space-x-4">
                                            {/* Mode d'affichage */}
                                            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => setViewMode('grid')}
                                                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                                            ? 'bg-white text-gray-900 shadow-sm'
                                                            : 'text-gray-600 hover:text-gray-900'
                                                        }`}
                                                >
                                                    <Grid3X3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setViewMode('list')}
                                                    className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                                            ? 'bg-white text-gray-900 shadow-sm'
                                                            : 'text-gray-600 hover:text-gray-900'
                                                        }`}
                                                >
                                                    <List className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Tri */}
                                            <ProductSort
                                                value={filters.sort}
                                                onChange={(value) => handleFilterChange('sort', value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Filtres mobile */}
                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="lg:hidden mb-6"
                                        >
                                            <ProductFilters
                                                filters={filters}
                                                categories={categories}
                                                onChange={handleFilterChange}
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
                                                title="Aucun produit trouvé"
                                                description="Essayez de modifier vos filtres ou votre recherche"
                                                actionLabel="Réinitialiser les filtres"
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
                                            <div className={`grid gap-6 ${viewMode === 'grid'
                                                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                                                    : 'grid-cols-1'
                                                }`}>
                                                {products.map((product, index) => (
                                                    <motion.div
                                                        key={product._id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <ProductCard
                                                            product={product}
                                                            viewMode={viewMode}
                                                        />
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

export async function getServerSideProps({ query }) {
    try {
        // Construire les paramètres de recherche
        const searchParams = new URLSearchParams()
        Object.keys(query).forEach(key => {
            if (query[key] && query[key] !== '' && query[key] !== 'false') {
                searchParams.append(key, query[key].toString())
            }
        })

        // Récupérer les produits et catégories
        const [productsRes, categoriesRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/search?${searchParams.toString()}`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories`)
        ])

        const [productsData, categoriesData] = await Promise.all([
            productsRes.ok ? productsRes.json() : { products: [], total: 0, totalPages: 0 },
            categoriesRes.ok ? categoriesRes.json() : { data: [] }
        ])

        return {
            props: {
                initialProducts: productsData.products || [],
                categories: categoriesData.data || [],
                totalProducts: productsData.total || 0,
                totalPages: productsData.totalPages || 0
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la boutique:', error)

        return {
            props: {
                initialProducts: [],
                categories: [],
                totalProducts: 0,
                totalPages: 0
            }
        }
    }
}