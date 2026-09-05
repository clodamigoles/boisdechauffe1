import { motion } from 'framer-motion'
import Link from 'next/link'
import { TreePine, Flame, Package, Zap, ArrowRight, TrendingUp, Star } from 'lucide-react'

import CategoryCard from '../ui/CategoryCard'
import { containerVariants, itemVariants } from '@/utils/animations'
import { useFormatter, useT } from '@/lib/i18n'

export default function CategoriesSection({ categories = [], productCount = 0, rating = 0 }) {
    const t = useT()
    const format = useFormatter()
    const iconMap = {
        'bois-feuillus-premium': TreePine,
        'bois-resineux-sec': TreePine,
        'granules-premium': Package,
        'allume-feu-naturel': Flame
    }

    // Quatre catégories inventées — « Bois Résineux Sec », « Allume-Feu
    // Naturel » — qui ne correspondent à aucune de celles en base.


    const displayCategories = categories.length > 0 ? categories : []

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
                        {t('home.categoriesBadge')}
                    </motion.div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                        {t('home.categoriesTitle')}
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {t('home.categoriesIntro')}
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
                    {/* Quatre chiffres étaient écrits en dur ici : « 50+ »
                        références pour un catalogue de dix-neuf produits,
                        « 24-48h » pour un délai de quatre à cinq jours, et une
                        note de « 4,9/5 » alors que la moyenne réelle est 4,0.
                        Ils viennent maintenant du catalogue et des avis, et la
                        tuile disparaît quand la donnée manque. */}
                    {[
                        { icon: Zap, value: t('home.heroStatMoistureValue'), label: t('home.heroStatMoisture') },
                        productCount
                            ? { icon: Package, value: String(productCount), label: t('home.statProducts') }
                            : null,
                        { icon: TrendingUp, value: t('home.heroStatLeadTimeValue'), label: t('home.heroStatLeadTime') },
                        rating
                            ? {
                                icon: Star,
                                value: t('home.statRatingValue', { average: format.number(Math.round(rating * 10) / 10) }),
                                label: t('home.statRating'),
                            }
                            : null,
                    ].filter(Boolean).map((stat, index) => {
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
                    <div className="rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
                        {/* Image de fond */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="/images/mbdc.jpg"
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gray-900/65" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                                {t('home.helpTitle')}
                            </h3>
                            <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
                                {t('home.helpText')}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <span>{t('home.helpCta')}</span>
                                    </motion.button>
                                </Link>

                                <Link href="/shop">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-amber-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-800 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <span>{t('home.categoriesBrowse')}</span>
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