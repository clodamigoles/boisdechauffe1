"use client"

import { motion } from "framer-motion"
import { Droplets, Flame, Zap, TreePine, Ruler, Weight } from "lucide-react"

export default function ProductDetailSpecs({ product }) {
    const getSpecIcon = (specName) => {
        const icons = {
            Humidité: Droplets,
            "Pouvoir calorifique": Flame,
            Densité: Zap,
            Essence: TreePine,
            Dimensions: Ruler,
            Poids: Weight,
        }
        return icons[specName] || Zap
    }

    if (!product.specifications || product.specifications.length === 0) {
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Spécifications techniques</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.specifications.map((spec, index) => {
                    const SpecIcon = getSpecIcon(spec.name)
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <SpecIcon className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">{spec.name}</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {spec.value} {spec.unit}
                                </p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Avantages écologiques</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                        <li>• Énergie renouvelable et locale</li>
                        <li>• Bilan carbone neutre</li>
                        <li>• Séchage naturel au soleil</li>
                        <li>• Certification PEFC</li>
                    </ul>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-900 mb-2">Conseils d'utilisation</h3>
                    <ul className="text-sm text-amber-800 space-y-1">
                        <li>• Stocker dans un endroit sec</li>
                        <li>• Utiliser des bûches de 25-30cm</li>
                        <li>• Allumage par le haut recommandé</li>
                        <li>• Rendement optimal à 20% d'humidité</li>
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}