import { motion } from 'framer-motion'
import Link from 'next/link'
import { TreePine, Flame, Package, Zap, ArrowRight, TrendingUp } from 'lucide-react'
import CategoryCard from '../ui/CategoryCard'
import { containerVariants, itemVariants } from '../../utils/animations'

export default function CategoriesSection({ categories = [] }) {
    const iconMap = {
        'bois-feuillus-premium': TreePine,
        'bois-resineux-sec': TreePine,
        'granules-premium': Package,
        'allume-feu-naturel': Flame
    }

    const defaultCategories = [
        {
            _id: '1',
            name: 'Bois Feuillus Premium',
            slug: 'bois-feuillus-premium',
            shortDescription: 'Chêne, hêtre, charme - Excellence garantie',
            image: '/images/categories/feuillus.jpg',
            productCount: 24,
            trending: true
        },
        {
            _id: '2',
            name: 'Bois Résineux Sec',
            slug: 'bois-resineux-sec',
            shortDescription: 'Pin, épicéa, sapin - Allumage facile',
            image: '/images/categories/resineux.jpg',
            productCount: 18,
            trending: false
        },
        {
            _id: '3',
            name: 'Granulés Premium',
            slug: 'granules-premium',
            shortDescription: 'Pellets haute performance - Rendement optimal',
            image: '/images/categories/granules.jpg',
            productCount: 12,
            trending: true
        },
        {
            _id: '4',
            name: 'Allume-Feu Naturel',
            slug: 'allume-feu-naturel',
            shortDescription: 'Écologique et efficace - Démarrage garanti',
            image: '/images/categories/allume-feu.jpg',
            productCount: 8,
            trending: false
        }
    ]

    const displayCategories = categories.length > 0 ? categories : defaultCategories

    return (
        <section className="py-20 bg-gray-50">
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
                        <Package className="w-4 h-4 mr-2" />
                        Nos Catégories
                    </motion.div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                        Trouvez le Bois Parfait
                        <span className="block text-amber-600">
                            pour Vos Besoins
                        </span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Une sélection rigoureuse de bois de chauffage premium, classée par essence et usage.
                        Chaque catégorie répond à des besoins spécifiques.
                    </p>
                </motion.div>

                {/* Grille des Catégories */}
                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                >
                    {displayCategories.slice(0, 4).map((category, index) => {
                        const IconComponent = iconMap[category.slug] || TreePine
                        return (
                            <motion.div
                                key={category._id}
                                variants={itemVariants}
                                custom={index}
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CategoryCard
                                    category={{
                                        ...category,
                                        icon: IconComponent
                                    }}
                                />
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Statistiques */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    {[
                        { icon: Zap, value: '< 18%', label: 'Taux d\'humidité' },
                        { icon: Package, value: '50+', label: 'Références produits' },
                        { icon: TrendingUp, value: '24-48h', label: 'Délai livraison' },
                        { icon: TrendingUp, value: '4.9/5', label: 'Note clients' }
                    ].map((stat, index) => {
                        const IconComponent = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                            >
                                <div className="flex justify-center mb-3">
                                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <IconComponent className="w-6 h-6 text-amber-600" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-center"
                >
                    <div className="bg-amber-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                                Besoin d'aide pour choisir ?
                            </h3>
                            <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
                                Nos experts vous conseillent gratuitement pour trouver le bois de chauffage
                                adapté à vos besoins et votre région.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <span>Conseil Gratuit</span>
                                    </motion.button>
                                </Link>

                                <Link href="/categories">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-amber-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-800 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <span>Voir Toutes les Catégories</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}