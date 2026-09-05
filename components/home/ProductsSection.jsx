import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, TrendingUp, Award, Eye } from 'lucide-react'

import ProductCard from '../ui/ProductCard'
import Button from '../ui/ActionButton'
import { containerVariants, itemVariants } from '@/utils/animations'
import { useSettings } from '@/hooks/useSettings'
import { useT } from '@/lib/i18n'

export default function ProductsSection({ products = [] }) {
    const t = useT()
    const { siteName } = useSettings()

    // Huit produits inventés vivaient ici en repli — noms, prix, et jusqu'à
    // « 4,8 sur 156 avis » —, avec des images vers un dossier inexistant.
    // Le catalogue réel est en base ; quand il ne répond pas, la section ne
    // montre rien plutôt que des produits qu'on ne vend pas.

    const displayProducts = products.length > 0 ? products : []

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
                        {t('home.featuredBadge')}
                    </motion.div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        {t('home.featuredTitle')}
                    </h2>
                </motion.div>

                {/* Grille des Produits */}
                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                >
                    {displayProducts.slice(0, 8).map((product, index) => (
                        <motion.div
                            key={product._id}
                            variants={itemVariants}
                            custom={index}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>

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
                            <span>{t('home.featuredSeeAll')}</span>
                        </Button>
                    </Link>

                    <p className="text-gray-600 mt-4">
                        {t('home.featuredIntro')}
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
                            Pourquoi Choisir {siteName} ?
                        </h3>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            8 années d'expertise au service de votre confort
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Award,
                                title: t('home.trustDry'),
                                description: t('home.trustDryText')
                            },
                            {
                                icon: TrendingUp,
                                title: t('home.trustDelivery'),
                                description: t('home.trustDeliveryText')
                            },
                            {
                                icon: Star,
                                title: t('home.trustService'),
                                description: t('home.trustServiceText')
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