"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { motion } from "framer-motion"
import Link from "next/link"
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    Calendar,
    Headphones,
    FileText,
    Users,
    Truck
} from "lucide-react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { pageVariants, containerVariants, itemVariants } from "../utils/animations"
import { useSettings } from "@/hooks/useSettings"
import { useTranslation } from "@/lib/useTranslation"
import { loadTranslations } from "@/lib/i18n-server"

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
}

export default function ContactPage() {
    const { t } = useTranslation('contact')
    const { contactEmail, fullAddress, contactPhone, whatsappLink } = useSettings()
    const [isLoading, setIsLoading] = useState(true)
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

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600)
        return () => clearTimeout(timer)
    }, [])

    const contactMethods = [
        {
            icon: Phone,
            title: t('contactMethods.methods.phone.title'),
            description: t('contactMethods.methods.phone.description'),
            value: contactPhone,
            availability: t('contactMethods.methods.phone.availability'),
            href: whatsappLink,
            color: "bg-green-500",
            urgent: true
        },
        {
            icon: Mail,
            title: t('contactMethods.methods.email.title'),
            description: t('contactMethods.methods.email.description'),
            value: contactEmail,
            availability: t('contactMethods.methods.email.availability'),
            href: `mailto:${contactEmail}`,
            color: "bg-blue-500",
            urgent: false
        },
        {
            icon: MessageSquare,
            title: t('contactMethods.methods.chat.title'),
            description: t('contactMethods.methods.chat.description'),
            value: t('contactMethods.methods.chat.value'),
            availability: t('contactMethods.methods.chat.availability'),
            href: "#",
            color: "bg-purple-500",
            urgent: true
        },
        {
            icon: Calendar,
            title: t('contactMethods.methods.appointment.title'),
            description: t('contactMethods.methods.appointment.description'),
            value: t('contactMethods.methods.appointment.value'),
            availability: t('contactMethods.methods.appointment.availability'),
            href: "#",
            color: "bg-orange-500",
            urgent: false
        }
    ]

    const subjects = [
        {
            id: "devis",
            label: t('form.subjects.quote.label'),
            icon: FileText,
            description: t('form.subjects.quote.description')
        },
        {
            id: "livraison",
            label: t('form.subjects.delivery.label'),
            icon: Truck,
            description: t('form.subjects.delivery.description')
        },
        {
            id: "produits",
            label: t('form.subjects.products.label'),
            icon: Users,
            description: t('form.subjects.products.description')
        },
        {
            id: "commande",
            label: t('form.subjects.order.label'),
            icon: CheckCircle,
            description: t('form.subjects.order.description')
        },
        {
            id: "support",
            label: t('form.subjects.support.label'),
            icon: Headphones,
            description: t('form.subjects.support.description')
        },
        {
            id: "autre",
            label: t('form.subjects.other.label'),
            icon: MessageSquare,
            description: t('form.subjects.other.description')
        }
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
        if (!formData.firstName.trim()) newErrors.firstName = t('validation.firstNameRequired')
        if (!formData.lastName.trim()) newErrors.lastName = t('validation.lastNameRequired')

        if (!formData.email.trim()) {
            newErrors.email = t('validation.emailRequired')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('validation.emailInvalid')
        }

        if (!formData.phone.trim()) {
            newErrors.phone = t('validation.phoneRequired')
        } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone)) {
            newErrors.phone = t('validation.phoneInvalid')
        }

        if (!formData.subject.trim()) newErrors.subject = t('validation.subjectRequired')
        if (!formData.message.trim()) newErrors.message = t('validation.messageRequired')
        if (formData.message.trim().length < 10) newErrors.message = t('validation.messageTooShort')
        if (!formData.acceptTerms) newErrors.acceptTerms = t('validation.acceptTermsRequired')

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
                throw new Error(result.message || t('validation.sendError'))
            }

            if (!result.success) {
                throw new Error(result.message || t('validation.sendError'))
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
            setErrors({ submit: error.message || t('validation.submitError') })
        } finally {
            setIsSubmitting(false)
        }
    }

    const teamMembers = [
        {
            name: "Jean-Pierre Dubois",
            role: "Responsable Commercial",
            phone: "01 23 45 67 90",
            email: "commercial@boischauffagepro.fr",
            speciality: "Devis et grands comptes",
            avatar: "/images/team/jean-pierre.jpg"
        },
        {
            name: "Marie Lefebvre",
            role: "Service Client",
            phone: "01 23 45 67 91",
            email: "service@boischauffagepro.fr",
            speciality: "Suivi commandes et SAV",
            avatar: "/images/team/marie.jpg"
        },
        {
            name: "Thomas Martin",
            role: "Responsable Livraisons",
            phone: "01 23 45 67 92",
            email: "livraison@boischauffagepro.fr",
            speciality: "Logistique et planning",
            avatar: "/images/team/thomas.jpg"
        }
    ]

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
            <Head>
                <title>{t('seo.title')}</title>
                <meta
                    name="description"
                    content={t('seo.description')}
                />
                <meta
                    name="keywords"
                    content={t('seo.keywords')}
                />
                <link rel="canonical" href="https://boischauffagepro.fr/contact" />

                {/* Open Graph */}
                <meta property="og:title" content={t('seo.title')} />
                <meta property="og:description" content={t('seo.description')} />
                <meta property="og:url" content="https://boischauffagepro.fr/contact" />

            </Head>

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
                                    {t('hero.badge')}
                                </motion.div>

                                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                    {t('hero.title')}
                                    <span className="block text-amber-400">
                                        {t('hero.titleHighlight')}
                                    </span>
                                </h1>

                                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                    {t('hero.subtitle')}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="flex items-center space-x-2 bg-white text-blue-700 hover:bg-gray-100"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>{t('hero.phoneButton', { phone: contactPhone })}</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        <span>{t('hero.appointmentButton')}</span>
                                    </Button>
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
                                    {t('contactMethods.title')}
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    {t('contactMethods.subtitle')}
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
                                            {method.urgent && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                        {t('contactMethods.urgentBadge')}
                                                    </span>
                                                </div>
                                            )}

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
                                                    {t('contactMethods.contactButton')}
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
                                                {t('form.title')}
                                            </h2>
                                            <p className="text-gray-600">
                                                {t('form.subtitle')}
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
                                                    {t('form.success.title')}
                                                </h3>
                                                <p className="text-gray-600 mb-6">
                                                    {t('form.success.message')}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setSubmitSuccess(false)}
                                                >
                                                    {t('form.success.button')}
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                {/* Informations personnelles */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                </div>

                                                <Input
                                                    type="text"
                                                    label={t('form.fields.company.label')}
                                                    placeholder={t('form.fields.company.placeholder')}
                                                    value={formData.company}
                                                    onChange={(e) => handleInputChange("company", e.target.value)}
                                                />

                                                {/* Sujet de la demande */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        {t('form.fields.subject.label')} <span className="text-red-500">*</span>
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
                                                        {t('form.fields.message.label')} <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        rows={5}
                                                        placeholder={t('form.fields.message.placeholder')}
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
                                                            {t('form.fields.message.charCount', { count: formData.message.length })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Préférences */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {t('form.fields.preferredContact.label')}
                                                        </label>
                                                        <select
                                                            value={formData.preferredContact}
                                                            onChange={(e) => handleInputChange("preferredContact", e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                                                        >
                                                            <option value="email">{t('form.fields.preferredContact.options.email')}</option>
                                                            <option value="phone">{t('form.fields.preferredContact.options.phone')}</option>
                                                            <option value="both">{t('form.fields.preferredContact.options.both')}</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {t('form.fields.urgency.label')}
                                                        </label>
                                                        <select
                                                            value={formData.urgency}
                                                            onChange={(e) => handleInputChange("urgency", e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                                                        >
                                                            <option value="normal">{t('form.fields.urgency.options.normal')}</option>
                                                            <option value="urgent">{t('form.fields.urgency.options.urgent')}</option>
                                                            <option value="low">{t('form.fields.urgency.options.low')}</option>
                                                        </select>
                                                    </div>
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
                                                            {t('form.terms.acceptData')}
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
                                                            {t('form.terms.newsletter')}
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
                                                            <span>{t('form.buttons.submitting')}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <Send className="w-5 h-5" />
                                                            <span>{t('form.buttons.submit')}</span>
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
                                            {t('info.title')}
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">{t('info.address.title')}</h4>
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
                                                    <h4 className="font-semibold text-gray-900 mb-1">{t('info.hours.title')}</h4>
                                                    <div className="text-gray-600 text-sm space-y-1">
                                                        <p>{t('info.hours.weekdays')}</p>
                                                        <p>{t('info.hours.saturday')}</p>
                                                        <p>{t('info.hours.sunday')}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Phone className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">{t('info.emergency.title')}</h4>
                                                    <p className="text-gray-600 text-sm">
                                                        {t('info.emergency.hotline')}<br />
                                                        {t('info.emergency.note')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-gray-100">
                                            <h4 className="font-semibold text-gray-900 mb-4">{t('info.responseTime.title')}</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    <span className="text-gray-600">{t('info.responseTime.email')}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                    <span className="text-gray-600">{t('info.responseTime.phone')}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                                    <span className="text-gray-600">{t('info.responseTime.chat')}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                                    <span className="text-gray-600">{t('info.responseTime.quote')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                            {t('faq.title')}
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900 text-sm">{t('faq.items.visit.question')}</h4>
                                                <p className="text-gray-600 text-sm mt-1">
                                                    {t('faq.items.visit.answer')}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 text-sm">{t('faq.items.quoteTime.question')}</h4>
                                                <p className="text-gray-600 text-sm mt-1">
                                                    {t('faq.items.quoteTime.answer')}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 text-sm">{t('faq.items.weekendDelivery.question')}</h4>
                                                <p className="text-gray-600 text-sm mt-1">
                                                    {t('faq.items.weekendDelivery.answer')}
                                                </p>
                                            </div>
                                        </div>
                                        <Link href="/faq" className="inline-flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium mt-4">
                                            {t('faq.seeAll')}
                                            <Send className="w-3 h-3 ml-1" />
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
                                    {t('cta.title')}
                                </h2>
                                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                    {t('cta.subtitle')}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>{t('cta.phoneButton', { phone: contactPhone })}</span>
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
                                        <h3 className="font-semibold mb-2">{t('cta.features.fastResponse.title')}</h3>
                                        <p className="text-gray-400 text-sm">{t('cta.features.fastResponse.description')}</p>
                                    </div>

                                    <div>
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-6 h-6 text-amber-400" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{t('cta.features.expertTeam.title')}</h3>
                                        <p className="text-gray-400 text-sm">{t('cta.features.expertTeam.description')}</p>
                                    </div>

                                    <div>
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-6 h-6 text-amber-400" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{t('cta.features.guarantee.title')}</h3>
                                        <p className="text-gray-400 text-sm">{t('cta.features.guarantee.description')}</p>
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

export async function getServerSideProps({ locale }) {
    try {
        // Charger les traductions
        const translations = await loadTranslations(locale || 'en', ['common', 'contact'])
        
        return {
            props: {
                translations
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement des traductions:", error)
        
        const translations = await loadTranslations(locale || 'en', ['common', 'contact'])
        
        return {
            props: {
                translations
            }
        }
    }
}