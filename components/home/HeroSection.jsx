import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { SITE_CONFIG } from '@/constants/config'

export default function HeroSection() {
    const { hero } = SITE_CONFIG

    return (
        <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${hero.backgroundImage})`
                }}
            />

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            {hero.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
                            {hero.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/produits"
                                className="group bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <span>{hero.ctaText}</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>

                            <Link
                                href="/contact"
                                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                            >
                                Nous contacter
                            </Link>
                        </div>

                        {/* Stats ou features rapides */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">&lt; 20%</div>
                                <div className="text-gray-300">Humidité</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">24-48h</div>
                                <div className="text-gray-300">Livraison</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">100%</div>
                                <div className="text-gray-300">Français</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}