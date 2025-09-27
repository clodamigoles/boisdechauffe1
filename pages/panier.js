import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Layout from '@/components/Layout/Layout'
import useCartStore from '@/lib/store/cartStore'
import toast from 'react-hot-toast'

// Validation schema avec Yup
const checkoutSchema = yup.object().shape({
    // Informations personnelles
    firstName: yup.string().required('Le prénom est requis'),
    lastName: yup.string().required('Le nom est requis'),
    email: yup.string().email('Email invalide').required('L\'email est requis'),
    phone: yup.string().required('Le téléphone est requis'),

    // Adresse de facturation
    billingStreet: yup.string().required('L\'adresse est requise'),
    billingCity: yup.string().required('La ville est requise'),
    billingZipCode: yup.string().required('Le code postal est requis'),
    billingCountry: yup.string().required('Le pays est requis'),

    // Adresse de livraison (conditionnelle)
    shippingStreet: yup.string().when('sameAsBilling', {
        is: false,
        then: yup.string().required('L\'adresse de livraison est requise'),
        otherwise: yup.string().notRequired()
    }),
    shippingCity: yup.string().when('sameAsBilling', {
        is: false,
        then: yup.string().required('La ville de livraison est requise'),
        otherwise: yup.string().notRequired()
    }),
    shippingZipCode: yup.string().when('sameAsBilling', {
        is: false,
        then: yup.string().required('Le code postal de livraison est requis'),
        otherwise: yup.string().notRequired()
    }),
    shippingCountry: yup.string().when('sameAsBilling', {
        is: false,
        then: yup.string().required('Le pays de livraison est requis'),
        otherwise: yup.string().notRequired()
    }),

    sameAsBilling: yup.boolean(),
    orderNotes: yup.string(),
    deliveryInstructions: yup.string()
})

const steps = [
    { id: 1, name: 'Panier', icon: '🛒' },
    { id: 2, name: 'Informations', icon: '📝' },
    { id: 3, name: 'Paiement', icon: '💳' },
    { id: 4, name: 'Confirmation', icon: '✅' }
]

