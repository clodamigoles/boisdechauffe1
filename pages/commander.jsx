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
import Button from "../components/ui/ActionButton"
import Input from "../components/ui/FormField"
import PaymentMethodSelect from "../components/payments/PaymentMethodSelect"
import CreditCardForm from "../components/payments/CreditCardForm"
import { getRegionsForCountry, getShippingCountries, calculateShippingCost } from "../lib/shipping-regions"
import { useSettings } from "@/hooks/useSettings"
import { useT } from "@/lib/i18n"

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
    const t = useT()
    const { freeShippingThreshold } = useSettings()
    const { items, getTotalPrice, clearCart } = useCartStore()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})
    const [paymentMethod, setPaymentMethod] = useState("card")
    const [createdOrder, setCreatedOrder] = useState(null) // { orderId, orderNumber } pour CB

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
        country: "Deutschland",
        region: "",
        instructions: "",

        // Acceptation des conditions
        acceptTerms: false,
        acceptNewsletter: false,
    })

    const [availableRegions, setAvailableRegions] = useState([])
    const [availableCountries, setAvailableCountries] = useState([])
    const [shippingCost, setShippingCost] = useState(0)

    useEffect(() => {
        // Les pays livrables suivent les zones déclarées dans l'administration.
        getShippingCountries().then(setAvailableCountries).catch(() => setAvailableCountries([]))
    }, [])

    useEffect(() => {
        // Rediriger si le panier est vide, sauf si une commande CB a été créée
        // (le panier est vidé après création de commande, mais on reste sur la page
        //  pour afficher le formulaire de paiement par carte)
        if (items.length === 0 && !createdOrder) {
            router.push("/panier")
            return
        }

        const timer = setTimeout(() => setIsLoading(false), 100)
        return () => clearTimeout(timer)
    }, [items, router, createdOrder])

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
        const required = t("checkout.errorRequired")

        if (!formData.email) newErrors.email = required
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t("checkout.errorEmail")
        }

        if (!formData.firstName) newErrors.firstName = required
        if (!formData.lastName) newErrors.lastName = required
        if (!formData.phone) newErrors.phone = required
        if (!formData.address1) newErrors.address1 = required
        if (!formData.city) newErrors.city = required
        if (!formData.postalCode) newErrors.postalCode = required
        if (!formData.region) newErrors.region = t("checkout.errorRegion")
        if (!formData.acceptTerms) newErrors.acceptTerms = t("checkout.errorTerms")

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
                paymentMethod,
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
                throw new Error(result.message || "Erreur lors de la création de la commande")
            }

            if (!result.success) {
                throw new Error(result.message || "Erreur lors de la création de la commande")
            }

            // Clear cart on success
            clearCart()

            if (paymentMethod === "card") {
                // Afficher le formulaire CB en restant sur la page
                setCreatedOrder({
                    orderId: result.data.orderId,
                    orderNumber: result.data.orderNumber,
                })
                window.scrollTo({ top: 0, behavior: "smooth" })
            } else {
                // Virement bancaire : flux existant
                router.push(`/commande/${result.data.orderNumber}`)
            }
        } catch (error) {
            console.error("Erreur lors de la création de la commande:", error)
            setErrors({ submit: error.message || t("checkout.submitError") })
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat(t.tag, {
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
                                    <span>{t('checkout.backToCart')}</span>
                                </motion.button>
                            </Link>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('checkout.title')}</h1>
                        <p className="text-gray-600">Remplissez vos informations pour obtenir votre devis personnalisé</p>
                    </div>

                    {createdOrder && paymentMethod === "card" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                                <CreditCard className="w-4 h-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">{t('checkout.cardTitle')}</h2>
                                                <p className="text-sm text-gray-500">
                                                    {t('checkout.orderNumberLabel', { orderNumber: createdOrder.orderNumber })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <CreditCardForm
                                        orderId={createdOrder.orderId}
                                        onError={(msg) => setErrors({ submit: msg })}
                                        onSuccess={() => router.push(`/commande/${createdOrder.orderNumber}`)}
                                    />
                                </motion.div>
                            </div>

                            {/* Résumé compact */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('checkout.amountDue')}</h2>
                                    <div className="flex justify-between text-2xl font-bold text-amber-700">
                                        <span>{t('cart.total')}</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-500">
                                        {t('checkout.cardHint')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
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
                                        <h2 className="text-lg font-semibold text-gray-900">{t('checkout.contactSection')}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            type="email"
                                            label={t('checkout.email')}
                                            placeholder={t('checkout.emailPlaceholder')}
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            error={errors.email}
                                            required
                                        />
                                        <Input
                                            type="tel"
                                            label={t('checkout.phone')}
                                            placeholder={t('checkout.phonePlaceholder')}
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            error={errors.phone}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label={t('checkout.firstName')}
                                            placeholder={t('checkout.firstNamePlaceholder')}
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            error={errors.firstName}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label={t('checkout.lastName')}
                                            placeholder={t('checkout.lastNamePlaceholder')}
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                            error={errors.lastName}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label={`${t('checkout.company')} (${t('common.optional')})`}
                                            placeholder={t('checkout.companyPlaceholder')}
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
                                        <h2 className="text-lg font-semibold text-gray-900">{t('checkout.shippingSection')}</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <Input
                                            type="text"
                                            label={t('checkout.street')}
                                            placeholder={t('checkout.streetPlaceholder')}
                                            value={formData.address1}
                                            onChange={(e) => handleInputChange("address1", e.target.value)}
                                            error={errors.address1}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label={`${t('checkout.addressLine2')} (${t('common.optional')})`}
                                            placeholder={t('checkout.addressLine2Placeholder')}
                                            value={formData.address2}
                                            onChange={(e) => handleInputChange("address2", e.target.value)}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <Input
                                                type="text"
                                                label={t('checkout.postalCode')}
                                                placeholder={t('checkout.postalCodePlaceholder')}
                                                value={formData.postalCode}
                                                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                                error={errors.postalCode}
                                                required
                                            />
                                            <Input
                                                type="text"
                                                label={t('checkout.city')}
                                                placeholder={t('checkout.cityPlaceholder')}
                                                value={formData.city}
                                                onChange={(e) => handleInputChange("city", e.target.value)}
                                                error={errors.city}
                                                required
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t('checkout.country')} <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={formData.country}
                                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                                                >
                                                    {availableCountries.map((country) => (
                                                        <option key={country} value={country}>
                                                            {t(`countries.${country}`)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('checkout.region')} <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.region}
                                                onChange={(e) => handleInputChange("region", e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 ${errors.region ? "border-red-500" : "border-gray-300"
                                                    }`}
                                            >
                                                <option value="">{t('checkout.regionPlaceholder')}</option>
                                                {availableRegions.map((region) => (
                                                    <option key={region.name} value={region.name}>
                                                        {t(`regions.${region.name}`)} — {subtotal >= freeShippingThreshold ? t('common.free') : formatPrice(region.cost)}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
                                            <p className="mt-2 text-sm text-gray-500">
                                                {t('checkout.regionHint')}
                                            </p>
                                        </div>
                                        <Input
                                            type="text"
                                            label={`${t('checkout.notes')} (${t('common.optional')})`}
                                            placeholder={t('checkout.notesPlaceholder')}
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
                                        <h2 className="text-lg font-semibold text-gray-900">{t('checkout.paymentSection')}</h2>
                                    </div>

                                    <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />
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
                                                {t('checkout.termsBefore')}{" "}
                                                <Link href="/cgv" className="text-amber-600 hover:text-amber-700 underline">
                                                    {t('checkout.termsLink')}
                                                </Link>{" "}
                                                {t('checkout.termsBetween')}{" "}
                                                <Link href="/politique-confidentialite" className="text-amber-600 hover:text-amber-700 underline">
                                                    {t('checkout.privacyLink')}
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
                                                {`${t('checkout.acceptNewsletter')} (${t('common.optional')})`}
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
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('checkout.summarySection')}</h2>

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
                                            <span>{t('cart.subtotal')}</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>{t('cart.shipping')}</span>
                                            <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                                                {shippingCost === 0 ? t('common.free') : formatPrice(shippingCost)}
                                            </span>
                                        </div>
                                        {subtotal < freeShippingThreshold && (
                                            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                                                <p className="font-medium">{t('checkout.freeShippingFrom', { amount: formatPrice(freeShippingThreshold) })}</p>
                                                <p>{t('checkout.freeShippingRemaining', { amount: formatPrice(freeShippingThreshold - subtotal) })}</p>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-100 pt-3">
                                            <div className="flex justify-between text-lg font-semibold text-gray-900">
                                                <span>{t('cart.total')}</span>
                                                <span>{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations livraison */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-center space-x-2 text-green-700 mb-2">
                                            <Truck className="w-5 h-5" />
                                            <span className="font-medium">{t('cart.shipping')}</span>
                                        </div>
                                        <p className="text-sm text-green-600">
                                            {t('checkout.leadTime')}
                                        </p>
                                    </div>

                                    {/* Bouton de commande */}
                                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
                                        {isSubmitting ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>{t('checkout.processing')}</span>
                                            </div>
                                        ) : paymentMethod === "card" ? (
                                            <>
                                                <CreditCard className="w-5 h-5 mr-2" />
                                                {t('checkout.continueToPayment')}
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-5 h-5 mr-2" />
                                                {t('checkout.placeOrder')}
                                            </>
                                        )}
                                    </Button>

                                    {/* Garanties */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-green-500" />
                                                <span>{t('checkout.securePayment')}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-green-500" />
                                                <span>{t('checkout.satisfaction')}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-green-500" />
                                                <span>{t('checkout.writtenSupport')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </form>
                    )}
                </div>
            </motion.main>

            <Footer />
        </div>
    )
}