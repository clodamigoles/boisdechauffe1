"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Input from "../components/ui/FormField"
import Button from "../components/ui/ActionButton"
import { useT } from "@/lib/i18n"
import { pageVariants, containerVariants, itemVariants } from "../utils/animations"
import { Search, Package, AlertCircle, Loader } from "lucide-react"
import SeoHead from "@/components/layout/SeoHead"

export default function SuiviPage() {
    const t = useT()
    const router = useRouter()
    const [orderNumber, setOrderNumber] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            // Fetch order to verify it exists and email matches
            const response = await fetch(`/api/orders/${orderNumber}`)
            const result = await response.json()

            if (!result.success) {
                setError("Commande introuvable. Vérifiez votre numéro de commande.")
                setIsLoading(false)
                return
            }

            // Verify email matches
            if (result.data.customer.email.toLowerCase() !== email.toLowerCase()) {
                setError("L'email ne correspond pas à cette commande.")
                setIsLoading(false)
                return
            }

            // Redirect to order details page
            router.push(`/commande/${orderNumber}`)
        } catch (error) {
            console.error("Erreur lors de la recherche:", error)
            setError("Une erreur est survenue. Veuillez réessayer.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SeoHead
                title={t('meta.trackingTitle')}
                description={t('tracking.subtitle')}
            />

            <Header />

            <motion.main initial="initial" animate="enter" exit="exit" variants={pageVariants} className="pt-20 pb-16">
                {/* Hero Section */}
                <div className="bg-gray-800 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                                <Package className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('tracking.heroTitle')}</h1>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">{t('tracking.heroSubtitle')}</p>
                        </motion.div>
                    </div>
                </div>

                {/* Search Form Section */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                    <motion.div
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
                    >
                        <motion.div variants={itemVariants} custom={0}>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <Search className="w-5 h-5 text-amber-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{t('tracking.searchTitle')}</h2>
                            </div>

                            <p className="text-gray-600 mb-8">
                                {t('tracking.searchIntro')}
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div variants={itemVariants} custom={1}>
                                <Input
                                    label={t('tracking.orderNumber')}
                                    type="text"
                                    placeholder={t('tracking.orderNumberPlaceholder')}
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                    required
                                    disabled={isLoading}
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    {t('tracking.orderNumberHint')}
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants} custom={2}>
                                <Input
                                    label={t('tracking.email')}
                                    type="email"
                                    placeholder={t('tracking.emailPlaceholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </motion.div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">{t('tracking.error')}</p>
                                        <p className="text-sm text-red-700 mt-1">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            <motion.div variants={itemVariants} custom={3}>
                                <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                        <>
                                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                                            {t('tracking.searching')}
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5 mr-2" />
                                            {t('tracking.submit')}
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>

                {/* Info Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: "📦",
                                title: t('tracking.feature1'),
                                description: t('tracking.feature1Text'),
                            },
                            {
                                icon: "🔔",
                                title: t('tracking.feature2'),
                                description: t('tracking.feature2Text'),
                            },
                            {
                                icon: "📄",
                                title: t('tracking.feature3'),
                                description: t('tracking.feature3Text'),
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Help Section */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-amber-50 border border-amber-200 rounded-xl p-8"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('tracking.helpTitle')}</h3>
                        <p className="text-gray-700 mb-4">
                            {t('tracking.helpText')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="primary" onClick={() => router.push("/contact")}>
                                {t('tracking.helpContact')}
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/faq")}>
                                {t('tracking.helpFaq')}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.main>

            <Footer />
        </div>
    )
}