export default function CartPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({})
    const [orderData, setOrderData] = useState(null)

    const {
        items,
        getSubtotal,
        getShippingCost,
        getTax,
        getTotal,
        getItemsCount,
        updateQuantity,
        removeItem,
        clearCart,
        validateCart,
        getOrderItems
    } = useCartStore()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(checkoutSchema),
        defaultValues: {
            sameAsBilling: true,
            billingCountry: 'France',
            shippingCountry: 'France'
        }
    })

    const sameAsBilling = watch('sameAsBilling')

    // Récupérer les paramètres
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings/all')
                if (response.ok) {
                    const data = await response.json()
                    setSettings(data)
                }
            } catch (error) {
                console.error('Erreur lors du chargement des paramètres:', error)
            }
        }

        fetchSettings()
    }, [])

    // Calculer les totaux
    const subtotal = getSubtotal()
    const shippingCost = getShippingCost(settings.freeShippingThreshold, settings.shippingCost)
    const tax = getTax(settings.taxRate)
    const total = getTotal(settings)
    const itemsCount = getItemsCount()

    // Validation du panier
    const cartValidation = validateCart(settings.min_order_amount)

    // Gérer la soumission du formulaire
    const onSubmit = async (data) => {
        if (currentStep === 2) {
            // Validation des informations client
            setCurrentStep(3)
            return
        }

        if (currentStep === 3) {
            // Création de la commande
            setIsLoading(true)

            try {
                const orderPayload = {
                    items: getOrderItems(),
                    customer: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone
                    },
                    billingAddress: {
                        street: data.billingStreet,
                        city: data.billingCity,
                        zipCode: data.billingZipCode,
                        country: data.billingCountry
                    },
                    shippingAddress: data.sameAsBilling ? {
                        street: data.billingStreet,
                        city: data.billingCity,
                        zipCode: data.billingZipCode,
                        country: data.billingCountry,
                        isSameAsBilling: true
                    } : {
                        street: data.shippingStreet,
                        city: data.shippingCity,
                        zipCode: data.shippingZipCode,
                        country: data.shippingCountry,
                        isSameAsBilling: false
                    },
                    subtotal,
                    shippingCost,
                    tax,
                    total,
                    orderNotes: data.orderNotes,
                    deliveryInstructions: data.deliveryInstructions
                }

                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderPayload)
                })

                if (response.ok) {
                    const result = await response.json()
                    setOrderData(result.data)
                    clearCart()
                    setCurrentStep(4)
                    toast.success('Commande créée avec succès !')
                } else {
                    const error = await response.json()
                    toast.error(error.message || 'Erreur lors de la création de la commande')
                }
            } catch (error) {
                console.error('Erreur:', error)
                toast.error('Erreur lors de la création de la commande')
            } finally {
                setIsLoading(false)
            }
        }
    }

    // Copier l'adresse de facturation vers la livraison
    useEffect(() => {
        if (sameAsBilling) {
            setValue('shippingStreet', watch('billingStreet'))
            setValue('shippingCity', watch('billingCity'))
            setValue('shippingZipCode', watch('billingZipCode'))
            setValue('shippingCountry', watch('billingCountry'))
        }
    }, [sameAsBilling, watch, setValue])

    // Si le panier est vide, rediriger
    if (items.length === 0 && currentStep < 4) {
        return (
            <Layout>
                <Head>
                    <title>Panier vide | BoisChauffage Pro</title>
                </Head>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="text-8xl mb-6">🛒</div>
                        <h1 className="text-3xl font-heading text-gray-800 mb-4">
                            Votre panier est vide
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Découvrez nos produits et ajoutez-les à votre panier
                        </p>
                        <Link href="/produits">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                Découvrir nos produits
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <Head>
                <title>
                    {currentStep === 1 && 'Panier'}
                    {currentStep === 2 && 'Informations de livraison'}
                    {currentStep === 3 && 'Paiement'}
                    {currentStep === 4 && 'Confirmation de commande'}
                    {' | BoisChauffage Pro'}
                </title>
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Header avec stepper */}
                <div className="bg-white border-b">
                    <div className="container-custom py-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-center"
                        >
                            <div className="flex items-center space-x-8">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="flex items-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold ${currentStep >= step.id
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-gray-200 text-gray-500'
                                                }`}
                                        >
                                            <span className="text-xl">{step.icon}</span>
                                        </motion.div>
                                        <div className="ml-3 hidden sm:block">
                                            <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                                                }`}>
                                                Étape {step.id}
                                            </p>
                                            <p className={`text-sm ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                                                }`}>
                                                {step.name}
                                            </p>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`hidden sm:block w-16 h-1 mx-4 ${currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="container-custom py-8">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Contenu principal */}
                            <div className="lg:col-span-2">
                                <AnimatePresence mode="wait">
                                    {/* Étape 1: Panier */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="cart"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-white rounded-2xl shadow-lg p-6"
                                        >
                                            <h2 className="text-2xl font-heading text-gray-800 mb-6">
                                                Votre panier ({itemsCount} article{itemsCount > 1 ? 's' : ''})
                                            </h2>

                                            {!cartValidation.isValid && (
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                                    <ul className="text-sm text-red-600 space-y-1">
                                                        {cartValidation.errors.map((error, index) => (
                                                            <li key={index}>⚠️ {error}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                {items.map((item) => (
                                                    <CartItemComponent
                                                        key={item.id}
                                                        item={item}
                                                        onUpdateQuantity={updateQuantity}
                                                        onRemove={removeItem}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Étape 2: Informations */}
                                    {currentStep === 2 && (
                                        <motion.div
                                            key="info"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-white rounded-2xl shadow-lg p-6"
                                        >
                                            <h2 className="text-2xl font-heading text-gray-800 mb-6">
                                                Informations de livraison
                                            </h2>

                                            <div className="space-y-6">
                                                {/* Informations personnelles */}
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                                                        Informations personnelles
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Prénom *
                                                            </label>
                                                            <input
                                                                {...register('firstName')}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                placeholder="Votre prénom"
                                                            />
                                                            {errors.firstName && (
                                                                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Nom *
                                                            </label>
                                                            <input
                                                                {...register('lastName')}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                placeholder="Votre nom"
                                                            />
                                                            {errors.lastName && (
                                                                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Email *
                                                            </label>
                                                            <input
                                                                {...register('email')}
                                                                type="email"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                placeholder="votre@email.com"
                                                            />
                                                            {errors.email && (
                                                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Téléphone *
                                                            </label>
                                                            <input
                                                                {...register('phone')}
                                                                type="tel"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                placeholder="06 12 34 56 78"
                                                            />
                                                            {errors.phone && (
                                                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Adresse de facturation */}
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                                                        Adresse de facturation
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Adresse *
                                                            </label>
                                                            <input
                                                                {...register('billingStreet')}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                placeholder="123 rue de la Forêt"
                                                            />
                                                            {errors.billingStreet && (
                                                                <p className="text-red-500 text-sm mt-1">{errors.billingStreet.message}</p>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Ville *
                                                                </label>
                                                                <input
                                                                    {...register('billingCity')}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Paris"
                                                                />
                                                                {errors.billingCity && (
                                                                    <p className="text-red-500 text-sm mt-1">{errors.billingCity.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Code postal *
                                                                </label>
                                                                <input
                                                                    {...register('billingZipCode')}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="75001"
                                                                />
                                                                {errors.billingZipCode && (
                                                                    <p className="text-red-500 text-sm mt-1">{errors.billingZipCode.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Pays *
                                                                </label>
                                                                <select
                                                                    {...register('billingCountry')}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                >
                                                                    <option value="France">France</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Adresse de livraison */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <input
                                                            {...register('sameAsBilling')}
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                        />
                                                        <label className="text-sm font-medium text-gray-700">
                                                            Livrer à la même adresse que la facturation
                                                        </label>
                                                    </div>

                                                    {!sameAsBilling && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                        >
                                                            <h3 className="text-lg font-medium text-gray-800 mb-4">
                                                                Adresse de livraison
                                                            </h3>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Adresse *
                                                                    </label>
                                                                    <input
                                                                        {...register('shippingStreet')}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                        placeholder="123 rue de la Livraison"
                                                                    />
                                                                    {errors.shippingStreet && (
                                                                        <p className="text-red-500 text-sm mt-1">{errors.shippingStreet.message}</p>
                                                                    )}
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Ville *
                                                                        </label>
                                                                        <input
                                                                            {...register('shippingCity')}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                            placeholder="Paris"
                                                                        />
                                                                        {errors.shippingCity && (
                                                                            <p className="text-red-500 text-sm mt-1">{errors.shippingCity.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Code postal *
                                                                        </label>
                                                                        <input
                                                                            {...register('shippingZipCode')}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                            placeholder="75001"
                                                                        />
                                                                        {errors.shippingZipCode && (
                                                                            <p className="text-red-500 text-sm mt-1">{errors.shippingZipCode.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Pays *
                                                                        </label>
                                                                        <select
                                                                            {...register('shippingCountry')}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                        >
                                                                            <option value="France">France</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {/* Notes */}
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                                                        Notes et instructions (optionnel)
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Notes de commande
                                                            </label>
                                                            <textarea
                                                                {...register('orderNotes')}
                                                                rows={3}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                placeholder="Notes spéciales pour votre commande..."
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Instructions de livraison
                                                            </label>
                                                            <textarea
                                                                {...register('deliveryInstructions')}
                                                                rows={3}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                placeholder="Instructions spéciales pour la livraison..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Étape 3: Paiement */}
                                    {currentStep === 3 && (
                                        <motion.div
                                            key="payment"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-white rounded-2xl shadow-lg p-6"
                                        >
                                            <h2 className="text-2xl font-heading text-gray-800 mb-6">
                                                Paiement par virement bancaire
                                            </h2>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-2xl">💳</span>
                                                    <h3 className="text-lg font-medium text-blue-800">
                                                        Informations bancaires
                                                    </h3>
                                                </div>

                                                <div className="space-y-3 text-sm">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="font-medium text-blue-700">Banque :</span>
                                                            <span className="ml-2 text-blue-800">{settings.bank_name}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-blue-700">Titulaire :</span>
                                                            <span className="ml-2 text-blue-800">{settings.bank_account_name}</span>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <span className="font-medium text-blue-700">IBAN :</span>
                                                            <span className="ml-2 text-blue-800 font-mono">{settings.bank_iban}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-blue-700">BIC :</span>
                                                            <span className="ml-2 text-blue-800 font-mono">{settings.bank_bic}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">⚠️</span>
                                                    <div>
                                                        <h3 className="font-medium text-yellow-800 mb-2">
                                                            Instructions importantes
                                                        </h3>
                                                        <ul className="text-sm text-yellow-700 space-y-2">
                                                            <li>• Effectuez le virement avec le montant exact : <strong>{total.toFixed(2)}€</strong></li>
                                                            <li>• Utilisez votre numéro de commande comme référence du virement</li>
                                                            <li>• Votre commande sera traitée dès réception du paiement</li>
                                                            <li>• Vous pourrez uploader votre justificatif de paiement après confirmation</li>
                                                            <li>• Délai de paiement : {settings.payment_due_days || 7} jours</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Étape 4: Confirmation */}
                                    {currentStep === 4 && orderData && (
                                        <motion.div
                                            key="confirmation"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white rounded-2xl shadow-lg p-6 text-center"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: "spring" }}
                                                className="text-6xl mb-6"
                                            >
                                                🎉
                                            </motion.div>

                                            <h2 className="text-3xl font-heading text-gray-800 mb-4">
                                                Commande confirmée !
                                            </h2>

                                            <p className="text-lg text-gray-600 mb-6">
                                                Votre commande <strong>#{orderData.orderNumber}</strong> a été créée avec succès.
                                            </p>

                                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                                                <h3 className="font-medium text-green-800 mb-3">Prochaines étapes :</h3>
                                                <ol className="text-sm text-green-700 space-y-2 text-left">
                                                    <li>1. Effectuez le virement bancaire de <strong>{total.toFixed(2)}€</strong></li>
                                                    <li>2. Utilisez la référence : <strong>{orderData.orderNumber}</strong></li>
                                                    <li>3. Uploadez votre justificatif de paiement via le lien de suivi</li>
                                                    <li>4. Nous traiterons votre commande dès réception du paiement</li>
                                                </ol>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Link href={`/suivi/${orderData.orderNumber}`}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
                                                    >
                                                        Suivre ma commande
                                                    </motion.button>
                                                </Link>

                                                <Link href="/produits">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        Continuer mes achats
                                                    </motion.button>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Sidebar récapitulatif */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-2xl shadow-lg p-6 sticky top-8"
                                >
                                    <h3 className="text-lg font-heading text-gray-800 mb-4">
                                        Récapitulatif
                                    </h3>

                                    {/* Items */}
                                    <div className="space-y-3 mb-6">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-wood-100 rounded-lg flex items-center justify-center">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <span className="text-xl">🪵</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.quantity} × {item.price}€
                                                    </p>
                                                </div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {(item.quantity * item.price).toFixed(2)}€
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totaux */}
                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Sous-total</span>
                                            <span>{subtotal.toFixed(2)}€</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Livraison</span>
                                            <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                                                {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)}€`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>TVA (20%)</span>
                                            <span>{tax.toFixed(2)}€</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                            <span>Total</span>
                                            <span className="text-primary-600">{total.toFixed(2)}€</span>
                                        </div>
                                    </div>

                                    {/* Seuil livraison gratuite */}
                                    {shippingCost > 0 && (
                                        <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded mt-4">
                                            💡 Plus que {(settings.freeShippingThreshold - subtotal).toFixed(2)}€
                                            pour la livraison gratuite !
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* Navigation */}
                        {currentStep < 4 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-between items-center mt-8"
                            >
                                <div>
                                    {currentStep > 1 && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={() => setCurrentStep(currentStep - 1)}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Retour
                                        </motion.button>
                                    )}
                                </div>

                                <div>
                                    {currentStep === 1 ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={() => setCurrentStep(2)}
                                            disabled={!cartValidation.isValid}
                                            className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Continuer
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    Traitement...
                                                </>
                                            ) : (
                                                currentStep === 2 ? 'Continuer vers le paiement' : 'Confirmer la commande'
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>
            </div>
        </Layout>
    )
}

// Composant pour afficher un item du panier
function CartItemComponent({ item, onUpdateQuantity, onRemove }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
        >
            <div className="w-16 h-16 bg-wood-100 rounded-lg flex items-center justify-center">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <span className="text-2xl">🪵</span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{item.essence}</p>
                <p className="text-sm font-semibold text-primary-600">
                    {item.price}€/{item.unit}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-lg border">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </motion.button>

                    <span className="px-3 py-2 font-medium min-w-[50px] text-center">
                        {item.quantity}
                    </span>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </motion.button>
                </div>

                <div className="text-right">
                    <p className="font-semibold text-gray-800">
                        {(item.quantity * item.price).toFixed(2)}€
                    </p>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRemove(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                        Supprimer
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}