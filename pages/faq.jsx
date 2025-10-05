"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { motion } from "framer-motion"
import Link from "next/link"
import {
    ChevronDown,
    Search,
    Package,
    Truck,
    CreditCard,
    Shield,
    HelpCircle,
    Phone,
    Mail,
    CheckCircle,
    AlertCircle,
    Clock,
    FileText,
    MessageSquare,
} from "lucide-react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import { containerVariants, itemVariants } from "../utils/animations"

export default function FAQPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [openItems, setOpenItems] = useState([])

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600)
        return () => clearTimeout(timer)
    }, [])

    const categories = [
        { id: "all", label: "Toutes les questions", icon: HelpCircle, color: "bg-gray-500" },
        { id: "produits", label: "Produits", icon: Package, color: "bg-blue-500" },
        { id: "livraison", label: "Livraison", icon: Truck, color: "bg-green-500" },
        { id: "paiement", label: "Paiement", icon: CreditCard, color: "bg-purple-500" },
        { id: "qualite", label: "Qualité", icon: Shield, color: "bg-amber-500" },
        { id: "commande", label: "Commande", icon: FileText, color: "bg-red-500" },
    ]

    const faqData = [
        // Produits
        {
            category: "produits",
            question: "Quels types de bois de chauffage proposez-vous ?",
            answer:
                "Nous proposons plusieurs essences de bois : chêne, hêtre, frêne, charme et bouleau. Chaque essence a ses caractéristiques propres. Le chêne et le hêtre offrent une combustion longue et régulière, idéale pour les longues soirées. Le frêne et le charme produisent une belle flamme et une chaleur intense. Le bouleau s'allume facilement et est parfait pour démarrer un feu.",
        },
        {
            category: "produits",
            question: "Quelle est la différence entre les bûches traditionnelles et les bûches compressées ?",
            answer:
                "Les bûches traditionnelles sont du bois naturel coupé et séché. Les bûches compressées sont fabriquées à partir de sciure compactée, offrant un pouvoir calorifique supérieur (environ 2 fois plus), une combustion plus longue et moins de cendres. Elles sont idéales pour maintenir la chaleur pendant la nuit.",
        },
        {
            category: "produits",
            question: "Qu'est-ce qu'un stère de bois ?",
            answer:
                "Un stère correspond à 1m³ de bois empilé en bûches de 1 mètre de long. Pour des bûches de 50cm, le volume apparent est d'environ 0,8m³, et pour des bûches de 33cm, environ 0,7m³. Cette différence est due aux espaces vides entre les bûches plus courtes.",
        },
        {
            category: "produits",
            question: "Quelle longueur de bûches choisir ?",
            answer:
                "Le choix dépend de votre appareil de chauffage. Mesurez la largeur de votre foyer et choisissez des bûches 10cm plus courtes. Les longueurs standards sont : 25cm (petits poêles), 33cm (poêles moyens), 40cm (grands poêles) et 50cm (cheminées). Nous proposons toutes ces longueurs.",
        },
        {
            category: "produits",
            question: "Vendez-vous du bois vert ou sec ?",
            answer:
                "Nous vendons uniquement du bois sec prêt à brûler, avec un taux d'humidité inférieur à 20%. Notre bois est séché naturellement pendant 18 à 24 mois dans nos hangars ventilés. Nous garantissons la qualité avec un certificat d'humidité fourni à chaque livraison.",
        },

        // Livraison
        {
            category: "livraison",
            question: "Dans quelles zones livrez-vous ?",
            answer:
                "Nous livrons dans toute la France métropolitaine. Zone 1 (Région lyonnaise) : livraison en 24-48h. Zone 2 (Auvergne-Rhône-Alpes étendue) : 48-72h. Zone 3 (France métropolitaine) : 3-5 jours. Les frais de livraison varient selon la zone et sont gratuits à partir d'un certain montant.",
        },
        {
            category: "livraison",
            question: "Le déchargement est-il inclus dans la livraison ?",
            answer:
                "Oui, le déchargement manuel est toujours inclus dans nos tarifs de livraison. Nous déchargeons au plus près de votre habitation, accessible par camion. Pour une livraison jusqu'à votre lieu de stockage ou en étage, nous proposons un service premium avec supplément.",
        },
        {
            category: "livraison",
            question: "Comment suivre ma livraison ?",
            answer:
                "Dès l'expédition, vous recevez un email avec le numéro de suivi. Notre équipe vous contacte 24h avant la livraison pour confirmer le créneau horaire. Le jour J, vous recevez un SMS quand le chauffeur est en route. Vous pouvez aussi suivre votre commande en temps réel depuis votre espace client.",
        },
        {
            category: "livraison",
            question: "Que faire si je ne suis pas disponible le jour de la livraison ?",
            answer:
                "Contactez-nous dès que possible pour reprogrammer. Nous proposons la livraison chez un voisin ou dans un lieu sûr convenu à l'avance. Si vous êtes absent sans prévenir, nous replanifions gratuitement une nouvelle livraison dans un délai de 7 jours.",
        },
        {
            category: "livraison",
            question: "Livrez-vous le weekend ?",
            answer:
                "Les livraisons standard ont lieu du lundi au vendredi, de 8h à 18h. Nous proposons des livraisons le samedi matin (8h-12h) sur demande, avec un supplément de 20€. Les livraisons le dimanche ne sont pas disponibles.",
        },
        {
            category: "livraison",
            question: "Quels sont les délais en période hivernale ?",
            answer:
                "En période de forte demande (octobre à février), les délais peuvent être prolongés de 1 à 2 jours. Nous recommandons de commander à l'avance pour garantir votre approvisionnement. Les clients réguliers peuvent bénéficier d'un système de réservation prioritaire.",
        },

        // Paiement
        {
            category: "paiement",
            question: "Quels moyens de paiement acceptez-vous ?",
            answer:
                "Nous acceptons : carte bancaire (Visa, Mastercard, American Express), virement bancaire, chèque, et paiement en plusieurs fois sans frais (à partir de 300€). Pour les professionnels, nous proposons le paiement à 30 jours sur facture après validation du dossier.",
        },
        {
            category: "paiement",
            question: "Le paiement en ligne est-il sécurisé ?",
            answer:
                "Absolument. Toutes les transactions sont sécurisées par protocole SSL et cryptage 256 bits. Nous utilisons les services de paiement certifiés PCI-DSS. Vos données bancaires ne sont jamais stockées sur nos serveurs. Vous pouvez payer en toute confiance.",
        },
        {
            category: "paiement",
            question: "Puis-je payer en plusieurs fois ?",
            answer:
                "Oui, pour tout achat supérieur à 300€, nous proposons le paiement en 2, 3 ou 4 fois sans frais. Cette option est disponible lors du paiement par carte bancaire. Les prélèvements sont effectués automatiquement chaque mois à date fixe.",
        },
        {
            category: "paiement",
            question: "Quand suis-je débité ?",
            answer:
                "Pour un paiement par carte bancaire, vous êtes débité immédiatement à la validation de la commande. Pour un virement, la commande est traitée dès réception du paiement. Pour un chèque, la commande est expédiée après encaissement (3-5 jours ouvrés).",
        },
        {
            category: "paiement",
            question: "Puis-je obtenir une facture ?",
            answer:
                "Oui, une facture détaillée est automatiquement générée et envoyée par email après chaque commande. Vous pouvez aussi la télécharger depuis votre espace client. Pour les professionnels, nous fournissons des factures avec TVA déductible et tous les mentions légales requises.",
        },

        // Qualité
        {
            category: "qualite",
            question: "Comment garantissez-vous la qualité du bois ?",
            answer:
                "Notre bois est séché naturellement pendant 18-24 mois dans des hangars ventilés. Nous contrôlons régulièrement le taux d'humidité (garanti < 20%). Chaque livraison est accompagnée d'un certificat de qualité. Nous sélectionnons nos fournisseurs locaux selon des critères stricts de qualité et de durabilité.",
        },
        {
            category: "qualite",
            question: "Le bois est-il certifié ?",
            answer:
                "Oui, tout notre bois provient de forêts gérées durablement et certifiées PEFC ou FSC. Nous privilégions les circuits courts avec des fournisseurs locaux dans un rayon de 100km. Nous fournissons les certificats sur demande.",
        },
        {
            category: "qualite",
            question: "Comment vérifier le taux d'humidité du bois ?",
            answer:
                "Nous fournissons un certificat d'humidité avec chaque livraison. Vous pouvez aussi vérifier vous-même avec un humidimètre (disponible en magasin de bricolage). Plantez les pointes dans une bûche fendue : un bon bois de chauffage doit afficher moins de 20% d'humidité.",
        },
        {
            category: "qualite",
            question: "Que faire si le bois ne me convient pas ?",
            answer:
                "Si vous n'êtes pas satisfait de la qualité, contactez-nous dans les 48h suivant la livraison. Nous envoyons un expert pour évaluer la situation. Si le bois ne respecte pas nos standards (humidité > 20%, essence différente), nous le reprenons et vous remboursons intégralement ou le remplaçons gratuitement.",
        },
        {
            category: "qualite",
            question: "D'où provient votre bois ?",
            answer:
                "Notre bois provient exclusivement de forêts françaises, principalement de la région Auvergne-Rhône-Alpes. Nous travaillons avec des exploitants forestiers locaux qui pratiquent une gestion durable. Chaque lot est traçable depuis la forêt jusqu'à votre domicile.",
        },

        // Commande
        {
            category: "commande",
            question: "Comment passer commande ?",
            answer:
                "Vous pouvez commander directement sur notre site web 24h/24, par téléphone au 01 23 45 67 89 (Lun-Sam 8h-19h), ou par email à contact@boischauffagepro.fr. Pour les grandes quantités ou les professionnels, nous établissons un devis personnalisé sur demande.",
        },
        {
            category: "commande",
            question: "Quelle quantité commander ?",
            answer:
                "Pour une maison de 100m² avec chauffage d'appoint, comptez 3-5 stères par an. Pour un chauffage principal, 8-12 stères. Cela dépend de l'isolation, de la région et de vos habitudes. Notre calculateur en ligne vous aide à estimer vos besoins. N'hésitez pas à nous appeler pour un conseil personnalisé.",
        },
        {
            category: "commande",
            question: "Puis-je modifier ou annuler ma commande ?",
            answer:
                "Oui, tant que la commande n'est pas expédiée. Contactez-nous rapidement par téléphone ou email. Si la commande est déjà en préparation, des frais de 10% peuvent s'appliquer. Après expédition, l'annulation n'est plus possible mais vous bénéficiez du droit de rétractation de 14 jours.",
        },
        {
            category: "commande",
            question: "Proposez-vous des abonnements ou livraisons régulières ?",
            answer:
                "Oui, nous proposons un service d'abonnement avec livraisons programmées (mensuelle, trimestrielle ou semestrielle). Vous bénéficiez de 5% de réduction sur le prix et d'une priorité de livraison. Idéal pour ne jamais être à court de bois en hiver.",
        },
        {
            category: "commande",
            question: "Faites-vous des devis pour les professionnels ?",
            answer:
                "Oui, nous établissons des devis personnalisés pour les professionnels (hôtels, restaurants, collectivités). Nous proposons des tarifs dégressifs selon les volumes, des conditions de paiement adaptées et un service de livraison prioritaire. Contactez notre service commercial au 01 23 45 67 90.",
        },
        {
            category: "commande",
            question: "Y a-t-il une quantité minimum de commande ?",
            answer:
                "La quantité minimum est de 1 stère pour les livraisons standard. Pour les petites quantités (moins de 1 stère), nous proposons le retrait en entrepôt à Lyon. Pour les bûches compressées et granulés, pas de minimum, vous pouvez commander à l'unité.",
        },
    ]

    const toggleItem = (index) => {
        setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
    }

    const filteredFAQ = faqData.filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
        const matchesSearch =
            searchQuery === "" ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

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
                <title>FAQ | BoisChauffage Pro - Questions Fréquentes</title>
                <meta
                    name="description"
                    content="Trouvez les réponses à toutes vos questions sur le bois de chauffage, la livraison, le paiement et la qualité. Service client expert disponible."
                />
                <meta
                    name="keywords"
                    content="faq bois chauffage, questions fréquentes, aide, support, livraison, qualité, paiement"
                />
                <link rel="canonical" href="https://boischauffagepro.fr/faq" />

                {/* Open Graph */}
                <meta property="og:title" content="FAQ | BoisChauffage Pro" />
                <meta property="og:description" content="Réponses à toutes vos questions sur le bois de chauffage" />
                <meta property="og:url" content="https://boischauffagepro.fr/faq" />

                {/* Schema.org FAQPage */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: faqData.map((item) => ({
                                "@type": "Question",
                                name: item.question,
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: item.answer,
                                },
                            })),
                        }),
                    }}
                />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Header />

                {/* Hero Section */}
                <section className="bg-gray-800 text-white py-20 mt-16">
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
                                <HelpCircle className="w-4 h-4 mr-2" />
                                Centre d'Aide
                            </motion.div>

                            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                Questions
                                <span className="block text-amber-400">Fréquentes</span>
                            </h1>

                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Trouvez rapidement les réponses à vos questions sur nos produits, la livraison, le paiement et bien plus
                                encore.
                            </p>

                            {/* Barre de recherche */}
                            <div className="max-w-2xl mx-auto">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher une question..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Catégories */}
                <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                            {categories.map((category) => {
                                const IconComponent = category.icon
                                const isActive = selectedCategory === category.id
                                return (
                                    <motion.button
                                        key={category.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${isActive
                                                ? `${category.color} text-white shadow-lg`
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        <span className="font-medium text-sm">{category.label}</span>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Liste des FAQ */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredFAQ.length === 0 ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                                <p className="text-gray-600 mb-6">Essayez avec d'autres mots-clés ou parcourez toutes les catégories</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSelectedCategory("all")
                                    }}
                                >
                                    Réinitialiser la recherche
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div variants={containerVariants} initial="initial" animate="animate" className="space-y-4">
                                {filteredFAQ.map((item, index) => {
                                    const isOpen = openItems.includes(index)
                                    const categoryInfo = categories.find((c) => c.id === item.category)
                                    const CategoryIcon = categoryInfo?.icon

                                    return (
                                        <motion.div
                                            key={index}
                                            variants={itemVariants}
                                            custom={index}
                                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleItem(index)}
                                                className="w-full px-6 py-5 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-start space-x-4 flex-1">
                                                    {CategoryIcon && (
                                                        <div
                                                            className={`w-8 h-8 ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}
                                                        >
                                                            <CategoryIcon className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.question}</h3>
                                                        {!isOpen && <p className="text-sm text-gray-500 line-clamp-1">{item.answer}</p>}
                                                    </div>
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex-shrink-0 ml-4"
                                                >
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                </motion.div>
                                            </button>

                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    height: isOpen ? "auto" : 0,
                                                    opacity: isOpen ? 1 : 0,
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-5 pl-18">
                                                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}

                        {/* Statistiques */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-12 text-center text-sm text-gray-500"
                        >
                            Affichage de {filteredFAQ.length} question{filteredFAQ.length > 1 ? "s" : ""} sur {faqData.length}
                        </motion.div>
                    </div>
                </section>

                {/* Section Contact */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 lg:p-12"
                        >
                            <div className="text-center max-w-2xl mx-auto">
                                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Vous ne trouvez pas votre réponse ?</h2>
                                <p className="text-lg text-gray-700 mb-8">
                                    Notre équipe d'experts est là pour répondre à toutes vos questions. Contactez-nous par téléphone,
                                    email ou chat en ligne.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/contact">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700"
                                        >
                                            <Mail className="w-5 h-5" />
                                            <span>Nous contacter</span>
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex items-center space-x-2 bg-white text-amber-700 border-amber-300 hover:bg-amber-50"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>01 23 45 67 89</span>
                                    </Button>
                                </div>

                                <div className="mt-8 pt-8 border-t border-amber-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Clock className="w-4 h-4 text-amber-600" />
                                            <span className="text-gray-700">Réponse sous 2-4h</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span className="text-gray-700">Experts disponibles</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <Shield className="w-4 h-4 text-blue-600" />
                                            <span className="text-gray-700">Conseils gratuits</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Ressources utiles */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ressources Utiles</h2>
                            <p className="text-lg text-gray-600">Découvrez nos guides et informations complémentaires</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Truck className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Informations Livraison</h3>
                                <p className="text-gray-600 mb-4">Zones, délais, tarifs et modalités de livraison détaillées</p>
                                <Link href="/livraison">
                                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                                        En savoir plus
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Package className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nos Produits</h3>
                                <p className="text-gray-600 mb-4">Découvrez notre gamme complète de bois de chauffage premium</p>
                                <Link href="/shop">
                                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                                        Voir le catalogue
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Devis Gratuit</h3>
                                <p className="text-gray-600 mb-4">Obtenez un devis personnalisé pour vos besoins spécifiques</p>
                                <Link href="/contact">
                                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                                        Demander un devis
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    )
}