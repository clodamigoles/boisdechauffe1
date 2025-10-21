import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { Menu, X, Search, ShoppingCart, Phone, ChevronDown, ShoppingBag, ShoppingBagIcon } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import Button from '../ui/Button'
import { useSettings } from '@/hooks/useSettings'
import { useTranslation } from '@/lib/useTranslation'
import LanguageSwitcher from '../ui/LanguageSwitcher'

export default function Header() {
    const { siteName } = useSettings()
    const { t } = useTranslation('common')
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const router = useRouter()
    const cartItems = useCartStore(state => state.items)
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navigation = [
        { name: t('header.nav.home'), href: '/', current: router.pathname === '/' },
        {
            name: t('header.nav.catalog'),
            href: '/shop',
            current: router.pathname.startsWith('/shop'),
            submenu: [
                { name: t('header.submenu.firewood'), href: '/shop?category=bois-de-chauffage' },
                { name: t('header.submenu.pellets'), href: '/shop?category=granules-et-pellets' },
                { name: t('header.submenu.logs'), href: '/shop?category=buches-compressees' },
                { name: t('header.submenu.heating'), href: '/shop?category=chaudieres-cuisinieres-et-poeles' }
            ]
        },
        { name: t('header.nav.faq'), href: '/faq', current: router.pathname === '/faq' },
        // { name: t('header.nav.delivery'), href: '/livraison', current: router.pathname === '/livraison' },
        { name: t('header.nav.contact'), href: '/contact', current: router.pathname === '/contact' }
    ]

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100'
                        : 'bg-transparent'
                    }`}
            >
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 lg:h-20">
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-shrink-0"
                        >
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                                    <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
                                </div>
                                <div className="hidden sm:block">
                                    <span className={`text-lg font-bold ${!isScrolled && router.pathname === '/' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {siteName}
                                    </span>
                                    <p className={`text-sm ${!isScrolled && router.pathname === '/' ? 'text-white/80' : 'text-gray-500'
                                        }`}>
                                        {t('header.quality')}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Navigation Desktop */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <div key={item.name} className="relative group">
                                    <Link href={item.href}>
                                        <motion.span
                                            whileHover={{ y: -1 }}
                                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${item.current
                                                    ? 'text-amber-600 bg-amber-50'
                                                    : !isScrolled && router.pathname === '/'
                                                        ? 'text-white hover:text-amber-200'
                                                        : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span>{item.name}</span>
                                            {item.submenu && <ChevronDown className="w-4 h-4" />}
                                        </motion.span>
                                    </Link>

                                    {/* Submenu */}
                                    {item.submenu && (
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <div className="py-2">
                                                {item.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 lg:space-x-4">
                            {/* Sélecteur de langue */}
                            <LanguageSwitcher />
                            
                            {/* Recherche */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsSearchOpen(true)}
                                className={`p-2 rounded-lg transition-colors ${!isScrolled && router.pathname === '/'
                                        ? 'text-white hover:bg-white/10'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Search className="w-5 h-5" />
                            </motion.button>

                            {/* Panier */}
                            <Link href="/panier">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative"
                                >
                                    <button className={`p-2 rounded-lg transition-colors ${!isScrolled && router.pathname === '/'
                                            ? 'text-white hover:bg-white/10'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}>
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                    {cartCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </Link>

                            {/* CTA Button */}
                            <div className="hidden md:block">
                                <Link href="/shop">
                                    <Button
                                        variant={!isScrolled && router.pathname === '/' ? 'secondary' : 'primary'}
                                        size="sm"
                                        className="flex items-center space-x-2"
                                    >
                                        <ShoppingBagIcon className="w-4 h-4" />
                                        <span>{t('header.nav.shop')}</span>
                                    </Button>
                                </Link>
                            </div>

                            {/* Menu Mobile */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden p-2 rounded-lg transition-colors ${!isScrolled && router.pathname === '/'
                                        ? 'text-white hover:bg-white/10'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </motion.button>
                        </div>
                    </div>
                </nav>
            </motion.header>

            {/* Menu Mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-gray-200 lg:hidden"
                        >
                            <div className="max-w-7xl mx-auto px-4 py-4">
                                <nav className="space-y-2">
                                    {navigation.map((item) => (
                                        <div key={item.name}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${item.current
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {item.name}
                                            </Link>
                                            {item.submenu && (
                                                <div className="ml-4 mt-2 space-y-1">
                                                    {item.submenu.map((subItem) => (
                                                        <Link
                                                            key={subItem.name}
                                                            href={subItem.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block px-4 py-2 text-sm text-gray-600 hover:text-amber-600"
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="pt-4 border-t border-gray-200">
                                        <Link href="/shop">
                                            <Button variant="primary" className="w-full flex items-center justify-center space-x-2">
                                                <ShoppingBag className="w-4 h-4" />
                                                <span>{t('header.nav.shop')}</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Modal de Recherche */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-20"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4"
                        >
                            <div className="p-6">
                                <div className="flex items-center space-x-4">
                                    <Search className="w-6 h-6 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={t('header.search.placeholder')}
                                        autoFocus
                                        className="flex-1 text-lg border-none outline-none placeholder-gray-400"
                                    />
                                    <button
                                        onClick={() => setIsSearchOpen(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}