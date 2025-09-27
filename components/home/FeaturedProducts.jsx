'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, ArrowRight } from 'lucide-react'

import { SITE_CONFIG } from '@/constants/config'

export default function FeaturedProducts({ onAddToCart }) {
    const [hoveredProduct, setHoveredProduct] = useState(null)

    const handleAddToCart = (product) => {
        // TODO: Intégrer avec le state management du panier
        if (onAddToCart) {
            onAddToCart(product)
        }
        console.log('Ajouter au panier:', product)
    }

    const getBadgeColor = (badge) => {
        switch (badge) {
            case 'Populaire':
                return 'bg-red-500'
            case 'Nouveau':
                return 'bg-green-500'
            case 'Économique':
                return 'bg-blue-500'
            default:
                return 'bg-gray-500'
        }
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Nos bois les plus demandés
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Sélection premium de nos essences les plus appréciées,
                        sèches et prêtes à brûler pour un maximum de chaleur.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {SITE_CONFIG.featuredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            {/* Badge */}
                            {product.badge && (
                                <div className={`absolute top-4 left-4 z-10 ${getBadgeColor(product.badge)} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                                    {product.badge}
                                </div>
                            )}

                            {/* Image */}
                            <div className="relative h-64 overflow-hidden rounded-t-2xl">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Overlay avec actions */}
                                <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-4 transition-opacity duration-300 ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                    </button>
                                    <Link
                                        href={`/produits/${product.id}`}
                                        className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Contenu */}
                            <div className="p-6">
                                <div className="mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {product.essence}
                                    </p>
                                </div>

                                {/* Prix */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-2xl font-bold text-amber-600">
                                            {product.price}€
                                        </span>
                                        <span className="text-gray-500 ml-1">
                                            /{product.unit}
                                        </span>
                                    </div>
                                </div>

                                {/* Bouton d'action */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full bg-gray-900 hover:bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span>Ajouter au panier</span>
                                </button>

                                {/* Informations supplémentaires */}
                                <div className="mt-4 flex justify-between text-xs text-gray-500">
                                    <span>Humidité &lt 20%</span>
                                    <span>Livraison 24-48h</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA vers tous les produits */}
                <div className="text-center mt-12">
                    <Link
                        href="/produits"
                        className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <span>Voir tous nos produits</span>
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}