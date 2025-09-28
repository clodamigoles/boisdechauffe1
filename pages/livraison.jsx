"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { motion } from "framer-motion"
import Link from "next/link"
import {
    Truck,
    MapPin,
    Clock,
    Euro,
    Shield,
    CheckCircle,
    Phone,
    Calendar,
    Package,
    AlertCircle,
    ArrowRight,
    Target
} from "lucide-react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import { pageVariants, containerVariants, itemVariants } from "../utils/animations"

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
}

export default function LivraisonPage() {
    const [selectedRegion, setSelectedRegion] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedTab, setSelectedTab] = useState('zones')

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600)
        return () => clearTimeout(timer)
    }, [])

    const deliveryZones = [
        {
            id: 'zone-1',
            name: 'Zone 1 - Région Lyonnaise',
            regions: ['Rhône (69)', 'Ain (01)', 'Loire (42)', 'Isère (38)'],
            delay: '24-48h',
            price: 'Gratuite dès 200€',
            standardPrice: '15€',
            color: 'bg-green-500',
            description: 'Livraison express dans notre zone principale'
        },
        {
            id: 'zone-2',
            name: 'Zone 2 - Auvergne-Rhône-Alpes étendue',
            regions: ['Savoie (73)', 'Haute-Savoie (74)', 'Ardèche (07)', 'Drôme (26)', 'Puy-de-Dôme (63)'],
            delay: '48-72h',
            price: 'Gratuite dès 300€',
            standardPrice: '25€',
            color: 'bg-blue-500',
            description: 'Livraison rapide en région étendue'
        },
        {
            id: 'zone-3',
            name: 'Zone 3 - France métropolitaine',
            regions: ['Toute la France métropolitaine'],
            delay: '3-5 jours',
            price: 'Gratuite dès 500€',
            standardPrice: '35€',
            color: 'bg-amber-500',
            description: 'Livraison standard partout en France'
        }
    ]

    const deliverySteps = [
        {
            step: 1,
            title: 'Commande validée',
            description: 'Réception de votre paiement et validation de la commande',
            icon: CheckCircle,
            time: 'J+0'
        },
        {
            step: 2,
            title: 'Préparation',
            description: 'Sélection et conditionnement de votre bois de chauffage',
            icon: Package,
            time: 'J+1'
        },
        {
            step: 3,
            title: 'Expédition',
            description: 'Chargement et départ de notre entrepôt lyonnais',
            icon: Truck,
            time: 'J+2'
        },
        {
            step: 4,
            title: 'Livraison',
            description: 'Réception chez vous avec déchargement inclus',
            icon: Target,
            time: 'J+2 à J+5'
        }
    ]

    const deliveryOptions = [
        {
            title: 'Livraison Standard',
            description: 'Déchargement au plus près de votre habitation',
            features: [
                'Livraison en bordure de voie',
                'Déchargement manuel inclus',
                'Horaires 8h-18h du lundi au vendredi',
                'Préavis 24h par téléphone'
            ],
            price: 'Selon zone',
            popular: true
        },
        {
            title: 'Livraison Premium',
            description: 'Service complet avec mise en place',
            features: [
                'Livraison jusqu\'à votre stockage',
                'Mise en tas organisée',
                'Créneaux élargis weekends compris',
                'Service de nettoyage'
            ],
            price: '+20€',
            popular: false
        },
        {
            title: 'Livraison Express',
            description: 'Livraison en moins de 24h (Zone 1 uniquement)',
            features: [
                'Délai garanti sous 24h',
                'Créneaux spécifiques 2h',
                'SMS de suivi temps réel',
                'Zone lyonnaise uniquement'
            ],
            price: '+35€',
            popular: false
        }
    ]

    const faqItems = [
        {
            question: 'Comment suivre ma livraison ?',
            answer: 'Vous recevez un email avec le numéro de suivi dès l\'expédition. Notre équipe vous contacte 24h avant la livraison pour confirmer le créneau.'
        },
        {
            question: 'Que faire si je ne suis pas disponible ?',
            answer: 'Nous proposons la livraison chez un voisin ou dans un lieu sûr convenu. En cas d\'absence totale, nous replanifions gratuitement une nouvelle livraison.'
        },
        {
            question: 'Le déchargement est-il inclus ?',
            answer: 'Oui, le déchargement manuel est toujours inclus. Nous déchargeons au plus près de votre habitation accessible par camion.'
        },
        {
            question: 'Livrez-vous dans les étages ?',
            answer: 'La livraison standard se fait en rez-de-chaussée. Pour les étages, nous proposons un service premium avec supplément selon la configuration.'
        },
        {
            question: 'Quels sont vos délais en période hivernale ?',
            answer: 'En période de forte demande (octobre à février), les délais peuvent être prolongés de 1-2 jours. Nous recommandons de commander à l\'avance.'
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
                <title>Livraison | BoisChauffage Pro - Service de Livraison Rapide</title>
                <meta
                    name="description"
                    content="Découvrez nos zones de livraison et tarifs. Livraison rapide 24-48h en région lyonnaise, partout en France. Déchargement inclus, suivi personnalisé."
                />
                <meta
                    name="keywords"
                    content="livraison bois chauffage, transport bois, déchargement, Lyon, France, délai livraison"
                />
                <link rel="canonical" href="https://boischauffagepro.fr/livraison" />

                {/* Open Graph */}
                <meta property="og:title" content="Livraison | BoisChauffage Pro" />
                <meta property="og:description" content="Service de livraison rapide pour votre bois de chauffage. Déchargement inclus, suivi personnalisé." />
                <meta property="og:url" content="https://boischauffagepro.fr/livraison" />
                <meta property="og:image" content="https://boischauffagepro.fr/images/og-livraison.jpg" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />
                <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
                    {/* Vidéo Background */}
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover opacity-60"
                            poster="/images/hero-poster.jpg"
                        >
                            <source src="/videos/hero-background.mp4" type="video/mp4" />
                        </video>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent" />
                    </div>
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
                                <Truck className="w-4 h-4 mr-2" />
                                Livraison Partout en France
                            </motion.div>

                            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                Livraison Rapide et
                                <span className="block text-amber-400">
                                    Déchargement Inclus
                                </span>
                            </h1>

                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Service de livraison professionnel avec déchargement inclus.
                                De 24h en région lyonnaise à 5 jours partout en France.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700"
                                >
                                    <MapPin className="w-5 h-5" />
                                    <span>Vérifier ma zone</span>
                                </Button>

                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>01 23 45 67 89</span>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Navigation Tabs */}
                <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex space-x-8 overflow-x-auto">
                            {[
                                { id: 'zones', label: 'Zones & Tarifs', icon: MapPin },
                                { id: 'process', label: 'Processus', icon: Truck },
                                { id: 'options', label: 'Options', icon: Package },
                                { id: 'faq', label: 'Questions', icon: AlertCircle }
                            ].map((tab) => {
                                const IconComponent = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${selectedTab === tab.id
                                                ? 'border-amber-600 text-amber-600'
                                                : 'border-transparent text-gray-600 hover:text-amber-600'
                                            }`}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>
                </section>

                {/* Zones & Tarifs */}
                {selectedTab === 'zones' && (
                    <section className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                variants={containerVariants}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    Nos Zones de Livraison
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Trois zones de livraison avec des délais et tarifs adaptés à votre localisation
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {deliveryZones.map((zone, index) => (
                                    <motion.div
                                        key={zone.id}
                                        variants={itemVariants}
                                        custom={index}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer"
                                        onClick={() => setSelectedRegion(selectedRegion === zone.id ? null : zone.id)}
                                    >
                                        <div className={`h-2 ${zone.color}`}></div>
                                        <div className="p-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-gray-900">{zone.name}</h3>
                                                <div className={`w-4 h-4 rounded-full ${zone.color}`}></div>
                                            </div>

                                            <p className="text-gray-600 mb-6">{zone.description}</p>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">Délai</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{zone.delay}</span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Euro className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">Gratuite</span>
                                                    </div>
                                                    <span className="font-semibold text-green-600">{zone.price}</span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Truck className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">Standard</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{zone.standardPrice}</span>
                                                </div>
                                            </div>

                                            {selectedRegion === zone.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-6 pt-6 border-t border-gray-100"
                                                >
                                                    <h4 className="font-semibold text-gray-900 mb-3">Départements couverts :</h4>
                                                    <div className="space-y-2">
                                                        {zone.regions.map((region, regionIndex) => (
                                                            <div
                                                                key={regionIndex}
                                                                className="flex items-center space-x-2 text-sm text-gray-600"
                                                            >
                                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                                <span>{region}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6"
                            >
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-amber-900 mb-2">Zone non couverte ?</h4>
                                        <p className="text-amber-800 mb-4">
                                            Votre région n'apparaît pas dans nos zones de livraison ? Contactez-nous !
                                            Nous étudions toutes les demandes et pouvons organiser une livraison spéciale.
                                        </p>
                                        <Link href="/contact">
                                            <Button variant="outline" size="sm" className="bg-white text-amber-700 border-amber-300 hover:bg-amber-50">
                                                Nous contacter
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Processus de Livraison */}
                {selectedTab === 'process' && (
                    <section className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                variants={containerVariants}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    Comment ça se passe ?
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    De la validation de votre commande à la livraison chez vous, suivez chaque étape
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {deliverySteps.map((step, index) => {
                                    const IconComponent = step.icon
                                    return (
                                        <motion.div
                                            key={step.step}
                                            variants={itemVariants}
                                            custom={index}
                                            className="text-center"
                                        >
                                            <div className="relative mb-6">
                                                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <IconComponent className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                                    {step.step}
                                                </div>

                                                {index < deliverySteps.length - 1 && (
                                                    <div className="hidden lg:block absolute top-8 left-16 w-full h-0.5 bg-gray-300"></div>
                                                )}
                                            </div>

                                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-3">
                                                    {step.time}
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8 }}
                                className="mt-16 text-center"
                            >
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                                    <h3 className="text-2xl font-bold mb-4">Suivi temps réel</h3>
                                    <p className="text-blue-100 mb-6">
                                        Recevez des SMS et emails à chaque étape pour suivre votre livraison en temps réel
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>SMS de départ</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Appel 24h avant</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>SMS d'arrivée</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Options de Livraison */}
                {selectedTab === 'options' && (
                    <section className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                variants={containerVariants}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    Choisissez Votre Service
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Trois niveaux de service pour s'adapter à vos besoins et votre budget
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {deliveryOptions.map((option, index) => (
                                    <motion.div
                                        key={option.title}
                                        variants={itemVariants}
                                        custom={index}
                                        whileHover={{ y: -5 }}
                                        className={`bg-white rounded-2xl shadow-lg border p-8 relative ${option.popular ? 'border-amber-500 ring-2 ring-amber-500 ring-opacity-20' : 'border-gray-200'
                                            }`}
                                    >
                                        {option.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                                    Le plus choisi
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                                            <p className="text-gray-600 mb-4">{option.description}</p>
                                            <div className="text-2xl font-bold text-amber-600">{option.price}</div>
                                        </div>

                                        <ul className="space-y-3 mb-8">
                                            {option.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start space-x-3">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-600 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            variant={option.popular ? "primary" : "outline"}
                                            className="w-full"
                                        >
                                            {option.popular ? "Choisir cette option" : "En savoir plus"}
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* FAQ */}
                {selectedTab === 'faq' && (
                    <section className="py-16">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                variants={containerVariants}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    Questions Fréquentes
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Tout ce que vous devez savoir sur nos livraisons
                                </p>
                            </motion.div>

                            <div className="space-y-6">
                                {faqItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        custom={index}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {item.question}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="mt-12 text-center"
                            >
                                <div className="bg-gray-100 rounded-xl p-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Une autre question ?
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Notre équipe est là pour répondre à toutes vos questions sur la livraison
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link href="/contact">
                                            <Button variant="primary" className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4" />
                                                <span>Nous contacter</span>
                                            </Button>
                                        </Link>
                                        <Button variant="outline" className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Planifier un appel</span>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center text-white"
                        >
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                                Prêt à Commander ?
                            </h2>
                            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                                Découvrez notre sélection de bois de chauffage premium et
                                bénéficiez de notre service de livraison professionnel
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/shop">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="flex items-center space-x-2 bg-white text-amber-600 hover:bg-gray-100"
                                    >
                                        <Package className="w-5 h-5" />
                                        <span>Voir nos produits</span>
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>

                                <Link href="/devis">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex items-center space-x-2 text-white border-white/30 hover:bg-white/10"
                                    >
                                        <Euro className="w-5 h-5" />
                                        <span>Devis gratuit</span>
                                    </Button>
                                </Link>
                            </div>

                            {/* Avantages rapides */}
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Truck className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-2">Livraison Rapide</h3>
                                    <p className="text-orange-100 text-sm">24-48h en région lyonnaise</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-2">Service Garanti</h3>
                                    <p className="text-orange-100 text-sm">Déchargement inclus</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-2">Suivi Complet</h3>
                                    <p className="text-orange-100 text-sm">SMS et appels de suivi</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Informations Pratiques */}
                <section className="py-16 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-bold mb-6">
                                    Informations Pratiques
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <Clock className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Horaires de Livraison</h3>
                                            <p className="text-gray-300 text-sm">
                                                Du lundi au vendredi : 8h-18h<br />
                                                Samedi : 8h-12h (sur demande)<br />
                                                Créneaux de 2h avec préavis 24h
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Zone de Déchargement</h3>
                                            <p className="text-gray-300 text-sm">
                                                Au plus près de votre habitation<br />
                                                Accessible par camion (largeur 2.5m)<br />
                                                Déchargement manuel inclus
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <Phone className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Contact Urgence</h3>
                                            <p className="text-gray-300 text-sm">
                                                Hotline livraison : 01 23 45 67 89<br />
                                                Du lundi au samedi : 7h-19h<br />
                                                Email : livraison@boischauffagepro.fr
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-gray-800 rounded-2xl p-8"
                            >
                                <h3 className="text-xl font-bold mb-6">Calculateur de Livraison</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Votre code postal
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ex: 69000"
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Quantité (stères)
                                        </label>
                                        <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500">
                                            <option>1 stère</option>
                                            <option>2 stères</option>
                                            <option>3 stères</option>
                                            <option>5 stères</option>
                                            <option>10 stères</option>
                                        </select>
                                    </div>

                                    <Button variant="primary" className="w-full mt-4">
                                        Calculer les frais de livraison
                                    </Button>
                                </div>

                                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-300">Délai estimé :</span>
                                        <span className="text-white font-medium">24-48h</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mt-2">
                                        <span className="text-gray-300">Coût de livraison :</span>
                                        <span className="text-green-400 font-medium">Gratuite</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    )
}