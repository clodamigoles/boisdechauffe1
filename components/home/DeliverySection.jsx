import { motion } from 'framer-motion'
import Link from 'next/link'

import { useT } from '@/lib/i18n'

export default function DeliverySection() {
    const t = useT()

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Texte */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                            {t('home.deliveryTitle')}
                        </h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            {t('home.deliveryLead')}
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {t('home.deliveryLead2')}
                        </p>

                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {t('home.deliveryConditionsTitle')}
                        </h3>
                        <ul className="space-y-2 text-gray-600 mb-8">
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                {t('home.deliveryPoint1')}
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                {t('home.deliveryPoint2')}
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                {t('home.deliveryPoint3')}
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                {t('home.deliveryPoint4')}
                            </li>
                        </ul>

                        <Link href="/livraison">
                            <button className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors duration-200">
                                {t('home.deliveryCta')}
                            </button>
                        </Link>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="relative rounded-2xl overflow-hidden shadow-lg aspect-square lg:aspect-auto lg:h-[480px]"
                    >
                        <img
                            src="/images/transport-brazeco-600x600.jpg"
                            alt={t('home.deliveryImageAlt')}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
