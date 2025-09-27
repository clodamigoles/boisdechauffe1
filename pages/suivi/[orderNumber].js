import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout/Layout'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

const CheckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
)

const ClockIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const TruckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const UploadIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
)

const statusConfig = {
    pending: { label: 'En attente', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    payment_pending: { label: 'En attente de paiement', color: 'text-orange-600', bg: 'bg-orange-100' },
    payment_uploaded: { label: 'Justificatif reçu', color: 'text-blue-600', bg: 'bg-blue-100' },
    confirmed: { label: 'Confirmée', color: 'text-green-600', bg: 'bg-green-100' },
    shipped: { label: 'Expédiée', color: 'text-purple-600', bg: 'bg-purple-100' },
    delivered: { label: 'Livrée', color: 'text-green-700', bg: 'bg-green-200' }
}

const timelineSteps = [
    { id: 'pending', label: 'Commande créée', icon: '📝' },
    { id: 'payment_pending', label: 'En attente de paiement', icon: '💳' },
    { id: 'confirmed', label: 'Paiement confirmé', icon: '✅' },
    { id: 'shipped', label: 'Expédiée', icon: '🚚' },
    { id: 'delivered', label: 'Livrée', icon: '📦' }
]

export default function OrderTrackingPage() {
    const router = useRouter()
    const { orderNumber } = router.query
    const [order, setOrder] = useState(null)
    const [settings, setSettings] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)

    // Récupérer les détails de la commande
    useEffect(() => {
        if (orderNumber) {
            fetchOrder()
            fetchSettings()
        }
    }, [orderNumber])

    const fetchOrder = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/orders/${orderNumber}`)
            if (response.ok) {
                const data = await response.json()
                setOrder(data.data)
            } else {
                toast.error('Commande introuvable')
                router.push('/')
            }
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement de la commande')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings/all')
            if (response.ok) {
                const data = await response.json()
                setSettings(data)
            }
        } catch (error) {
            console.error('Erreur paramètres:', error)
        }
    }

    // Configuration du dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        onDrop: handleFileUpload,
        disabled: isUploading || order?.status === 'confirmed' || order?.status === 'shipped' || order?.status === 'delivered'
    })

    async function handleFileUpload(acceptedFiles) {
        if (acceptedFiles.length === 0) return

        setIsUploading(true)
        const formData = new FormData()

        acceptedFiles.forEach(file => {
            formData.append('files', file)
        })

        try {
            const response = await fetch(`/api/orders/${orderNumber}/upload`, {
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                const result = await response.json()
                toast.success(`${acceptedFiles.length} fichier(s) uploadé(s) avec succès`)
                await fetchOrder() // Recharger les données
            } else {
                const error = await response.json()
                toast.error(error.message || 'Erreur lors de l\'upload')
            }
        } catch (error) {
            console.error('Erreur upload:', error)
            toast.error('Erreur lors de l\'upload')
        } finally {
            setIsUploading(false)
        }
    }

    const getStepStatus = (stepId) => {
        if (!order) return 'pending'

        const stepOrder = ['pending', 'payment_pending', 'confirmed', 'shipped', 'delivered']
        const currentIndex = stepOrder.indexOf(order.status)
        const stepIndex = stepOrder.indexOf(stepId)

        if (stepIndex <= currentIndex) return 'completed'
        if (stepIndex === currentIndex + 1) return 'current'
        return 'upcoming'
    }

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="spinner"></div>
                </div>
            </Layout>
        )
    }

    if (!order) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-heading mb-4">Commande introuvable</h1>
                        <Link href="/">
                            <button className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                                Retour à l'accueil
                            </button>
                        </Link>
                    </div>
                </div>
            </Layout>
        )
    }

    const currentStatus = statusConfig[order.status] || statusConfig.pending

    return (
        <Layout>
            <Head>
                <title>Suivi commande #{order.orderNumber} | BoisChauffage Pro</title>
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="container-custom py-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-3xl font-heading text-gray-800 mb-2">
                                        Commande #{order.orderNumber}
                                    </h1>
                                    <p className="text-gray-600">
                                        Commandée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>

                                <div className="mt-4 md:mt-0">
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${currentStatus.bg} ${currentStatus.color}`}>
                                        {currentStatus.label}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="container-custom py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Timeline */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                            >
                                <h2 className="text-xl font-heading text-gray-800 mb-6">
                                    Suivi de votre commande
                                </h2>

                                <div className="space-y-8">
                                    {timelineSteps.map((step, index) => {
                                        const status = getStepStatus(step.id)
                                        return (
                                            <motion.div
                                                key={step.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center"
                                            >
                                                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${status === 'completed'
                                                        ? 'bg-green-500 text-white'
                                                        : status === 'current'
                                                            ? 'bg-primary-500 text-white'
                                                            : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                    {status === 'completed' ? (
                                                        <CheckIcon />
                                                    ) : status === 'current' ? (
                                                        <ClockIcon />
                                                    ) : (
                                                        <span className="text-xl">{step.icon}</span>
                                                    )}
                                                </div>

                                                <div className="ml-4 flex-1">
                                                    <p className={`font-medium ${status === 'completed' || status === 'current'
                                                            ? 'text-gray-800'
                                                            : 'text-gray-500'
                                                        }`}>
                                                        {step.label}
                                                    </p>
                                                    {status === 'current' && (
                                                        <p className="text-sm text-gray-600">En cours...</p>
                                                    )}
                                                </div>

                                                {index < timelineSteps.length - 1 && (
                                                    <div className={`absolute left-6 mt-12 w-0.5 h-8 ${status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                                                        }`} />
                                                )}
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </motion.div>

                            {/* Upload justificatifs */}
                            {(order.status === 'payment_pending' || order.status === 'payment_uploaded') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                                >
                                    <h2 className="text-xl font-heading text-gray-800 mb-4">
                                        Justificatif de paiement
                                    </h2>

                                    <div className="mb-6">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h3 className="font-medium text-blue-800 mb-2">
                                                💳 Informations bancaires
                                            </h3>
                                            <div className="text-sm text-blue-700 space-y-1">
                                                <p><strong>Banque :</strong> {settings.bank_name}</p>
                                                <p><strong>IBAN :</strong> {settings.bank_iban}</p>
                                                <p><strong>BIC :</strong> {settings.bank_bic}</p>
                                                <p><strong>Montant :</strong> {order.total.toFixed(2)}€</p>
                                                <p><strong>Référence :</strong> {order.orderNumber}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Zone d'upload */}
                                    <div
                                        {...getRootProps()}
                                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${isDragActive
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                                            } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input {...getInputProps()} />
                                        <UploadIcon className="mx-auto text-gray-400 mb-4" />
                                        <p className="text-lg font-medium text-gray-700 mb-2">
                                            {isDragActive
                                                ? 'Déposez vos fichiers ici'
                                                : 'Glissez vos justificatifs ici ou cliquez pour sélectionner'
                                            }
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            PDF, JPG, PNG - Max 5MB par fichier
                                        </p>
                                        {isUploading && (
                                            <div className="mt-4">
                                                <div className="spinner mx-auto"></div>
                                                <p className="text-sm text-gray-600 mt-2">Upload en cours...</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Fichiers uploadés */}
                                    {order.paymentProofs?.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="font-medium text-gray-800 mb-3">
                                                Fichiers envoyés ({order.paymentProofs.length})
                                            </h3>
                                            <div className="space-y-2">
                                                {order.paymentProofs.map((proof, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-green-600">✅</span>
                                                            <span className="text-sm font-medium text-green-800">
                                                                {proof.filename}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-green-600">
                                                            {new Date(proof.uploadedAt).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Résumé commande */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                            >
                                <h3 className="text-lg font-heading text-gray-800 mb-4">
                                    Résumé de la commande
                                </h3>

                                <div className="space-y-3 mb-6">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-wood-100 rounded-lg flex items-center justify-center">
                                                {item.productImage ? (
                                                    <img
                                                        src={item.productImage}
                                                        alt={item.productName}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <span className="text-xl">🪵</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {item.productName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.quantity} × {item.price}€
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {item.subtotal.toFixed(2)}€
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Sous-total</span>
                                        <span>{order.subtotal.toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Livraison</span>
                                        <span>{order.shippingCost === 0 ? 'Gratuite' : `${order.shippingCost.toFixed(2)}€`}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>TVA</span>
                                        <span>{order.tax.toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                        <span>Total</span>
                                        <span className="text-primary-600">{order.total.toFixed(2)}€</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Adresse de livraison */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                            >
                                <h3 className="text-lg font-heading text-gray-800 mb-4">
                                    📦 Adresse de livraison
                                </h3>
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium text-gray-800">
                                        {order.customer.firstName} {order.customer.lastName}
                                    </p>
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.zipCode} {order.shippingAddress.city}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                                {order.deliveryInstructions && (
                                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        <p className="text-xs font-medium text-yellow-800">Instructions :</p>
                                        <p className="text-xs text-yellow-700">{order.deliveryInstructions}</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Dates importantes */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <h3 className="text-lg font-heading text-gray-800 mb-4">
                                    📅 Dates importantes
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Commande créée</span>
                                        <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                                    </div>

                                    {order.paymentDueDate && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Échéance paiement</span>
                                            <span className={`font-medium ${new Date(order.paymentDueDate) < new Date() && order.status === 'payment_pending'
                                                    ? 'text-red-600'
                                                    : 'text-gray-800'
                                                }`}>
                                                {new Date(order.paymentDueDate).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    )}

                                    {order.estimatedDelivery && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Livraison estimée</span>
                                            <span className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    )}

                                    {order.shippedAt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Expédiée le</span>
                                            <span className="font-medium text-green-600">{new Date(order.shippedAt).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    )}

                                    {order.deliveredAt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Livrée le</span>
                                            <span className="font-medium text-green-600">{new Date(order.deliveredAt).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}