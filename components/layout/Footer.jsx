import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Instagram,
    Youtube,
    Linkedin,
    Send,
    Droplets,
    Leaf,
    CheckCircle,
    Truck,
    ArrowRight
} from 'lucide-react'

import { useSettings } from "@/hooks/useSettings"
import { useCategories } from "@/hooks/useCategories"
import { localized, useT } from "@/lib/i18n"

/** Les réseaux qu'on sait afficher, si les paramètres en donnent l'adresse. */
const SOCIAL_ICONS = {
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    linkedin: Linkedin,
}

export default function Footer() {
    const t = useT()
    const { locale } = useRouter()
    const categories = useCategories()
    const { contactEmail, fullAddress, contactPhone, whatsappLink, siteName, companyName, socialMedia } = useSettings()
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

    // Les catégories viennent de la base : la liste codée en dur contenait
    // « Bûches compressées » deux fois et ignorait toute création ou
    // désactivation faite depuis l'administration.
    const footerSections = [
        {
            title: t('footer.products'),
            links: categories.map((category) => ({
                name: localized(category.name, locale),
                href: `/shop?category=${category.slug}`
            }))
        },
        {
            title: t('footer.support'),
            links: [
                { name: t('nav.faq'), href: '/faq' },
                { name: t('nav.contact'), href: '/contact' },
                { name: t('nav.delivery'), href: '/livraison' },
                { name: t('nav.tracking'), href: '/suivi' }
            ]
        }
    ]

    // Les quatre liens qui étaient ici pointaient vers des comptes
    // « boischauffagepro » — une marque qui n'est pas celle de ce site, et
    // dont rien ne dit qu'elle existe. Un lien social ne se remet qu'avec une
    // adresse réelle : `socialMedia` dans les paramètres, renseigné depuis
    // l'administration. Tant qu'il est vide, la rangée ne s'affiche pas.
    const socialLinks = Object.entries(socialMedia || {})
        .filter(([, url]) => Boolean(url))
        .map(([name, url]) => ({ name, href: url, icon: SOCIAL_ICONS[name] }))
        .filter((link) => Boolean(link.icon))

    // « Certifié PEFC » a disparu : c'est une certification qu'il faut détenir
    // pour l'afficher. « Livraison 24-48h » aussi : elle contredisait le délai
    // de 4 à 5 jours annoncé partout ailleurs sur le site.
    const certifications = [
        { icon: Droplets, label: t('footer.certifiedDry') },
        { icon: Leaf, label: t('footer.certifiedOrigin') },
        { icon: CheckCircle, label: t('footer.certifiedQuality') },
        { icon: Truck, label: t('footer.certifiedDelivery') }
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
                                <div className="relative w-10 h-10">
                                    <Image
                                        src="/images/logo.svg"
                                        alt={`${siteName} Logo`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-white">
                                        {siteName}
                                    </span>
                                    <p className="text-sm text-gray-400">{t('common.tagline')}</p>
                                </div>
                            </Link>

                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {t('footer.about')}
                            </p>

                            {/* Coordonnées */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center space-x-3">
                                    <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                    <span className="text-gray-300">{fullAddress}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                    <a href={whatsappLink} className="text-gray-300 hover:text-amber-400 transition-colors">
                                        {contactPhone}
                                    </a>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                    <a href={`mailto:${contactEmail}`} className="text-gray-300 hover:text-amber-400 transition-colors">
                                        {contactEmail}
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
{t('footer.newsletterTitle')}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                {t('footer.newsletterText')}
                            </p>

                            {newsletterSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-600 rounded-lg p-4 text-center"
                                >
                                    <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                                    <div className="text-sm">{t('footer.newsletterDone')}</div>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder={t('footer.newsletterPlaceholder')}
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
                                                <span>{t('footer.newsletterCta')}</span>
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
                            <span>{t('footer.copyright', { year: new Date().getFullYear(), company: companyName })}</span>
                            <Link href="/mentions-legales" className="hover:text-white transition-colors">
                                {t('footer.legalNotice')}
                            </Link>
                            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
                                {t('footer.privacy')}
                            </Link>
                            <Link href="/cgv" className="hover:text-white transition-colors">
                                {t('footer.terms')}
                            </Link>
                            <Link href="/cookies" className="hover:text-white transition-colors">
                                {t('footer.cookies')}
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{t('footer.securePayment')}</span>
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