'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'

import { SITE_CONFIG } from '@/constants/config'

export default function Header({ cartItemsCount = 0 }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        // TODO: Implémenter la recherche
        console.log('Recherche:', searchQuery)
    }

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">🪵</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-gray-900">{SITE_CONFIG.name}</h1>
                        </div>
                    </Link>

                    {/* Navigation Desktop */}
                    <nav className="hidden md:flex space-x-8">
                        {SITE_CONFIG.navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Barre de recherche */}
                    <div className="hidden lg:block flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Rechercher des produits..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </form>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Compte utilisateur */}
                        <Link
                            href="/compte"
                            className="p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
                        >
                            <User className="h-6 w-6" />
                        </Link>

                        {/* Panier */}
                        <Link
                            href="/panier"
                            className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {/* Menu mobile */}
                        <button
                            className="md:hidden p-2 text-gray-700"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Menu mobile */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {SITE_CONFIG.navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Barre de recherche mobile */}
                            <div className="px-3 py-2">
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}