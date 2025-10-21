"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Truck, Shield, CreditCard, MapPin, User, FileText, CheckCircle } from "lucide-react"
import { useCartStore } from "../store/cartStore"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { getRegionsForCountry, calculateShippingCost } from "../lib/shipping-regions"
import { useTranslation } from "@/lib/useTranslation"
import { loadTranslations } from "@/lib/i18n-server"

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
}

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
}

export default function CheckoutPage() {
    const router = useRouter()
    const { t } = useTranslation('commander')
    const { items, getTotalPrice, clearCart } = useCartStore()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    // Données du formulaire
    const [formData, setFormData] = useState({
        // Informations client
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        company: "",

        // Adresse de livraison
        address1: "",
        address2: "",
        city: "",
        postalCode: "",
        country: "France",
        region: "",
        instructions: "",

        // Acceptation des conditions
        acceptTerms: false,
        acceptNewsletter: false,
    })

    const [availableRegions, setAvailableRegions] = useState([])
    const [shippingCost, setShippingCost] = useState(0)

    useEffect(() => {
        // Rediriger si le panier est vide
        if (items.length === 0) {
            router.push("/panier")
            return
        }

        const timer = setTimeout(() => setIsLoading(false), 100)
        return () => clearTimeout(timer)
    }, [items, router])

    useEffect(() => {
        async function loadRegions() {
            const regions = await getRegionsForCountry(formData.country)
            setAvailableRegions(regions)
            // Reset region when country changes
            if (formData.region && !regions.find((r) => r.name === formData.region)) {
                setFormData((prev) => ({ ...prev, region: regions[0]?.name || "" }))
            } else if (!formData.region && regions.length > 0) {
                setFormData((prev) => ({ ...prev, region: regions[0].name }))
            }
        }
        loadRegions()
    }, [formData.country])

    useEffect(() => {
        async function updateShippingCost() {
            const subtotal = getTotalPrice()
            const cost = await calculateShippingCost(formData.country, formData.region, subtotal)
            setShippingCost(cost)
        }
        updateShippingCost()
    }, [formData.country, formData.region, items, getTotalPrice])

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Effacer l'erreur du champ modifié
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Validation des champs requis
        if (!formData.email) newErrors.email = t('validation.emailRequired')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('validation.emailInvalid')
        }

        if (!formData.firstName) newErrors.firstName = t('validation.firstNameRequired')
        if (!formData.lastName) newErrors.lastName = t('validation.lastNameRequired')
        if (!formData.phone) newErrors.phone = t('validation.phoneRequired')
        if (!formData.address1) newErrors.address1 = t('validation.address1Required')
        if (!formData.city) newErrors.city = t('validation.cityRequired')
        if (!formData.postalCode) newErrors.postalCode = t('validation.postalCodeRequired')
        if (!formData.region) newErrors.region = t('validation.regionRequired')
        if (!formData.acceptTerms) newErrors.acceptTerms = t('validation.acceptTermsRequired')

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            const subtotal = getTotalPrice()
            const shippingCost = await calculateShippingCost(formData.country, formData.region, subtotal)

            const orderData = {
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company || "",
                },
                shippingAddress: {
                    street: formData.address1 + (formData.address2 ? `, ${formData.address2}` : ""),
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                },
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                notes: formData.instructions || "",
                shippingCost: shippingCost,
            }

            console.log("[v0] Sending order data:", orderData)

            // Call the new API endpoint
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            })

            const result = await response.json()

            console.log("[v0] API response:", result)

            if (!response.ok) {
                throw new Error(result.message || t('errors.orderCreationError'))
            }

            if (!result.success) {
                throw new Error(result.message || t('errors.orderCreationError'))
            }

            // Clear cart on success
            clearCart()

            // Redirect to order tracking page
            router.push(`/commande/${result.data.orderNumber}`)
        } catch (error) {
            console.error("Erreur lors de la création de la commande:", error)
            setErrors({ submit: error.message || t('errors.submitError') })
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price)
    }

    const subtotal = getTotalPrice()
    const total = subtotal + shippingCost

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
        <div className="min-h-screen bg-gray-50">
            <Header />

            <motion.main
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="pt-20 pb-16"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <Link href="/panier">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span>{t('navigation.backToCart')}</span>
                                </motion.button>
                            </Link>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('header.title')}</h1>
                        <p className="text-gray-600">{t('header.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Formulaire */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Informations client */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">{t('sections.personalInfo')}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            type="email"
                                            label={t('form.fields.email.label')}
                                            placeholder={t('form.fields.email.placeholder')}
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            error={errors.email}
                                            required
                                        />
                                        <Input
                                            type="tel"
                                            label={t('form.fields.phone.label')}
                                            placeholder={t('form.fields.phone.placeholder')}
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            error={errors.phone}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label={t('form.fields.firstName.label')}
                                            placeholder={t('form.fields.firstName.placeholder')}
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            error={errors.firstName}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label={t('form.fields.lastName.label')}
                                            placeholder={t('form.fields.lastName.placeholder')}
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                            error={errors.lastName}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label={t('form.fields.company.label')}
                                            placeholder={t('form.fields.company.placeholder')}
                                            value={formData.company}
                                            onChange={(e) => handleInputChange("company", e.target.value)}
                                        />
                                    </div>
                                </motion.div>

                                {/* Adresse de livraison */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">{t('sections.shippingAddress')}</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <Input
                                            type="text"
                                            label={t('form.fields.address1.label')}
                                            placeholder={t('form.fields.address1.placeholder')}
                                            value={formData.address1}
                                            onChange={(e) => handleInputChange("address1", e.target.value)}
                                            error={errors.address1}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label={t('form.fields.address2.label')}
                                            placeholder={t('form.fields.address2.placeholder')}
                                            value={formData.address2}
                                            onChange={(e) => handleInputChange("address2", e.target.value)}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <Input
                                                type="text"
                                                label={t('form.fields.postalCode.label')}
                                                placeholder={t('form.fields.postalCode.placeholder')}
                                                value={formData.postalCode}
                                                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                                error={errors.postalCode}
                                                required
                                            />
                                            <Input
                                                type="text"
                                                label={t('form.fields.city.label')}
                                                placeholder={t('form.fields.city.placeholder')}
                                                value={formData.city}
                                                onChange={(e) => handleInputChange("city", e.target.value)}
                                                error={errors.city}
                                                required
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t('form.fields.country.label')} <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={formData.country}
                                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                                                >
                                                    <option value="France">{t('form.countries.france')}</option>
                                                    <option value="Belgique">{t('form.countries.belgium')}</option>
                                                    <option value="Suisse">{t('form.countries.switzerland')}</option>
                                                    <option value="Luxembourg">{t('form.countries.luxembourg')}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('form.fields.region.label')} <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.region}
                                                onChange={(e) => handleInputChange("region", e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 ${errors.region ? "border-red-500" : "border-gray-300"
                                                    }`}
                                            >
                                                <option value="">{t('form.fields.region.placeholder')}</option>
                                                {availableRegions.map((region) => (
                                                    <option key={region.name} value={region.name}>
                                                        {region.name} - {formatPrice(region.cost)} {subtotal >= 500 && t('form.fields.region.free')}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
                                            <p className="mt-2 text-sm text-gray-500">
                                                {t('form.fields.region.note')}
                                            </p>
                                        </div>
                                        <Input
                                            type="text"
                                            label={t('form.fields.instructions.label')}
                                            placeholder={t('form.fields.instructions.placeholder')}
                                            value={formData.instructions}
                                            onChange={(e) => handleInputChange("instructions", e.target.value)}
                                        />
                                    </div>
                                </motion.div>

                                {/* Mode de paiement */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                            <CreditCard className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">{t('sections.paymentMethod')}</h2>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-blue-900">{t('payment.title')}</h3>
                                                <p className="text-sm text-blue-700 mt-1">
                                                    {t('payment.description')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Conditions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                >
                                    <div className="space-y-4">
                                        <label className="flex items-start space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.acceptTerms}
                                                onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                                                className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {t('terms.accept')}{" "}
                                                <Link href="/cgv" className="text-amber-600 hover:text-amber-700 underline">
                                                    {t('terms.cgv')}
                                                </Link>{" "}
                                                {t('terms.and')}{" "}
                                                <Link href="/politique-confidentialite" className="text-amber-600 hover:text-amber-700 underline">
                                                    {t('terms.privacy')}
                                                </Link>
                                                <span className="text-red-500 ml-1">*</span>
                                            </span>
                                        </label>
                                        {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms}</p>}

                                        <label className="flex items-start space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.acceptNewsletter}
                                                onChange={(e) => handleInputChange("acceptNewsletter", e.target.checked)}
                                                className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {t('terms.newsletter')}
                                            </span>
                                        </label>
                                    </div>
                                </motion.div>

                                {/* Message d'erreur global */}
                                {errors.submit && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
                                    >
                                        {errors.submit}
                                    </motion.div>
                                )}
                            </div>

                            {/* Résumé de commande */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24"
                                >
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('sections.orderSummary')}</h2>

                                    {/* Articles */}
                                    <div className="space-y-4 mb-6">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-3">
                                                <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {item.quantity} × {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totaux */}
                                    <div className="space-y-3 mb-6 pt-6 border-t border-gray-100">
                                        <div className="flex justify-between text-gray-600">
                                            <span>{t('summary.subtotal')}</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>{t('summary.shipping')}</span>
                                            <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                                                {shippingCost === 0 ? t('summary.shippingFree') : formatPrice(shippingCost)}
                                            </span>
                                        </div>
                                        {subtotal < 500 && (
                                            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                                                <p className="font-medium">{t('summary.freeShippingThreshold')}</p>
                                                <p>{t('summary.freeShippingRemaining', { amount: formatPrice(500 - subtotal) })}</p>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-100 pt-3">
                                            <div className="flex justify-between text-lg font-semibold text-gray-900">
                                                <span>{t('summary.total')}</span>
                                                <span>{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations livraison */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-center space-x-2 text-green-700 mb-2">
                                            <Truck className="w-5 h-5" />
                                            <span className="font-medium">{t('delivery.title')}</span>
                                        </div>
                                        <p className="text-sm text-green-600">
                                            {t('delivery.description')}
                                        </p>
                                    </div>

                                    {/* Bouton de commande */}
                                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
                                        {isSubmitting ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>{t('buttons.processing')}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <FileText className="w-5 h-5 mr-2" />
                                                {t('buttons.placeOrder')}
                                            </>
                                        )}
                                    </Button>

                                    {/* Garanties */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-green-500" />
                                                <span>{t('guarantees.securePayment')}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-green-500" />
                                                <span>{t('guarantees.satisfaction')}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-green-500" />
                                                <span>{t('guarantees.support')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.main>

            <Footer />
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    try {
        // Charger les traductions
        const translations = await loadTranslations(locale || 'en', ['common', 'commander'])
        
        return {
            props: {
                translations
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement des traductions:", error)
        
        const translations = await loadTranslations(locale || 'en', ['common', 'commander'])
        
        return {
            props: {
                translations
            }
        }
    }
}