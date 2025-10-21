import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check } from 'lucide-react'

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
]

export default function LanguageSwitcher() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const currentLocale = router.locale || 'en'

    const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

    const handleLanguageChange = (locale) => {
        setIsOpen(false)
        
        // Retirer le préfixe de langue actuel de l'URL
        let cleanPath = router.asPath
        
        // Retirer le préfixe de langue existant (si présent)
        const currentPrefix = `/${currentLocale}`
        if (currentLocale !== 'en' && cleanPath.startsWith(currentPrefix)) {
            cleanPath = cleanPath.substring(currentPrefix.length) || '/'
        }
        
        // Construire la nouvelle URL avec le nouveau locale
        const newPath = locale === 'en' ? cleanPath : `/${locale}${cleanPath}`
        
        // Rechargement complet de la page pour charger les nouvelles traductions
        window.location.href = newPath
    }

    return (
        <div className="relative">
            {/* Bouton */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
                </span>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                        >
                            {languages.map((language) => (
                                <motion.button
                                    key={language.code}
                                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                                    onClick={() => handleLanguageChange(language.code)}
                                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">{language.flag}</span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {language.name}
                                        </span>
                                    </div>
                                    {currentLocale === language.code && (
                                        <Check className="w-4 h-4 text-amber-600" />
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

