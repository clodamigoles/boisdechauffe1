import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Filter, Star, TrendingUp, Award, Sparkles, Eye } from 'lucide-react'

import ProductCard from '../ui/ProductCard'
import Button from '../ui/Button'
import { containerVariants, itemVariants } from '@/utils/animations'
import { useSettings } from '@/hooks/useSettings'
import { useTranslation } from '@/lib/useTranslation'

export default function ProductsSection({ products = [] }) {
    const { siteName } = useSettings()
    const { t } = useTranslation('home')
    const { t: tProd } = useTranslation('products')
    const [activeFilter, setActiveFilter] = useState('all')

    const defaultProducts = [
        {
            _id: '1',
            name: tProd('defaults.1.name'),
            slug: 'chene-premium-seche',
            shortDescription: tProd('defaults.1.shortDescription'),
            essence: 'chêne',
            price: 95,
            compareAtPrice: 110,
            unit: tProd('units.stere'),
            images: [{ url: '/images/products/chene-premium.jpg', alt: tProd('defaults.1.alt'), isPrimary: true }],
            badges: ['premium', 'bestseller'],
            humidity: 16,
            calorificValue: 4.2,
            averageRating: 4.8,
            reviewCount: 156,
            specifications: [
                { name: tProd('defaults.1.specs.humidity'), value: '< 18', unit: '%' },
                { name: tProd('defaults.1.specs.calorificValue'), value: '4.2', unit: 'kWh/kg' },
                { name: tProd('defaults.1.specs.density'), value: '650', unit: 'kg/m³' }
            ]
        },
        {
            _id: '2',
            name: tProd('defaults.2.name'),
            slug: 'hetre-traditionnel',
            shortDescription: tProd('defaults.2.shortDescription'),
            essence: 'hêtre',
            price: 89,
            unit: tProd('units.stere'),
            images: [{ url: '/images/products/hetre-traditionnel.jpg', alt: tProd('defaults.2.alt'), isPrimary: true }],
            badges: ['populaire'],
            humidity: 17,
            calorificValue: 4.0,
            averageRating: 4.6,
            reviewCount: 89,
            specifications: [
                { name: tProd('defaults.1.specs.humidity'), value: '< 20', unit: '%' },
                { name: tProd('defaults.1.specs.calorificValue'), value: '4.0', unit: 'kWh/kg' }
            ]
        },
        {
            _id: '3',
            name: tProd('defaults.3.name'),
            slug: 'charme-excellence',
            shortDescription: tProd('defaults.3.shortDescription'),
            essence: 'charme',
            price: 92,
            unit: tProd('units.stere'),
            images: [{ url: '/images/products/charme-excellence.jpg', alt: tProd('defaults.3.alt'), isPrimary: true }],
            badges: ['premium'],
            humidity: 15,
            calorificValue: 4.1,
            averageRating: 4.7,
            reviewCount: 67,
            specifications: [
                { name: tProd('defaults.1.specs.humidity'), value: '< 18', unit: '%' },
                { name: tProd('defaults.1.specs.calorificValue'), value: '4.1', unit: 'kWh/kg' }
            ]
        },
        {
            _id: '4',
            name: tProd('defaults.4.name'),
            slug: 'mix-feuillus-premium',
            shortDescription: tProd('defaults.4.shortDescription'),
            essence: 'mix',
            price: 88,
            unit: tProd('units.stere'),
            images: [{ url: '/images/products/mix-feuillus.jpg', alt: tProd('defaults.4.alt'), isPrimary: true }],
            badges: ['bestseller'],
            humidity: 18,
            calorificValue: 4.0,
            averageRating: 4.5,
            reviewCount: 134,
            specifications: [
                { name: tProd('defaults.1.specs.humidity'), value: '< 20', unit: '%' },
                { name: tProd('defaults.1.specs.calorificValue'), value: '4.0', unit: 'kWh/kg' }
            ]
        },
        {
            _id: '5',
            name: tProd('defaults.5.name'),
            slug: 'granules-haute-performance',
            shortDescription: tProd('defaults.5.shortDescription'),
            essence: 'granulés',
            price: 320,
            unit: tProd('units.tonne'),
            images: [{ url: '/images/products/granules-premium.jpg', alt: tProd('defaults.5.alt'), isPrimary: true }],
            badges: ['nouveau', 'premium'],
            humidity: 8,
            calorificValue: 4.8,
            averageRating: 4.9,
            reviewCount: 78,
            specifications: [
                { name: tProd('defaults.1.specs.humidity'), value: '< 10', unit: '%' },
                { name: tProd('defaults.1.specs.calorificValue'), value: '4.8', unit: 'kWh/kg' }
            ]
        },
        {
            _id: '6',
            name: tProd('defaults.6.name'),
            slug: 'buches-compressees',
            shortDescription: tProd('defaults.6.shortDescription'),
            essence: 'compressé',
            price: 450,
            unit: tProd('units.tonne'),
            images: [{ url: '/images/products/buches-compressees.jpg', alt: tProd('defaults.6.alt'), isPrimary: true }],
            badges: ['innovation'],
            humidity: 10,
            calorificValue: 4.5,
            averageRating: 4.4,
            reviewCount: 45,
            specifications: [
                { name: tProd('defaults.1.specs.humidity'), value: '< 12', unit: '%' },
                { name: tProd('defaults.1.specs.calorificValue'), value: '4.5', unit: 'kWh/kg' }
            ]
        },
        {
            _id: '7',
            name: tProd('defaults.7.name'),
            slug: 'allume-feu-ecologique',
            shortDescription: tProd('defaults.7.shortDescription'),
            essence: 'allume-feu',
            price: 12,
            unit: tProd('units.pack50'),
            images: [{ url: '/images/products/allume-feu.jpg', alt: tProd('defaults.7.alt'), isPrimary: true }],
            badges: ['écologique'],
            averageRating: 4.3,
            reviewCount: 234,
            specifications: [
                { name: tProd('defaults.1.specs.quantity'), value: '50', unit: tProd('units.pieces') },
                { name: tProd('defaults.1.specs.duration'), value: '8-10', unit: tProd('units.min') }
            ]
        },
        {
            _id: '8',
            name: tProd('defaults.8.name'),
            slug: 'pack-decouverte',
            shortDescription: tProd('defaults.8.shortDescription'),
            essence: 'pack',
            price: 165,
            compareAtPrice: 185,
            unit: tProd('units.2steres'),
            images: [{ url: '/images/products/pack-decouverte.jpg', alt: tProd('defaults.8.alt'), isPrimary: true }],
            badges: ['offre', 'bestseller'],
            averageRating: 4.8,
            reviewCount: 98,
            specifications: [
                { name: tProd('defaults.1.specs.content'), value: '2', unit: tProd('units.stere') },
                { name: tProd('defaults.1.specs.essences'), value: '3', unit: tProd('units.types') }
            ]
        }
    ]

    const displayProducts = products.length > 0 ? products : []

    const filters = [
        { id: 'all', label: t('products.filters.all'), icon: Filter },
        { id: 'premium', label: t('products.filters.premium'), icon: Award },
        { id: 'bestseller', label: t('products.filters.bestseller'), icon: TrendingUp },
        { id: 'nouveau', label: t('products.filters.new'), icon: Sparkles }
    ]

    const filteredProducts = activeFilter === 'all'
        ? displayProducts
        : displayProducts.filter(product =>
            product.badges && product.badges.includes(activeFilter)
        )

    return (
        <section className="py-20 bg-white">
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
                        className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-6"
                    >
                        <Star className="w-4 h-4 mr-2" />
                        {t('products.badge')}
                    </motion.div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                        {t('products.title')}
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                        {t('products.description')}
                    </p>

                    {/* Filtres */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-3"
                    >
                        {filters.map((filter) => {
                            const IconComponent = filter.icon
                            return (
                                <motion.button
                                    key={filter.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === filter.id
                                            ? 'bg-amber-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span>{filter.label}</span>
                                </motion.button>
                            )
                        })}
                    </motion.div>
                </motion.div>

                {/* Grille des Produits */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFilter}
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                    >
                        {filteredProducts.slice(0, 8).map((product, index) => (
                            <motion.div
                                key={product._id}
                                variants={itemVariants}
                                custom={index}
                                layout
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* CTA Voir Tous les Produits */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mb-16"
                >
                    <Link href="/shop">
                        <Button
                            variant="primary"
                            size="lg"
                            className="flex items-center space-x-2"
                        >
                            <Eye className="w-5 h-5" />
                            <span>{t('products.cta')}</span>
                        </Button>
                    </Link>

                    <p className="text-gray-600 mt-4">
                        {t('products.ctaDesc')}
                    </p>
                </motion.div>

                {/* Section Avantages */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="bg-gray-50 rounded-2xl p-8 md:p-12"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                            {t('products.advantages.title', { siteName })}
                        </h3>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t('products.advantages.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Award,
                                title: t('products.advantages.items.quality.title'),
                                description: t('products.advantages.items.quality.description')
                            },
                            {
                                icon: TrendingUp,
                                title: t('products.advantages.items.delivery.title'),
                                description: t('products.advantages.items.delivery.description')
                            },
                            {
                                icon: Star,
                                title: t('products.advantages.items.pricing.title'),
                                description: t('products.advantages.items.pricing.description')
                            }
                        ].map((advantage, index) => {
                            const IconComponent = advantage.icon
                            return (
                                <motion.div
                                    key={advantage.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1 + index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="text-center bg-white rounded-xl p-6 shadow-sm"
                                >
                                    <div className="flex justify-center mb-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <IconComponent className="w-6 h-6 text-amber-600" />
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                                        {advantage.title}
                                    </h4>
                                    <p className="text-gray-600">
                                        {advantage.description}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}