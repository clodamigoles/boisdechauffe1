import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Layout from '@/components/Layout/Layout'
import ProductCard from '@/components/Product/ProductCard'
import { connectToDatabase, Product, Category } from '@/lib/models'

const FilterIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v6.586a1 1 0 01-1.447.894l-4-2A1 1 0 018 18.586v-4.586a1 1 0 00-.293-.707L1.293 7.293A1 1 0 011 6.586V4z" />
    </svg>
)

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)

const GridIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
)

const ListIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
)

export default function ProductsPage({ products: initialProducts, categories }) {
    const [products, setProducts] = useState(initialProducts)
    const [filteredProducts, setFilteredProducts] = useState(initialProducts)
    const [isLoading, setIsLoading] = useState(false)
    const [viewMode, setViewMode] = useState('grid') // 'grid' ou 'list'
    const [showFilters, setShowFilters] = useState(false)

    // États des filtres
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        essence: 'all',
        priceRange: 'all',
        badges: [],
        sortBy: 'name'
    })

    // Appliquer les filtres
    useEffect(() => {
        let filtered = [...products]

        // Recherche textuelle
        if (filters.search) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                product.essence.toLowerCase().includes(filters.search.toLowerCase()) ||
                product.description.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        // Filtre par catégorie
        if (filters.category !== 'all') {
            filtered = filtered.filter(product =>
                product.categoryId?.slug === filters.category
            )
        }

        // Filtre par essence
        if (filters.essence !== 'all') {
            filtered = filtered.filter(product => product.essence === filters.essence)
        }

        // Filtre par prix
        if (filters.priceRange !== 'all') {
            const [min, max] = filters.priceRange.split('-').map(Number)
            filtered = filtered.filter(product => {
                if (max) {
                    return product.price >= min && product.price <= max
                } else {
                    return product.price >= min
                }
            })
        }

        // Filtre par badges
        if (filters.badges.length > 0) {
            filtered = filtered.filter(product =>
                filters.badges.some(badge => product.badges?.includes(badge))
            )
        }

        // Tri
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'price-asc':
                    return a.price - b.price
                case 'price-desc':
                    return b.price - a.price
                case 'rating':
                    return (b.averageRating || 0) - (a.averageRating || 0)
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt)
                default:
                    return a.name.localeCompare(b.name)
            }
        })

        setFilteredProducts(filtered)
    }, [products, filters])

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleBadgeToggle = (badge) => {
        setFilters(prev => ({
            ...prev,
            badges: prev.badges.includes(badge)
                ? prev.badges.filter(b => b !== badge)
                : [...prev.badges, badge]
        }))
    }

    const clearFilters = () => {
        setFilters({
            search: '',
            category: 'all',
            essence: 'all',
            priceRange: 'all',
            badges: [],
            sortBy: 'name'
        })
    }

    // Extraire les essences uniques
    const essences = [...new Set(products.map(p => p.essence))]

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary-500 to-wood-600 text-white py-16">
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-heading mb-4">
                                Nos Produits
                            </h1>
                            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                                Découvrez notre sélection de bois de chauffage premium,
                                séché et certifié pour votre confort
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="container-custom py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Filtres */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}
                        >
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-heading text-gray-800">Filtres</h3>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Effacer tout
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Recherche */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Recherche
                                        </label>
                                        <div className="relative">
                                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Rechercher un produit..."
                                                value={filters.search}
                                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Catégorie */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Catégorie
                                        </label>
                                        <select
                                            value={filters.category}
                                            onChange={(e) => handleFilterChange('category', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="all">Toutes les catégories</option>
                                            {categories.map(category => (
                                                <option key={category._id} value={category.slug}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Essence */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Essence
                                        </label>
                                        <select
                                            value={filters.essence}
                                            onChange={(e) => handleFilterChange('essence', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="all">Toutes les essences</option>
                                            {essences.map(essence => (
                                                <option key={essence} value={essence}>
                                                    {essence.charAt(0).toUpperCase() + essence.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Gamme de prix */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Prix
                                        </label>
                                        <select
                                            value={filters.priceRange}
                                            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="all">Tous les prix</option>
                                            <option value="0-50">Moins de 50€</option>
                                            <option value="50-80">50€ - 80€</option>
                                            <option value="80-100">80€ - 100€</option>
                                            <option value="100">Plus de 100€</option>
                                        </select>
                                    </div>

                                    {/* Badges */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Labels
                                        </label>
                                        <div className="space-y-2">
                                            {['premium', 'populaire', 'nouveau', 'économique', 'local'].map(badge => (
                                                <label key={badge} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.badges.includes(badge)}
                                                        onChange={() => handleBadgeToggle(badge)}
                                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700 capitalize">
                                                        {badge}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contenu principal */}
                        <div className="lg:col-span-3">
                            {/* Header avec tri et vue */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <FilterIcon />
                                            Filtres
                                        </button>

                                        <p className="text-gray-600">
                                            <span className="font-semibold text-primary-600">
                                                {filteredProducts.length}
                                            </span> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Tri */}
                                        <select
                                            value={filters.sortBy}
                                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="name">Nom A-Z</option>
                                            <option value="price-asc">Prix croissant</option>
                                            <option value="price-desc">Prix décroissant</option>
                                            <option value="rating">Mieux notés</option>
                                            <option value="newest">Plus récents</option>
                                        </select>

                                        {/* Mode d'affichage */}
                                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                                        ? 'bg-white text-primary-600 shadow-sm'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <GridIcon />
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                                        ? 'bg-white text-primary-600 shadow-sm'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <ListIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Grille de produits */}
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                    >
                                        {[...Array(6)].map((_, index) => (
                                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                                <div className="h-48 bg-gray-200 skeleton"></div>
                                                <div className="p-6 space-y-3">
                                                    <div className="h-4 bg-gray-200 skeleton rounded"></div>
                                                    <div className="h-4 bg-gray-200 skeleton rounded w-3/4"></div>
                                                    <div className="h-6 bg-gray-200 skeleton rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : filteredProducts.length > 0 ? (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={viewMode === 'grid'
                                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                            : 'space-y-6'
                                        }
                                    >
                                        {filteredProducts.map((product) => (
                                            <motion.div
                                                key={product._id}
                                                variants={itemVariants}
                                                layout
                                            >
                                                <ProductCard
                                                    product={product}
                                                    className={viewMode === 'list' ? 'flex-row' : ''}
                                                />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-16"
                                    >
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h3 className="text-xl font-heading text-gray-800 mb-2">
                                            Aucun produit trouvé
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Essayez de modifier vos critères de recherche
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
                                        >
                                            Voir tous les produits
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    try {
        await connectToDatabase()

        // Récupérer tous les produits avec leurs catégories
        const products = await Product
            .find({ isActive: true })
            .populate('categoryId', 'name slug')
            .sort({ createdAt: -1 })
            .lean()

        // Récupérer toutes les catégories
        const categories = await Category
            .find({ isActive: true })
            .sort({ order: 1 })
            .lean()

        return {
            props: {
                products: JSON.parse(JSON.stringify(products)),
                categories: JSON.parse(JSON.stringify(categories))
            },
            revalidate: 3600 // Revalidate every hour
        }
    } catch (error) {
        console.error('Error in getStaticProps:', error)
        return {
            props: {
                products: [],
                categories: []
            }
        }
    }
}