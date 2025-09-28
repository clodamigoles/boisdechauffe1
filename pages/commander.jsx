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
        instructions: "",

        // Acceptation des conditions
        acceptTerms: false,
        acceptNewsletter: false,
    })

    useEffect(() => {
        // Rediriger si le panier est vide
        if (items.length === 0) {
            router.push("/panier")
            return
        }

        const timer = setTimeout(() => setIsLoading(false), 100)
        return () => clearTimeout(timer)
    }, [items, router])

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
        if (!formData.email) newErrors.email = "Email requis"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format email invalide"
        }

        if (!formData.firstName) newErrors.firstName = "Prénom requis"
        if (!formData.lastName) newErrors.lastName = "Nom requis"
        if (!formData.phone) newErrors.phone = "Téléphone requis"
        if (!formData.address1) newErrors.address1 = "Adresse requise"
        if (!formData.city) newErrors.city = "Ville requise"
        if (!formData.postalCode) newErrors.postalCode = "Code postal requis"
        if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)

        try {
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
            }

            // Call the new API endpoint
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de la création de la commande")
            }

            if (!result.success) {
                throw new Error(result.message || "Erreur lors de la création de la commande")
            }

            // Clear cart on success
            clearCart()

            // Redirect to order tracking page
            router.push(`/commande/${result.data.orderNumber}`)
        } catch (error) {
            console.error("Erreur lors de la création de la commande:", error)
            setErrors({ submit: error.message || "Une erreur est survenue. Veuillez réessayer." })
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
    const shippingCost = subtotal >= 500 ? 0 : 15
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
                                    <span>Retour au panier</span>
                                </motion.button>
                            </Link>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Finaliser ma commande</h1>
                        <p className="text-gray-600">Remplissez vos informations pour obtenir votre devis personnalisé</p>
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
                                        <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            type="email"
                                            label="Email"
                                            placeholder="votre@email.com"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            error={errors.email}
                                            required
                                        />
                                        <Input
                                            type="tel"
                                            label="Téléphone"
                                            placeholder="06 12 34 56 78"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            error={errors.phone}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label="Prénom"
                                            placeholder="Jean"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            error={errors.firstName}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label="Nom"
                                            placeholder="Dupont"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                            error={errors.lastName}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label="Entreprise (optionnel)"
                                            placeholder="Nom de l'entreprise"
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
                                        <h2 className="text-lg font-semibold text-gray-900">Adresse de livraison</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <Input
                                            type="text"
                                            label="Adresse"
                                            placeholder="123 rue de la République"
                                            value={formData.address1}
                                            onChange={(e) => handleInputChange("address1", e.target.value)}
                                            error={errors.address1}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            label="Complément d'adresse (optionnel)"
                                            placeholder="Appartement, étage, bâtiment..."
                                            value={formData.address2}
                                            onChange={(e) => handleInputChange("address2", e.target.value)}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <Input
                                                type="text"
                                                label="Code postal"
                                                placeholder="75001"
                                                value={formData.postalCode}
                                                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                                error={errors.postalCode}
                                                required
                                            />
                                            <Input
                                                type="text"
                                                label="Ville"
                                                placeholder="Paris"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange("city", e.target.value)}
                                                error={errors.city}
                                                required
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Pays <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={formData.country}
                                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                                                >
                                                    <option value="France">France</option>
                                                    <option value="Belgique">Belgique</option>
                                                    <option value="Suisse">Suisse</option>
                                                    <option value="Luxembourg">Luxembourg</option>
                                                </select>
                                            </div>
                                        </div>
                                        <Input
                                            type="text"
                                            label="Instructions de livraison (optionnel)"
                                            placeholder="Laisser devant le garage, sonner chez le voisin..."
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
                                        <h2 className="text-lg font-semibold text-gray-900">Mode de paiement</h2>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-blue-900">Virement bancaire</h3>
                                                <p className="text-sm text-blue-700 mt-1">
                                                    Après validation de votre commande, vous recevrez les coordonnées bancaires par email
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
                                                J'accepte les{" "}
                                                <Link href="/conditions" className="text-amber-600 hover:text-amber-700 underline">
                                                    conditions générales de vente
                                                </Link>{" "}
                                                et la{" "}
                                                <Link href="/confidentialite" className="text-amber-600 hover:text-amber-700 underline">
                                                    politique de confidentialité
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
                                                Je souhaite recevoir les offres promotionnelles et actualités par email (optionnel)
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
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Résumé de commande</h2>

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
                                            <span>Sous-total</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Livraison</span>
                                            <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                                                {shippingCost === 0 ? "Gratuite" : formatPrice(shippingCost)}
                                            </span>
                                        </div>
                                        {subtotal < 500 && (
                                            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                                                <p className="font-medium">Livraison gratuite dès 500€</p>
                                                <p>Plus que {formatPrice(500 - subtotal)} pour en bénéficier !</p>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-100 pt-3">
                                            <div className="flex justify-between text-lg font-semibold text-gray-900">
                                                <span>Total</span>
                                                <span>{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations livraison */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-center space-x-2 text-green-700 mb-2">
                                            <Truck className="w-5 h-5" />
                                            <span className="font-medium">Livraison</span>
                                        </div>
                                        <p className="text-sm text-green-600">
                                            Livraison sous 5-7 jours ouvrés après réception du paiement
                                        </p>
                                    </div>

                                    {/* Bouton de commande */}
                                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
                                        {isSubmitting ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Traitement...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <FileText className="w-5 h-5 mr-2" />
                                                Placer ma commande
                                            </>
                                        )}
                                    </Button>

                                    {/* Garanties */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-green-500" />
                                                <span>Paiement sécurisé</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-green-500" />
                                                <span>Satisfaction garantie</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-green-500" />
                                                <span>Service client 7j/7</span>
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