'use client'

import { useState } from 'react'

import { SITE_CONFIG } from '@/constants/config'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import AdvantagesSection from '@/components/home/AdvantagesSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TestimonialsSection from '@/components/home/TestimonialsSection'

export default function HomePage() {
    const [cartItems, setCartItems] = useState([])

    const handleAddToCart = (product) => {
        // TODO: Implémenter la logique du panier (Redux, Zustand, ou Context)
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id)
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { ...product, quantity: 1 }]
        })

        // Toast notification
        console.log(`${product.name} ajouté au panier`)
    }

    const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header cartItemsCount={cartItemsCount} />

            {/* Main content */}
            <main>
                {/* Hero Section */}
                <HeroSection />

                {/* Advantages Section */}
                <AdvantagesSection />

                {/* Featured Products */}
                <FeaturedProducts onAddToCart={handleAddToCart} />

                {/* Testimonials */}
                <TestimonialsSection />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}