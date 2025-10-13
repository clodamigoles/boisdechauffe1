import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Instagram,
    Youtube,
    Linkedin,
    Send,
    Award,
    Leaf,
    CheckCircle,
    Truck,
    Star,
    ArrowRight
} from 'lucide-react'

import { EMAIL, ADDRESS, PHONE, WA_LINK } from "@/constants/config"

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
                { name: 'Bois de chauffage', href: '/shop?category=bois-de-chauffage' },
                { name: 'Granulés et pellets', href: '/shop?category=granules-et-pellets' },
                { name: 'Bûches compressées', href: '/shop?category=buches-compressees' },
                { name: 'Bûches compressées', href: '/shop?category=buches-compressees' }
                // { name: 'Tous les Produits', href: '/shop' }
            ]
        },
        // {
        //     title: 'Services',
        //     links: [
        //         { name: 'Livraison Express', href: '/livraison' },
        //         { name: 'Devis Gratuit', href: '/devis' },
        //         { name: 'Conseils Expert', href: '/conseils' },
        //         { name: 'Service Client', href: '/contact' },
        //         { name: 'Suivi Commande', href: '/suivi' }
        //     ]
        // },
        // {
        //     title: 'Informations',
        //     links: [
        //         { name: 'À Propos', href: '/a-propos' },
        //         { name: 'Nos Engagements', href: '/engagements' },
        //         { name: 'Qualité & Certifications', href: '/qualite' },
        //         { name: 'Zone de Livraison', href: '/zones-livraison' },
        //         { name: 'Témoignages', href: '/temoignages' }
        //     ]
        // },
        {
            title: 'Support & services',
            links: [
                { name: 'FAQ', href: '/faq' },
                { name: 'Contact', href: '/contact' },
                { name: 'Livraison Express', href: '/livraison' },
                { name: 'Suivi Commande', href: '/suivi' }
            ]
        }
    ]

    const socialLinks = [
        {
            name: 'Facebook',
            href: 'https://facebook.com/boischauffagepro',
            icon: Facebook,
            color: 'hover:text-blue-600'
        },
        {
            name: 'Instagram',
            href: 'https://instagram.com/boischauffagepro',
            icon: Instagram,
            color: 'hover:text-pink-600'
        },
        {
            name: 'YouTube',
            href: 'https://youtube.com/boischauffagepro',
            icon: Youtube,
            color: 'hover:text-red-600'
        },
        {
            name: 'LinkedIn',
            href: 'https://linkedin.com/company/boischauffagepro',
            icon: Linkedin,
            color: 'hover:text-blue-700'
        }
    ]

    const certifications = [
        { icon: Award, label: 'Certifié PEFC' },
        { icon: Leaf, label: 'Origine France' },
        { icon: CheckCircle, label: 'Qualité Contrôlée' },
        { icon: Truck, label: 'Livraison 24-48h' }
    ]

    return (
        <footer className="bg-gray-900 text-white">
            {/* Section principale */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
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
                                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                                    <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
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
                                    <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                    <span className="text-gray-300">{ADDRESS}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                    <a href={WA_LINK} className="text-gray-300 hover:text-amber-400 transition-colors">
                                        {PHONE}
                                    </a>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                    <a href={`mailto:${EMAIL}`} className="text-gray-300 hover:text-amber-400 transition-colors">
                                        {EMAIL}
                                    </a>
                                </div>
                            </div>

                            {/* Réseaux sociaux
                            <div className="flex space-x-4">
                                {socialLinks.map((social) => {
                                    const IconComponent = social.icon
                                    return (
                                        <motion.a
                                            key={social.name}
                                            href={social.href}
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center ${social.color} transition-colors duration-300`}
                                            aria-label={social.name}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                        </motion.a>
                                    )
                                })}
                            </div> */}
                        </motion.div>
                    </div>

                    {/* Colonnes Navigation */}
                    <div className="lg:col-span-6 grid grid-cols-2 gap-6 lg:gap-8">
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
                                                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                                            >
                                                <span>{link.name}</span>
                                                <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Newsletter */}
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
                                    className="bg-green-600 rounded-lg p-4 text-center"
                                >
                                    <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                                    <div className="text-sm">Inscrit avec succès !</div>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Votre email"
                                            value={newsletterEmail}
                                            onChange={(e) => setNewsletterEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors pr-12"
                                        />
                                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    <motion.button
                                        type="submit"
                                        disabled={isNewsletterLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                                    >
                                        {isNewsletterLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>S'inscrire</span>
                                            </>
                                        )}
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {certifications.map((cert, index) => {
                            const IconComponent = cert.icon
                            return (
                                <motion.div
                                    key={cert.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    whileHover={{ y: -2 }}
                                    className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg"
                                >
                                    <IconComponent className="w-6 h-6 text-amber-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-300">{cert.label}</span>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-800 bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex flex-wrap items-center justify-center md:justify-start space-x-6 text-sm text-gray-400">
                            <span>© 2025 BoisChauffage Pro. Tous droits réservés.</span>
                            <Link href="/mentions-legales" className="hover:text-white transition-colors">
                                Mentions Légales
                            </Link>
                            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
                                Confidentialité
                            </Link>
                            <Link href="/cgv" className="hover:text-white transition-colors">
                                CGV
                            </Link>
                            <Link href="/cookies" className="hover:text-white transition-colors">
                                Cookies
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Paiement sécurisé</span>
                            <div className="flex space-x-2">
                                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-xs text-white font-bold">CB</div>
                                <div className="w-8 h-5 bg-yellow-500 rounded flex items-center justify-center text-xs text-white font-bold">V</div>
                                <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center text-xs text-white font-bold">PP</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}