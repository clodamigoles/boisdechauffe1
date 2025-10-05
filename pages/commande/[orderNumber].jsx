"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import Link from "next/link"
import { CheckCircle, Clock, MapPin, Mail, Phone, FileText, Download, ArrowLeft } from "lucide-react"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import Button from "../../components/ui/Button"
import PaymentReceiptUpload from "../../components/ui/PaymentReceiptUpload"

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

// Composant Skeleton pour les informations bancaires
const BankDetailsSkeleton = () => (
    <div className="bg-white rounded-lg p-4 mb-4 animate-pulse">
        <h3 className="font-medium text-gray-900 mb-3">Coordonnées bancaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                    <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
            ))}
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="h-4 bg-amber-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-amber-100 rounded w-full"></div>
        </div>
    </div>
)

export default function OrderTrackingPage() {
    const router = useRouter()
    const { orderNumber } = router.query
    const [orderData, setOrderData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const loadOrderData = async () => {
        if (!orderNumber) return

        try {
            setIsLoading(true)

            const response = await fetch(`/api/orders/${orderNumber}`)
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors du chargement de la commande")
            }

            if (!result.success) {
                throw new Error(result.message || "Commande introuvable")
            }

            // Transform the backend data to match the frontend format
            const transformedData = {
                orderNumber: result.data.orderNumber,
                status: result.data.status,
                paymentStatus: result.data.paymentStatus,
                createdAt: result.data.createdAt,
                customer: result.data.customer,
                shippingAddress: result.data.shippingAddress,
                items: result.data.items.map((item) => ({
                    id: item.product,
                    name: item.productSnapshot.name,
                    quantity: item.quantity,
                    price: item.unitPrice,
                    unit: "unité",
                    image: item.productSnapshot.image,
                })),
                totals: {
                    subtotal: result.data.subtotal,
                    shipping: result.data.shippingCost,
                    total: result.data.total,
                },
                paymentMethod: result.data.paymentMethod,
                notes: result.data.notes,
                bankDetails: result.data.bankDetails || null,
                timeline: generateTimeline(result.data.status, result.data.paymentStatus, result.data.statusHistory),
            }

            setOrderData(transformedData)
        } catch (error) {
            console.error("Erreur lors du chargement de la commande:", error)
            setOrderData(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadOrderData()
    }, [orderNumber])

    // Polling automatique si pas d'informations bancaires
    useEffect(() => {
        if (!orderNumber || !orderData) return

        const hasBankDetails = orderData?.bankDetails?.iban &&
            orderData?.bankDetails?.bic &&
            orderData?.bankDetails?.accountName

        if (hasBankDetails || orderData.paymentStatus !== "pending") return

        // Polling toutes les 30 secondes
        const interval = setInterval(() => {
            loadOrderData()
        }, 30000)

        return () => clearInterval(interval)
    }, [orderNumber, orderData?.bankDetails, orderData?.paymentStatus])

    const generateTimeline = (status, paymentStatus, statusHistory) => {
        const timeline = [
            {
                status: "order_placed",
                title: "Commande passée",
                description: "Votre commande a été enregistrée avec succès",
                date: statusHistory.find((h) => h.status === "pending")?.date || new Date().toISOString(),
                completed: true,
            },
            {
                status: "pending_payment",
                title: "En attente de paiement",
                description: "Effectuez le virement bancaire pour confirmer votre commande",
                date: null,
                completed: paymentStatus === "received",
                current: status === "pending" && paymentStatus === "pending",
            },
            {
                status: "payment_received",
                title: "Paiement reçu",
                description: "Votre paiement a été confirmé",
                date: statusHistory.find((h) => h.status === "confirmed")?.date || null,
                completed: paymentStatus === "received",
                current: status === "confirmed" && paymentStatus === "received",
            },
            {
                status: "preparing",
                title: "Préparation",
                description: "Votre commande est en cours de préparation",
                date: statusHistory.find((h) => h.status === "processing")?.date || null,
                completed: ["processing", "shipped", "delivered"].includes(status),
                current: status === "processing",
            },
            {
                status: "shipped",
                title: "Expédiée",
                description: "Votre commande est en route",
                date: statusHistory.find((h) => h.status === "shipped")?.date || null,
                completed: ["shipped", "delivered"].includes(status),
                current: status === "shipped",
            },
            {
                status: "delivered",
                title: "Livrée",
                description: "Votre commande a été livrée",
                date: statusHistory.find((h) => h.status === "delivered")?.date || null,
                completed: status === "delivered",
                current: status === "delivered",
            },
        ]

        return timeline
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price)
    }

    const formatDate = (dateString) => {
        if (!dateString) return null
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(dateString))
    }

    const getStatusIcon = (status, completed, current) => {
        if (completed) {
            return <CheckCircle className="w-6 h-6 text-green-500" />
        }
        if (current) {
            return <Clock className="w-6 h-6 text-amber-500" />
        }
        return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
    }

    const getStatusColor = (completed, current) => {
        if (completed) return "text-green-600"
        if (current) return "text-amber-600"
        return "text-gray-400"
    }

    const hasBankDetails = () => {
        return orderData?.bankDetails?.iban && orderData?.bankDetails?.bic && orderData?.bankDetails?.accountName
    }

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

    if (!orderData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande introuvable</h1>
                        <p className="text-gray-600 mb-8">Le numéro de commande {orderNumber} n'existe pas.</p>
                        <Link href="/shop">
                            <Button variant="primary">Retour à la boutique</Button>
                        </Link>
                    </div>
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <Link href="/shop">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span>Retour à la boutique</span>
                                </motion.button>
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande #{orderData.orderNumber}</h1>
                                    <p className="text-gray-600">Passée le {formatDate(orderData.createdAt)}</p>

                                    <div className="text-right" style={{ marginTop: 10 }}>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {orderData.status === "pending" ? "En attente de paiement" : orderData.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Suivi de commande */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Timeline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Suivi de commande</h2>

                                <div className="space-y-6">
                                    {orderData.timeline.map((step, index) => (
                                        <div key={step.status} className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">{getStatusIcon(step.status, step.completed, step.current)}</div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-medium ${getStatusColor(step.completed, step.current)}`}>{step.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                                {step.date && <p className="text-xs text-gray-500 mt-1">{formatDate(step.date)}</p>}
                                            </div>
                                            {index < orderData.timeline.length - 1 && (
                                                <div className="absolute left-3 mt-8 w-px h-6 bg-gray-200" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Informations de paiement */}
                            {orderData.paymentStatus === "pending" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-amber-50 border border-amber-200 rounded-xl p-6"
                                >
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-amber-900">Informations de paiement</h2>
                                    </div>

                                    {hasBankDetails() ? (
                                        <>
                                            <div className="bg-white rounded-lg p-4 mb-4">
                                                <h3 className="font-medium text-gray-900 mb-3">Coordonnées bancaires</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-600">IBAN :</span>
                                                        <p className="font-mono font-medium">{orderData.bankDetails.iban}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">BIC :</span>
                                                        <p className="font-mono font-medium">{orderData.bankDetails.bic}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Bénéficiaire :</span>
                                                        <p className="font-medium">{orderData.bankDetails.accountName}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Référence :</span>
                                                        <p className="font-mono font-medium text-amber-600">{orderData.orderNumber}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                                <h4 className="font-medium text-blue-900 mb-2">Instructions importantes</h4>
                                                <ul className="text-sm text-blue-800 space-y-1">
                                                    <li>
                                                        • Indiquez obligatoirement la référence <strong>{orderData.orderNumber}</strong> dans le
                                                        libellé
                                                    </li>
                                                    <li>
                                                        • Le montant exact à virer est de{" "}
                                                        <strong>
                                                            {formatPrice(
                                                                orderData.bankDetails.amountToPay !== null
                                                                    ? orderData.bankDetails.amountToPay
                                                                    : orderData.totals.total,
                                                            )}
                                                        </strong>
                                                    </li>
                                                    <li>• Votre commande sera traitée dès réception du paiement (1-2 jours ouvrés)</li>
                                                </ul>
                                            </div>

                                            <PaymentReceiptUpload
                                                orderNumber={orderData.orderNumber}
                                                onUploadSuccess={(receiptData) => {
                                                    console.log("Receipt uploaded:", receiptData)
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <BankDetailsSkeleton />
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start space-x-3">
                                                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <h4 className="font-medium text-blue-900 mb-1">
                                                            Informations bancaires en cours de préparation
                                                        </h4>
                                                        <p className="text-sm text-blue-800">
                                                            Nos équipes sont en train de préparer vos coordonnées bancaires personnalisées. Vous
                                                            recevrez un email dès qu'elles seront disponibles. Cela prend généralement quelques
                                                            minutes.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {/* Articles commandés */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Articles commandés</h2>

                                <div className="space-y-4">
                                    {orderData.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {item.quantity} × {formatPrice(item.price)} / {item.unit}
                                                </p>
                                            </div>
                                            <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Sous-total</span>
                                            <span>{formatPrice(orderData.totals.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Livraison</span>
                                            <span className="text-green-600 font-medium">
                                                {orderData.totals.shipping === 0 ? "Gratuite" : formatPrice(orderData.totals.shipping)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-100">
                                            <span>Total</span>
                                            <span>{formatPrice(orderData.totals.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Informations de contact et livraison */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Informations client */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            >
                                <h3 className="font-semibold text-gray-900 mb-4">Informations client</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{orderData.customer.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{orderData.customer.phone}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Adresse de livraison */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            >
                                <h3 className="font-semibold text-gray-900 mb-4">Adresse de livraison</h3>
                                <div className="flex items-start space-x-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p>
                                            {orderData.customer.firstName} {orderData.customer.lastName}
                                        </p>
                                        <p>{orderData.shippingAddress.street}</p>
                                        <p>
                                            {orderData.shippingAddress.postalCode} {orderData.shippingAddress.city}
                                        </p>
                                        <p>{orderData.shippingAddress.country}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.main>

            <Footer />
        </div>
    )
}