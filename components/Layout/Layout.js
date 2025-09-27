import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useCartStore, { useCartStats } from '@/lib/store/cartStore'
import CartSidebar from './CartSidebar'
import toast, { Toaster } from 'react-hot-toast'

// Icons (vous pouvez remplacer par react-icons ou heroicons)
const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
)

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
)

const CartIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L6 5H5m0 0L3 3m4 10v6a1 1 0 001 1h9a1 1 0 001-1v-6M7 13l-4-8" />
    </svg>
)

const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
)

const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
)

export default function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const router = useRouter()
    const { itemsCount } = useCartStats()
    const openCart = useCartStore(state => state.openCart)

    // Navigation items
    const navigation = [
        { name: 'Accueil', href: '/' },
        { name: 'Produits', href: '/produits' },
        { name: 'Catégories', href: '/categories' },
        { name: 'À propos', href: '/a-propos' },
        { name: 'Contact', href: '/contact' },
    ]

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false)
    }, [router.pathname])

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1f2937',
                        color: '#fff',
                    },
                }}
            />

            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-lg'
                        : 'bg-white'
                    }`}
            >
                {/* Top bar */}
                <div className="bg-gray-800 text-white py-2">
                    <div className="container-custom">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <PhoneIcon />
                                    <span>01 23 45 67 89</span>
                                </div>
                                <div className="hidden sm:flex items-center space-x-2">
                                    <EmailIcon />
                                    <span>contact@boischauffagepro.fr</span>
                                </div>
                            </div>
                            <div className="text-primary-400">
                                🚚 Livraison gratuite dès 500€
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main navigation */}
                <div className="container-custom">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="text-2xl font-heading text-primary-500"
                            >
                                🪵 BoisChauffage Pro
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`font-medium transition-colors duration-200 hover:text-primary-500 ${router.pathname === item.href
                                            ? 'text-primary-500'
                                            : 'text-gray-700'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Cart & Mobile Menu */}
                        <div className="flex items-center space-x-4">
                            {/* Cart Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openCart}
                                className="relative p-2 text-gray-700 hover:text-primary-500 transition-colors"
                            >
                                <CartIcon />
                                {itemsCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
                                    >
                                        {itemsCount}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 text-gray-700 hover:text-primary-500 transition-colors"
                            >
                                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t"
                        >
                            <div className="container-custom py-4">
                                <nav className="flex flex-col space-y-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`font-medium transition-colors duration-200 hover:text-primary-500 ${router.pathname === item.href
                                                    ? 'text-primary-500'
                                                    : 'text-gray-700'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Main Content */}
            <main className="pt-24">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white mt-20">
                <div className="container-custom py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="text-2xl font-heading text-primary-400 mb-4">
                                🪵 BoisChauffage Pro
                            </div>
                            <p className="text-gray-300 mb-4">
                                Votre spécialiste du bois de chauffage premium.
                                Qualité garantie, livraison rapide.
                            </p>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div>📍 123 Route Forestière, 45000 Orléans</div>
                                <div>📞 01 23 45 67 89</div>
                                <div>✉️ contact@boischauffagepro.fr</div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-heading text-lg mb-4">Liens rapides</h3>
                            <ul className="space-y-2 text-gray-300">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="hover:text-primary-400 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="font-heading text-lg mb-4">Services</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>🚚 Livraison rapide</li>
                                <li>📦 Conditionnement soigné</li>
                                <li>🏆 Qualité premium</li>
                                <li>💳 Paiement sécurisé</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy 2024 BoisChauffage Pro. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>

            {/* Cart Sidebar */}
            <CartSidebar />
        </div>
    )
}