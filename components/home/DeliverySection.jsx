import { motion } from 'framer-motion'
import Link from 'next/link'

export default function DeliverySection() {
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
                            Bois de chauffage livré sur palette
                        </h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            La livraison de votre bois de chauffage sur palette est une solution pratique et rapide.
                            Une seule personne peut manutentionner et stocker facilement votre commande,
                            qu'il s'agisse de bois traditionnels ou de bûches densifiées emballées sous housse plastifiée.
                            Vous gagnez du temps, votre bois reste protégé et proprement stocké.
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Les bûches densifiées conditionnées en cartons facilitent l'empilage et le stockage.
                            Leur forme régulière et leur emballage hermétique les maintiennent à l'abri de l'humidité jusqu'à leur utilisation.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Conditions et délais de livraison
                        </h3>
                        <ul className="space-y-2 text-gray-600 mb-8">
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                Livraison dans toute la France métropolitaine, villes et villages compris.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                Camions équipés d'élévateurs ou de plateformes pour une dépose sans effort.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                Notre transporteur vous contacte sous 2 à 8 jours pour fixer le créneau de livraison.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                Pour un besoin urgent, contactez-nous avant de passer commande — prévoir au minimum une semaine.
                            </li>
                        </ul>

                        <Link href="/livraison">
                            <button className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors duration-200">
                                En savoir plus sur la livraison
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
                            alt="Livraison de bois de chauffage"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
