"use client"

import { motion } from "framer-motion"
import ProductCard from "../ui/ProductCard"

export default function SimilarProducts({ products }) {
    if (!products || products.length === 0) {
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}