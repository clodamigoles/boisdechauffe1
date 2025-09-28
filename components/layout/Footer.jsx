import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [isNewsletterLoading, setIsNewsletterLoading] = useState(false)
    const [newsletterSuccess, setNewsletterSuccess] = useState(false)

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault()
        setIsNewsletterLoading(true)

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newsletterEmail,
                    source: 'footer'
                }),
            })

            if (response.ok) {
                setNewsletterSuccess(true)
                setNewsletterEmail('')
                setTimeout(() => setNewsletterSuccess(false), 3000)
            }
        } catch (error) {
            console.error('Erreur newsletter:', error)
        } finally {
            setIsNewsletterLoading(false)
        }
    }

    const footerSections = [
        {
            title: 'Produits',
            links: [
                { name: 'Bois Feuillus', href: '/categories/bois-feuillus' },
                { name: 'Bois Résineux', href: '/categories/bois-resineux' },
                { name: 'Granulés Premium', href: '/categories/granules' },
                { name: 'Allume-Feu', href: '/categories/allume-feu' },
                { name: 'Tous les Produits', href: '/produits' }
            ]
        },
        {
            title: 'Services',
            links: [
                { name: 'Livraison Express', href: '/livraison' },
                { name: 'Devis Gratuit', href: '/devis' },
                { name: 'Conseils Expert', href: '/conseils' },
                { name: 'Service Client', href: '/contact' },
                { name: 'Suivi Commande', href: '/suivi' }
            ]
        },
        {
            title: 'Informations',
            links: [
                { name: 'À Propos', href: '/a-propos' },
                { name: 'Nos Engagements', href: '/engagements' },
                { name: 'Qualité & Certifications', href: '/qualite' },
                { name: 'Zone de Livraison', href: '/zones-livraison' },
                { name: 'Témoignages', href: '/temoignages' }
            ]
        },
        {
            title: 'Support',
            links: [
                { name: 'Centre d\'Aide', href: '/aide' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Contact', href: '/contact' },
                { name: 'Réclamations', href: '/reclamations' },
                { name: 'Garanties', href: '/garanties' }
            ]
        }
    ]

    const socialLinks = [
        {
            name: 'Facebook',
            href: 'https://facebook.com/boischauffagepro',
            icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
        },
        {
            name: 'Instagram',
            href: 'https://instagram.com/boischauffagepro',
            icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.624 5.367 11.99 11.988 11.99s11.987-5.366 11.987-11.99C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-2.24 0-4.056-1.816-4.056-4.056s1.816-4.056 4.056-4.056 4.056 1.816 4.056 4.056-1.816 4.056-4.056 4.056zm7.49 0c-2.24 0-4.056-1.816-4.056-4.056s1.816-4.056 4.056-4.056 4.056 1.816 4.056 4.056-1.816 4.056-4.056 4.056z'
        },
        {
            name: 'YouTube',
            href: 'https://youtube.com/boischauffagepro',
            icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
        },
        {
            name: 'LinkedIn',
            href: 'https://linkedin.com/company/boischauffagepro',
            icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
        }
    ]

    return (
        <footer className="bg-gray-900 text-white">
            {/* Section principale */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Colonne Entreprise */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Logo */}
                            <Link href="/" className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">🔥</span>
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-white">BoisChauffage Pro</span>
                                    <p className="text-sm text-gray-400">Qualité Premium</p>
                                </div>
                            </Link>

                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Spécialiste du bois de chauffage premium depuis 15 ans.
                                Nous sélectionnons rigoureusement nos essences pour vous garantir
                                un chauffage optimal et durable.
                            </p>

                            {/* Coordonnées */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-5 h-5 text-amber-400">📍</div>
                                    <span className="text-gray-300">123 Route Forestière, 69000 Lyon</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-5 h-5 text-amber-400">📞</div>
                                    <a href="tel:+33123456789" className="text-gray-300 hover:text-amber-400 transition-colors">
                                        01 23 45 67 89
                                    </a>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-5 h-5 text-amber-400">✉️</div>
                                    <a href="mailto:contact@boischauffagepro.fr" className="text-gray-300 hover:text-amber-400 transition-colors">
                                        contact@boischauffagepro.fr
                                    </a>
                                </div>
                            </div>

                            {/* Réseaux sociaux */}
                            <div className="flex space-x-4">
                                {socialLinks.map((social) => (
                                    <motion.a
                                        key={social.name}
                                        href={social.href}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors duration-300"
                                        aria-label={social.name}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d={social.icon} />
                                        </svg>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Colonnes Navigation */}
                    <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {footerSections.map((section, sectionIndex) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-gray-400 hover:text-amber-400 transition-colors duration-200 text-sm"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Newsletter Footer */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Newsletter
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Recevez nos offres exclusives et conseils d'experts
                            </p>

                            {newsletterSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-500/20 border border-green-400/50 rounded-lg p-3 text-center"
                                >
                                    <div className="text-green-400 text-sm">✓ Inscrit avec succès !</div>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="Votre email"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={isNewsletterLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                                    >
                                        {isNewsletterLoading ? 'Inscription...' : 'S\'inscrire'}
                                    </motion.button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Certifications et Labels */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12 pt-8 border-t border-gray-800"
                >
                    <div className="flex flex-wrap justify-center items-center space-x-8 space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🏆</span>
                            <span className="text-sm text-gray-400">Certifié PEFC</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🌱</span>
                            <span className="text-sm text-gray-400">Origine France</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">✅</span>
                            <span className="text-sm text-gray-400">Qualité Contrôlée</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🚚</span>
                            <span className="text-sm text-gray-400">Livraison 24-48h</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-800 bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
                            <span>© 2025 BoisChauffage Pro. Tous droits réservés.</span>
                            <Link href="/mentions-legales" className="hover:text-amber-400 transition-colors">
                                Mentions Légales
                            </Link>
                            <Link href="/politique-confidentialite" className="hover:text-amber-400 transition-colors">
                                Confidentialité
                            </Link>
                            <Link href="/cgv" className="hover:text-amber-400 transition-colors">
                                CGV
                            </Link>
                            <Link href="/cookies" className="hover:text-amber-400 transition-colors">
                                Cookies
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Paiement sécurisé</span>
                            <div className="flex space-x-2">
                                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-xs text-white font-bold">CB</div>
                                <div className="w-8 h-5 bg-yellow-500 rounded flex items-center justify-center text-xs text-white font-bold">💳</div>
                                <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center text-xs text-white font-bold">PP</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}