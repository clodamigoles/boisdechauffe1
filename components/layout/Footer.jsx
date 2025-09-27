import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react'

import { SITE_CONFIG } from '@/constants/config'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main footer content */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">🪵</span>
                            </div>
                            <h3 className="text-xl font-bold">{SITE_CONFIG.name}</h3>
                        </div>

                        <p className="text-gray-400 leading-relaxed">
                            Votre spécialiste du bois de chauffage premium en France.
                            Qualité garantie, livraison rapide dans tout le pays.
                        </p>

                        <div className="flex space-x-4">
                            {SITE_CONFIG.footerLinks.social.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="text-gray-400 hover:text-amber-400 transition-colors duration-200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.icon === 'facebook' && <Facebook className="h-6 w-6" />}
                                    {social.icon === 'instagram' && <Instagram className="h-6 w-6" />}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-amber-400">Contact</h3>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-amber-400" />
                                <a
                                    href={`tel:${SITE_CONFIG.phone}`}
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    {SITE_CONFIG.phone}
                                </a>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-amber-400" />
                                <a
                                    href={`mailto:${SITE_CONFIG.email}`}
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    {SITE_CONFIG.email}
                                </a>
                            </div>

                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-amber-400 mt-1" />
                                <address className="text-gray-400 not-italic leading-relaxed">
                                    {SITE_CONFIG.address}
                                </address>
                            </div>
                        </div>
                    </div>

                    {/* Links légaux */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-amber-400">Légal</h3>

                        <ul className="space-y-2">
                            {SITE_CONFIG.footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links aide */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-amber-400">Aide</h3>

                        <ul className="space-y-2">
                            {SITE_CONFIG.footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Newsletter signup */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-white mb-3">Newsletter</h4>
                            <form className="flex">
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-r-lg transition-colors duration-200"
                                >
                                    S'inscrire
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            © {currentYear} {SITE_CONFIG.name}. Tous droits réservés.
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <span>Paiement par virement bancaire</span>
                            <span>•</span>
                            <span>Livraison France entière</span>
                            <span>•</span>
                            <span>Bois certifié PEFC</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}