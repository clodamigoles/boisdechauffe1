"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    Headphones,
    Mail,
    MapPin,
    MessageSquare,
    Package,
    Phone,
    Send,
    Truck,
    Users,
} from "lucide-react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/ActionButton"
import Input from "../components/ui/FormField"
import { pageVariants, containerVariants, itemVariants } from "../utils/animations"
import { useSettings } from "@/hooks/useSettings"
import SeoHead from "@/components/layout/SeoHead"
import { useT } from "@/lib/i18n"

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
}

export default function ContactPage() {
    const t = useT()
    const { contactEmail, fullAddress, contactPhone, whatsappLink } = useSettings()
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [errors, setErrors] = useState({})
    const [selectedSubject, setSelectedSubject] = useState("")

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
        preferredContact: "email",
        urgency: "normal",
        acceptNewsletter: false,
        acceptTerms: false
    })


    /**
     * Les moyens de contact qui existent réellement.
     *
     * Il y en avait quatre : le téléphone, l'e-mail, un « chat en ligne
     * disponible lundi-vendredi 9h-18h » et une « prise de rendez-vous » —
     * les deux derniers pointant vers `href: "#"`, c'est-à-dire nulle part.
     * Un visiteur qui clique dessus reste sur la page.
     *
     * Restent les deux qui aboutissent. Les horaires et le délai de réponse
     * sont ceux annoncés partout ailleurs sur le site.
     */
    const contactMethods = [
        {
            icon: Phone,
            title: t("contact.methodPhone"),
            description: t("contact.methodPhoneText"),
            value: contactPhone,
            availability: t("contact.hoursValue"),
            href: whatsappLink || `tel:${contactPhone}`,
            color: "bg-green-500",
        },
        {
            icon: Mail,
            title: t("contact.methodEmail"),
            description: t("contact.methodEmailText"),
            value: contactEmail,
            availability: t("contact.responseTime"),
            href: `mailto:${contactEmail}`,
            color: "bg-blue-500",
        },
    ]

    const subjects = [
        { id: "devis", label: t("contact.subjectQuote"), icon: FileText, description: t("contact.subjectQuoteText") },
        { id: "livraison", label: t("contact.subjectDelivery"), icon: Truck, description: t("contact.subjectDeliveryText") },
        { id: "produits", label: t("contact.subjectProducts"), icon: Package, description: t("contact.subjectProductsText") },
        { id: "commande", label: t("contact.subjectOrder"), icon: Clock, description: t("contact.subjectOrderText") },
        { id: "support", label: t("contact.subjectSupport"), icon: AlertCircle, description: t("contact.subjectSupportText") },
        { id: "autre", label: t("contact.subjectOther"), icon: MessageSquare, description: t("contact.subjectOtherText") },
    ]

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Validation des champs requis
        if (!formData.firstName.trim()) newErrors.firstName = t('contact.errorFirstName')
        if (!formData.lastName.trim()) newErrors.lastName = t('contact.errorLastName')

        if (!formData.email.trim()) {
            newErrors.email = t('contact.errorEmailRequired')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('checkout.errorEmail')
        }

        if (!formData.phone.trim()) {
            newErrors.phone = t('contact.errorPhoneRequired')
        } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone)) {
            newErrors.phone = t('checkout.errorPhone')
        }

        if (!formData.subject.trim()) newErrors.subject = t('contact.errorSubject')
        if (!formData.message.trim()) newErrors.message = t('contact.errorMessage')
        if (formData.message.trim().length < 10) newErrors.message = t('contact.errorMessageShort')
        if (!formData.acceptTerms) newErrors.acceptTerms = t('contact.errorAccept')

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    source: 'contact_page',
                    metadata: {
                        userAgent: navigator.userAgent,
                        timestamp: new Date().toISOString(),
                        url: window.location.href
                    }
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || t('contact.error'))
            }

            if (!result.success) {
                throw new Error(result.message || t('contact.error'))
            }

            // Succès
            setSubmitSuccess(true)

            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                company: "",
                subject: "",
                message: "",
                preferredContact: "email",
                urgency: "normal",
                acceptNewsletter: false,
                acceptTerms: false
            })
            setSelectedSubject("")

            // Reset success state after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 8000)

        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error)
            setErrors({ submit: error.message || t('common.genericError') })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Ici vivaient trois « membres de l'équipe » — nom, rôle, numéro direct,
    // adresse @boischauffagepro.fr et photo dans `/images/team/`. Aucune de ces
    // personnes n'est nommée ailleurs sur le site, aucun de ces numéros ne
    // figure dans les paramètres, et le dossier de photos n'existe pas. Le
    // bloc n'était d'ailleurs rendu nulle part. Les vraies coordonnées, celles
    // de l'administration, sont plus bas.

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
                title={t('meta.contactTitle')}
                description={t('meta.contactDescription')}
            />

            <div className="min-h-screen bg-gray-50">
                <Header />

                {/* <motion.main
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="pt-20"
                > */}
                    {/* Hero Section */}
                    <section className="bg-gray-800 text-white py-20">
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
                                    <Headphones className="w-4 h-4 mr-2" />
                                    {t('contact.badge')}
                                </motion.div>

                                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                    {t('contact.title')}
                                    <span className="block text-amber-400">
                                        {t('contact.titleAccent')}
                                    </span>
                                </h1>

                                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                    {t('contact.heroSubtitle')}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="flex items-center space-x-2 bg-white text-blue-700 hover:bg-gray-100"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>{contactPhone}</span>
                                    </Button>

                                    {/* Un bouton « Prendre RDV » se trouvait ici. Il n'ouvrait
                                        rien : aucun système de rendez-vous n'existe. */}
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Méthodes de Contact */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                variants={containerVariants}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    {t('contact.methodsTitle')}
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    {t('contact.methodsIntro')}
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {contactMethods.map((method, index) => {
                                    const IconComponent = method.icon
                                    return (
                                        <motion.div
                                            key={method.title}
                                            variants={itemVariants}
                                            custom={index}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center relative overflow-hidden"
                                        >
                                            <div className={`w-14 h-14 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                                <IconComponent className="w-7 h-7 text-white" />
                                            </div>

                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {method.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3">
                                                {method.description}
                                            </p>

                                            <div className="mb-4">
                                                <p className="font-medium text-gray-900">{method.value}</p>
                                                <p className="text-xs text-gray-500 mt-1">{method.availability}</p>
                                            </div>

                                            <Link href={method.href}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full bg-transparent hover:bg-gray-50"
                                                >
                                                    {t('contact.reach')}
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Formulaire de Contact */}
                    <section className="py-16 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Formulaire */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                                {t('contact.formTitle')}
                                            </h2>
                                            <p className="text-gray-600">
                                                {t('contact.formIntro')}
                                            </p>
                                        </div>

                                        {submitSuccess ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-12"
                                            >
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                    {t('contact.success')}
                                                </h3>
                                                <p className="text-gray-600 mb-6">
                                                    {t('contact.responseTime')}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setSubmitSuccess(false)}
                                                >
                                                    {t('contact.sendAnother')}
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                {/* Informations personnelles */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Input
                                                        type="text"
                                                        label={t('contact.firstName')}
                                                        placeholder={t('contact.firstNamePlaceholder')}
                                                        value={formData.firstName}
                                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                        error={errors.firstName}
                                                        required
                                                    />
                                                    <Input
                                                        type="text"
                                                        label={t('contact.lastName')}
                                                        placeholder={t('contact.lastNamePlaceholder')}
                                                        value={formData.lastName}
                                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                        error={errors.lastName}
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Input
                                                        type="email"
                                                        label={t('contact.email')}
                                                        placeholder={t('contact.emailPlaceholder')}
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                                        error={errors.email}
                                                        required
                                                    />
                                                    <Input
                                                        type="tel"
                                                        label={t('contact.phone')}
                                                        placeholder="06 12 34 56 78"
                                                        value={formData.phone}
                                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                                        error={errors.phone}
                                                        required
                                                    />
                                                </div>

                                                <Input
                                                    type="text"
                                                    label={`${t('contact.company')} (${t('common.optional')})`}
                                                    placeholder={t('contact.companyPlaceholder')}
                                                    value={formData.company}
                                                    onChange={(e) => handleInputChange("company", e.target.value)}
                                                />

                                                {/* Sujet de la demande */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        {t('contact.subjectSection')} <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {subjects.map((subject) => {
                                                            const IconComponent = subject.icon
                                                            const isSelected = formData.subject === subject.id
                                                            return (
                                                                <motion.label
                                                                    key={subject.id}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                                                            ? 'border-amber-500 bg-amber-50'
                                                                            : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                                                                        }`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name="subject"
                                                                        value={subject.id}
                                                                        checked={isSelected}
                                                                        onChange={(e) => handleInputChange("subject", e.target.value)}
                                                                        className="sr-only"
                                                                    />
                                                                    <IconComponent className={`w-5 h-5 mt-1 ${isSelected ? 'text-amber-600' : 'text-gray-400'
                                                                        }`} />
                                                                    <div className="flex-1">
                                                                        <div className={`font-medium text-sm ${isSelected ? 'text-amber-900' : 'text-gray-900'
                                                                            }`}>
                                                                            {subject.label}
                                                                        </div>
                                                                        <div className="text-xs text-gray-600 mt-1">
                                                                            {subject.description}
                                                                        </div>
                                                                    </div>
                                                                </motion.label>
                                                            )
                                                        })}
                                                    </div>
                                                    {errors.subject && (
                                                        <p className="text-sm text-red-600 mt-2">{errors.subject}</p>
                                                    )}
                                                </div>

                                                {/* Message */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('contact.message')} <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        rows={5}
                                                        placeholder={t('contact.messagePlaceholder')}
                                                        value={formData.message}
                                                        onChange={(e) => handleInputChange("message", e.target.value)}
                                                        className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-200 ${errors.message
                                                                ? 'border-red-300 focus:border-red-500 bg-red-50'
                                                                : 'border-gray-300 focus:border-amber-500 hover:border-gray-400'
                                                            }`}
                                                    />
                                                    <div className="flex justify-between items-center mt-2">
                                                        {errors.message && (
                                                            <p className="text-sm text-red-600">{errors.message}</p>
                                                        )}
                                                        <p className="text-xs text-gray-500 ml-auto">
                                                            {t('common.charCount', { count: formData.message.length, max: 500 })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Préférences */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {t('contact.preferredContact')}
                                                        </label>
                                                        <select
                                                            value={formData.preferredContact}
                                                            onChange={(e) => handleInputChange("preferredContact", e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                                                        >
                                                            <option value="email">{t('contact.contactByEmail')}</option>
                                                            <option value="phone">{t('contact.contactByPhone')}</option>
                                                            <option value="both">{t('contact.contactByBoth')}</option>
                                                        </select>
                                                    </div>
                                                    {/* Un sélecteur d'urgence occupait cette colonne : il
                                                        promettait une réponse « en 1 h », « en 2-4 h » ou
                                                        « en 24 h ». Aucun de ces délais n'est tenable, et le
                                                        champ n'était lu nulle part côté traitement. Le délai
                                                        réel est annoncé sous le formulaire. */}
                                                </div>

                                                {/* Conditions */}
                                                <div className="space-y-3">
                                                    <label className="flex items-start space-x-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.acceptTerms}
                                                            onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                                                            className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            {t('contact.acceptData')}
                                                            <span className="text-red-500 ml-1">*</span>
                                                        </span>
                                                    </label>
                                                    {errors.acceptTerms && (
                                                        <p className="text-sm text-red-600 ml-7">{errors.acceptTerms}</p>
                                                    )}

                                                    <label className="flex items-start space-x-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.acceptNewsletter}
                                                            onChange={(e) => handleInputChange("acceptNewsletter", e.target.checked)}
                                                            className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            {t('contact.acceptNewsletter')}
                                                        </span>
                                                    </label>
                                                </div>

                                                {/* Message d'erreur global */}
                                                {errors.submit && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3"
                                                    >
                                                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                                        <div className="text-red-700 text-sm">{errors.submit}</div>
                                                    </motion.div>
                                                )}

                                                {/* Bouton d'envoi */}
                                                <Button
                                                    type="submit"
                                                    variant="primary"
                                                    size="lg"
                                                    disabled={isSubmitting}
                                                    className="w-full"
                                                >
                                                    {isSubmitting ? (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            <span>{t('contact.sending')}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <Send className="w-5 h-5" />
                                                            <span>{t('contact.submit')}</span>
                                                        </div>
                                                    )}
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Informations de contact et équipe */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-8"
                                >
                                    {/* Informations pratiques */}
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                                            {t('contact.practicalTitle')}
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">{t('contact.address')}</h4>
                                                    <p className="text-gray-600 text-sm">
                                                        {fullAddress}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Clock className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">{t('contact.hours')}</h4>
                                                    <div className="text-gray-600 text-sm space-y-1">
                                                        {/* 8h-19h était annoncé ici, 7j/7 dans le tunnel de
                                                            commande, et 8h-17h nulle part alors que c'est
                                                            l'horaire réel. Un seul horaire, celui qu'on tient. */}
                                                        <p>{t('contact.hoursWeekdays')}</p>
                                                        <p>{t('contact.hoursSaturday')}</p>
                                                        <p>{t('contact.hoursSunday')}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Une « hotline 24h/7j » figurait ici, avec le numéro
                                                06 12 34 56 78 — qui n'est celui de personne. Le seul
                                                numéro du site est celui des paramètres, plus haut. */}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-gray-100">
                                            {/* Quatre délais étaient annoncés — dont « Chat : < 5 min »
                                                et « Devis : 24 h » pour des canaux qui n'existent pas.
                                                Un seul délai, celui qu'on tient. */}
                                            <h4 className="font-semibold text-gray-900 mb-4">{t('contact.responseTitle')}</h4>
                                            <p className="text-sm text-gray-600">{t('contact.responseTime')}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Trois questions étaient posées ici — visite de l'entrepôt
                                        sur rendez-vous, devis sous 24 h, livraison le samedi avec
                                        supplément — dont aucune ne correspond au fonctionnement du
                                        site. Le lien mène à la vraie FAQ. */}
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {t('contact.faqTitle')}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {t('meta.faqDescription')}
                                        </p>
                                        <Link href="/faq" className="text-sm font-semibold text-amber-700 hover:text-amber-800">
                                            {t('contact.faqCta')}
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Final */}
                    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                                    {t('contact.finalTitle')}
                                </h2>
                                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                    {t('contact.finalText')}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>{t('contact.whatsappCta', { phone: contactPhone })}</span>
                                    </Button>

                                    {/* <Link href="/devis">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="flex items-center space-x-2 text-white border-white/30 hover:bg-white/10"
                                        >
                                            <FileText className="w-5 h-5" />
                                            <span>Devis en Ligne</span>
                                        </Button>
                                    </Link> */}
                                </div>

                                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                    <div>
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Clock className="w-6 h-6 text-amber-400" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{t('contact.trustResponse')}</h3>
                                        <p className="text-gray-400 text-sm">{t('contact.trustResponseText')}</p>
                                    </div>

                                    <div>
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-6 h-6 text-amber-400" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{t('contact.trustWood')}</h3>
                                        <p className="text-gray-400 text-sm">{t('contact.trustWoodText')}</p>
                                    </div>

                                    <div>
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-6 h-6 text-amber-400" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{t('contact.trustPrice')}</h3>
                                        <p className="text-gray-400 text-sm">{t('contact.trustPriceText')}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                {/* </motion.main> */}

                <Footer />
            </div>
        </>
    )
}