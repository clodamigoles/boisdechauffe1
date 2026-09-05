"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import {
    ChevronDown,
    Search,
    Package,
    Truck,
    CreditCard,
    Shield,
    HelpCircle,
    Phone,
    Mail,
    CheckCircle,
    AlertCircle,
    Clock,
    FileText,
    MessageSquare,
} from "lucide-react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/ActionButton"
import { containerVariants, itemVariants } from "../utils/animations"
import { useSettings } from "@/hooks/useSettings"
import SeoHead from "@/components/layout/SeoHead"
import { localized, useT } from "@/lib/i18n"
import { FAQ_CATEGORIES, FAQ_ITEMS } from "@/constants/faq"

/** Les icônes nommées dans `constants/faq.js` : le module de contenu ne doit
 *  pas dépendre d'une bibliothèque de rendu. */
const CATEGORY_ICONS = {
    help: HelpCircle,
    package: Package,
    card: CreditCard,
    truck: Truck,
    shield: Shield,
}

const CATEGORY_COLORS = {
    all: "bg-gray-500",
    order: "bg-blue-500",
    payment: "bg-purple-500",
    delivery: "bg-green-500",
    wood: "bg-amber-500",
}

export default function FAQPage() {
    const t = useT()
    const { locale } = useRouter()
    const { contactEmail, contactPhone } = useSettings()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [openItems, setOpenItems] = useState([])


    // Contenu et catégories viennent de `constants/faq.js`, dans les deux
    // langues. Ce qui se trouvait ici décrivait une société lyonnaise avec un
    // espace client, le paiement par chèque et un certificat d'humidité joint
    // à chaque livraison — rien de tout cela n'existe.
    const categories = FAQ_CATEGORIES.map((category) => ({
        ...category,
        label: localized(category.label, locale),
        icon: CATEGORY_ICONS[category.icon] ?? HelpCircle,
        color: CATEGORY_COLORS[category.id] ?? "bg-gray-500",
    }))

    const faqData = FAQ_ITEMS.map((item) => ({
        category: item.category,
        question: localized(item.question, locale),
        answer: localized(item.answer, locale),
    }))

    const filteredFAQ = faqData.filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
        const matchesSearch =
            searchQuery === "" ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <>
            <SeoHead
                title={t('meta.faqTitle')}
                description={t('meta.faqDescription')}
            />

            <div className="min-h-screen bg-gray-50">
                <Header />

                {/* Hero Section */}
                <section className="bg-gray-800 text-white py-20 mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6"
                            >
                                <HelpCircle className="w-4 h-4 mr-2" />
                                {t('faq.badge')}
                            </motion.div>

                            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                {t('faq.title')}
                                <span className="block text-amber-400">{t('faq.titleAccent')}</span>
                            </h1>

                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                {t('faq.heroIntro')}
                            </p>

                            {/* Barre de recherche */}
                            <div className="max-w-2xl mx-auto">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={t('faq.searchPlaceholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Catégories */}
                <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                            {categories.map((category) => {
                                const IconComponent = category.icon
                                const isActive = selectedCategory === category.id
                                return (
                                    <motion.button
                                        key={category.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${isActive
                                                ? `${category.color} text-white shadow-lg`
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        <span className="font-medium text-sm">{category.label}</span>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Liste des FAQ */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredFAQ.length === 0 ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('faq.noResult')}</h3>
                                <p className="text-gray-600 mb-6">{t('faq.noResultText')}</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSelectedCategory("all")
                                    }}
                                >
                                    {t('faq.resetSearch')}
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div variants={containerVariants} initial="initial" animate="animate" className="space-y-4">
                                {filteredFAQ.map((item, index) => {
                                    const isOpen = openItems.includes(index)
                                    const categoryInfo = categories.find((c) => c.id === item.category)
                                    const CategoryIcon = categoryInfo?.icon

                                    return (
                                        <motion.div
                                            key={index}
                                            variants={itemVariants}
                                            custom={index}
                                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleItem(index)}
                                                className="w-full px-6 py-5 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-start space-x-4 flex-1">
                                                    {CategoryIcon && (
                                                        <div
                                                            className={`w-8 h-8 ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}
                                                        >
                                                            <CategoryIcon className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.question}</h3>
                                                        {!isOpen && <p className="text-sm text-gray-500 line-clamp-1">{item.answer}</p>}
                                                    </div>
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex-shrink-0 ml-4"
                                                >
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                </motion.div>
                                            </button>

                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    height: isOpen ? "auto" : 0,
                                                    opacity: isOpen ? 1 : 0,
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-5 pl-18">
                                                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}

                        {/* Statistiques */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-12 text-center text-sm text-gray-500"
                        >
                            {t('faq.showing', { shown: filteredFAQ.length, total: faqData.length })}
                        </motion.div>
                    </div>
                </section>

                {/* Section Contact */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 lg:p-12"
                        >
                            <div className="text-center max-w-2xl mx-auto">
                                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('faq.helpTitle')}</h2>
                                <p className="text-lg text-gray-700 mb-8">
                                    {t('faq.helpText')}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/contact">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700"
                                        >
                                            <Mail className="w-5 h-5" />
                                            <span>{t('faq.helpCta')}</span>
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex items-center space-x-2 bg-white text-amber-700 border-amber-300 hover:bg-amber-50"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>{contactPhone}</span>
                                    </Button>
                                </div>

                                <div className="mt-8 pt-8 border-t border-amber-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Clock className="w-4 h-4 text-amber-600" />
                                            <span className="text-gray-700">{t('faq.helpResponse')}</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span className="text-gray-700">{t('faq.helpWritten')}</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <Shield className="w-4 h-4 text-blue-600" />
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Ressources utiles */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('faq.resourcesTitle')}</h2>
                            <p className="text-lg text-gray-600">{t('faq.resourcesIntro')}</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Truck className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('faq.resourceDelivery')}</h3>
                                <p className="text-gray-600 mb-4">{t('faq.resourceDeliveryText')}</p>
                                <Link href="/livraison">
                                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                                        {t('faq.learnMore')}
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Package className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('faq.resourceProducts')}</h3>
                                <p className="text-gray-600 mb-4">{t('faq.resourceProductsText')}</p>
                                <Link href="/shop">
                                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                                        {t('faq.resourceProductsCta')}
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('faq.resourceContact')}</h3>
                                <p className="text-gray-600 mb-4">{t('faq.resourceContactText')}</p>
                                <Link href="/contact">
                                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                                        {t('faq.resourceContactCta')}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    )
}