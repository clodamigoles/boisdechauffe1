import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Filter, Star, TrendingUp, Award, Sparkles, Eye } from 'lucide-react'
import ProductCard from '../ui/ProductCard'
import Button from '../ui/Button'
import { containerVariants, itemVariants } from '../../utils/animations'

export default function ProductsSection({ products = [] }) {
    const [activeFilter, setActiveFilter] = useState('all')

    const defaultProducts = [
        {
            _id: '1',
            name: 'Chêne Premium Séché',
            slug: 'chene-premium-seche',
            shortDescription: 'Bois de chêne séché < 18% d\'humidité',
            essence: 'chêne',
            price: 95,
            compareAtPrice: 110,
            unit: 'stère',
            images: [{ url: '/images/products/chene-premium.jpg', alt: 'Chêne Premium', isPrimary: true }],
            badges: ['premium', 'bestseller'],
            humidity: 16,
            calorificValue: 4.2,
            averageRating: 4.8,
            reviewCount: 156,
            specifications: [
                { name: 'Humidité', value: '< 18', unit: '%' },
                { name: 'Pouvoir calorifique', value: '4.2', unit: 'kWh/kg' },
                { name: 'Densité', value: '650', unit: 'kg/m³' }
            ]
        },
        {
            _id: '2',
            name: 'Hêtre Traditionnel',
            slug: 'hetre-traditionnel',
            shortDescription: 'Bois de hêtre pour chauffage continu',
            essence: 'hêtre',
            price: 89,
            unit: 'stère',
            images: [{ url: '/images/products/hetre-traditionnel.jpg', alt: 'Hêtre Traditionnel', isPrimary: true }],
            badges: ['populaire'],
            humidity: 17,
            calorificValue: 4.0,
            averageRating: 4.6,
            reviewCount: 89,
            specifications: [
                { name: 'Humidité', value: '< 20', unit: '%' },
                { name: 'Pouvoir calorifique', value: '4.0', unit: 'kWh/kg' }
            ]
        },
        {
            _id: '3',
            name: 'Charme Excellence',
            slug: 'charme-excellence',
            shortDescription: 'Bois de charme haute qualité',
            essence: 'charme',
            price: 92,
            unit: 'stère',
            images: [{ url: '/images/products/charme-excellence.jpg', alt: 'Charme Excellence', isPrimary: true }],
            badges: ['premium'],
            humidity: 15,
            calorificValue: 4.1,
            averageRating: 4.7,
            reviewCount: 67,
            specifications: [
                { name: 'Humidité', value: '< 18', unit: '%' },
                { name: 'Pouvoir calorifique', value: '4.1', unit: 'kWh/kg' }
            ]
        },
        {
            _id: '4',
            name: 'Mix Feuillus Premium',
            slug: 'mix-feuillus-premium',
            shortDescription: 'Mélange chêne, hêtre, charme',
            essence: 'mix',
            price: 88,
            unit: 'stère',
            images: [{ url: '/images/products/mix-feuillus.jpg', alt: 'Mix Feuillus', isPrimary: true }],
            badges: ['bestseller'],
            humidity: 18,
            calorificValue: 4.0,
            averageRating: 4.5,
            reviewCount: 134,
            specifications: [
                { name: 'Humidité', value: '< 20', unit: '%' },
                { name: 'Pouvoir calorifique', value: '4.0', unit: 'kWh/kg' }
            ]
        },
        {
            _id: '5',
            name: 'Granulés Haute Performance',
            slug: 'granules-haute-performance',
            shortDescription: 'Pellets 100% résineux premium',
            essence: 'granulés',
            price: 320,
            unit: 'tonne',
            images: [{ url: '/images/products/granules-premium.jpg', alt: 'Granulés Premium', isPrimary: true }],
            badges: ['nouveau', 'premium'],
            humidity: 8,
            calorificValue: 4.8,
            averageRating: 4.9,
            reviewCount: 78,
            specifications: [
                { name: 'Humidité', value: '< 10', unit: '%' },
                { name: 'Pouvoir calorifique', value: '4.8', unit: 'kWh/kg' }
            ]
        },
        {
            _id: '6',
            name: 'Bûches Compressées',
            slug: 'buches-compressees',
            shortDescription: 'Bûches densifiées longue durée',
            essence: 'compressé',
            price: 450,
            unit: 'tonne',
            images: [{ url: '/images/products/buches-compressees.jpg', alt: 'Bûches Compressées', isPrimary: true }],
            badges: ['innovation'],
            humidity: 10,
            calorificValue: 4.5,
            averageRating: 4.4,
            reviewCount: 45,
            specifications: [
                { name: 'Humidité', value: '< 12', unit: '%' },
                { name: 'Pouvoir calorifique', value: '4.5', unit: 'kWh/kg' }
            ]
        },
        {
            _id: '7',
            name: 'Allume-Feu Écologique',
            slug: 'allume-feu-ecologique',
            shortDescription: 'Allume-feu naturel en fibres de bois',
            essence: 'allume-feu',
            price: 12,
            unit: 'pack de 50',
            images: [{ url: '/images/products/allume-feu.jpg', alt: 'Allume-feu Écologique', isPrimary: true }],
            badges: ['écologique'],
            averageRating: 4.3,
            reviewCount: 234,
            specifications: [
                { name: 'Quantité', value: '50', unit: 'pièces' },
                { name: 'Durée', value: '8-10', unit: 'min' }
            ]
        },
        {
            _id: '8',
            name: 'Pack Découverte',
            slug: 'pack-decouverte',
            shortDescription: 'Assortiment de nos meilleures essences',
            essence: 'pack',
            price: 165,
            compareAtPrice: 185,
            unit: '2 stères',
            images: [{ url: '/images/products/pack-decouverte.jpg', alt: 'Pack Découverte', isPrimary: true }],
            badges: ['offre', 'bestseller'],
            averageRating: 4.8,
            reviewCount: 98,
            specifications: [
                { name: 'Contenu', value: '2', unit: 'stères' },
                { name: 'Essences', value: '3', unit: 'types' }
            ]
        }
    ]

    const displayProducts = products.length > 0 ? products : defaultProducts

    const filters = [
        { id: 'all', label: 'Tous les produits', icon: Filter },
        { id: 'premium', label: 'Premium', icon: Award },
        { id: 'bestseller', label: 'Meilleures ventes', icon: TrendingUp },
        { id: 'nouveau', label: 'Nouveautés', icon: Sparkles }
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
                        Nos Produits Populaires
                    </motion.div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                        Sélection Premium
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                        Découvrez notre gamme de bois de chauffage soigneusement sélectionnée.
                        Chaque produit est contrôlé pour garantir une qualité exceptionnelle.
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
                    <Link href="/produits">
                        <Button
                            variant="primary"
                            size="lg"
                            className="flex items-center space-x-2"
                        >
                            <Eye className="w-5 h-5" />
                            <span>Voir Tous Nos Produits</span>
                        </Button>
                    </Link>

                    <p className="text-gray-600 mt-4">
                        Plus de 50 références disponibles • Livraison 24-48h
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
                            Pourquoi Choisir BoisChauffage Pro ?
                        </h3>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            15 années d'expertise au service de votre confort
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Award,
                                title: 'Qualité Garantie',
                                description: 'Bois séché < 18% d\'humidité, contrôlé et certifié'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Livraison Express',
                                description: 'Livraison 24-48h partout en France, équipe dédiée'
                            },
                            {
                                icon: Star,
                                title: 'Prix Transparents',
                                description: 'Tarifs clairs, sans surprise, devis gratuit'
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