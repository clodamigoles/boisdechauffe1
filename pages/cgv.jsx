import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Head from "next/head"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { FileText } from "lucide-react"

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

export default function CGVPage() {
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [settings, setSettings] = useState(null)

    useEffect(() => {
        async function loadContent() {
            try {
                const res = await fetch("/api/settings")
                const data = await res.json()

                if (data.success) {
                    setSettings(data.data)
                    setContent(data.data.legalContent?.cgv || generateDefaultContent(data.data))
                }
            } catch (error) {
                console.error("Erreur lors du chargement du contenu:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadContent()
    }, [])

    const generateDefaultContent = (settings) => {
        return `
# Conditions Générales de Vente

## 1. Objet

Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre ${settings?.companyName || settings?.siteName || "Mon bois de chauffe"} et ses clients.

## 2. Produits et Services

Nous proposons à la vente du bois de chauffage de qualité premium :

- Bûches de bois dur séchées
- Différentes essences disponibles
- Livraison à domicile
- Service client personnalisé

## 3. Prix

Les prix sont indiqués en euros (€) TTC, incluant la TVA applicable.

**Livraison :**
- Les frais de livraison varient selon la région
- Livraison gratuite à partir de ${settings?.freeShippingThreshold || 500}€ d'achat
- Les tarifs de livraison sont indiqués lors du processus de commande

Nous nous réservons le droit de modifier nos prix à tout moment, les commandes étant facturées sur la base des tarifs en vigueur au moment de la validation de la commande.

## 4. Commande

### 4.1 Processus de commande

1. Sélection des produits
2. Ajout au panier
3. Validation du panier
4. Renseignement des informations de livraison
5. Validation de la commande

### 4.2 Confirmation

Une confirmation de commande est envoyée par email à l'adresse indiquée lors de la commande.

## 5. Paiement

### 5.1 Modalités de paiement

Nous acceptons les modes de paiement suivants :
- Virement bancaire
- Autres moyens de paiement sur demande

### 5.2 Sécurité

Tous les paiements sont sécurisés. Nous ne conservons pas vos informations bancaires.

### 5.3 Délai de paiement

Le paiement doit être effectué dans les 7 jours suivant la validation de la commande.

## 6. Livraison

### 6.1 Zone de livraison

Nous livrons en France métropolitaine, Belgique, Suisse et Luxembourg.

### 6.2 Délais de livraison

- Livraison sous 5-7 jours ouvrés après réception du paiement
- Les délais peuvent varier selon la destination et la disponibilité

### 6.3 Modalités de livraison

- Livraison en bordure de route ou lieu accessible au camion
- Déchargement par nos soins
- Présence obligatoire lors de la livraison

## 7. Droit de rétractation

Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés.

Pour les produits standards, vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation sans avoir à justifier de motifs.

## 8. Garanties

### 8.1 Qualité des produits

Nous garantissons :
- Bois séché (taux d'humidité < 20%)
- Essences conformes à la description
- Qualité premium

### 8.2 Réclamations

Toute réclamation doit être formulée dans les 48h suivant la livraison par email à : ${settings?.contactEmail || ""}

## 9. Responsabilité

Notre responsabilité est limitée au montant de la commande. Nous ne saurions être tenus responsables des dommages indirects.

## 10. Force majeure

Nous ne saurions être tenus responsables en cas de force majeure ou d'événements indépendants de notre volonté (intempéries, grèves, etc.).

## 11. Protection des données personnelles

Vos données personnelles sont traitées conformément à notre [Politique de confidentialité](/politique-confidentialite).

## 12. Propriété intellectuelle

Tous les éléments du site (textes, images, logos) sont protégés par le droit d'auteur et restent notre propriété exclusive.

## 13. Droit applicable et juridiction

Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.

## 14. Médiation

Conformément à l'article L.612-1 du Code de la consommation, nous proposons un dispositif de médiation de la consommation.

L'entité de médiation retenue est :

**Médiateur de la consommation**
[À compléter avec les coordonnées du médiateur]

## 15. Contact

Pour toute question concernant nos CGV :

**Email :** ${settings?.contactEmail || ""}
**Téléphone :** ${settings?.contactPhone || ""}
**Adresse :** ${settings?.address?.street || ""}, ${settings?.address?.postalCode || ""} ${settings?.address?.city || ""}

## 16. Acceptation des CGV

La validation de votre commande implique l'acceptation pleine et entière des présentes CGV.
`
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

    return (
        <>
            <Head>
                <title>
                    Conditions Générales de Vente - {settings?.siteName || "Mon bois de chauffe"}
                </title>
                <meta
                    name="description"
                    content="Conditions générales de vente et conditions d'utilisation"
                />
            </Head>

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
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-green-600" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Conditions Générales de Vente
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Nos conditions de vente et modalités contractuelles
                            </p>
                        </div>

                        {/* Contenu */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
                        >
                            <div
                                className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-600 prose-strong:text-gray-900 prose-a:text-green-600 hover:prose-a:text-green-700"
                                dangerouslySetInnerHTML={{
                                    __html: content.replace(
                                        /^# (.+)$/gm,
                                        "<h1>$1</h1>",
                                    )
                                        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
                                        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
                                        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                                        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
                                        .replace(/\n\n/g, "</p><p>")
                                        .replace(/^(?!<[h|p])/gm, "<p>")
                                        .replace(/(?<![>])$/gm, "</p>")
                                        .replace(/<p><\/p>/g, "")
                                        .replace(/<p>(<h[1-6])/g, "$1")
                                        .replace(/(<\/h[1-6]>)<\/p>/g, "$1"),
                                }}
                            />
                        </motion.div>

                        {/* Dernière mise à jour */}
                        <div className="mt-8 text-center text-sm text-gray-500">
                            <p>
                                Dernière mise à jour :{" "}
                                {settings?.updatedAt
                                    ? new Date(settings.updatedAt).toLocaleDateString("fr-FR")
                                    : new Date().toLocaleDateString("fr-FR")}
                            </p>
                        </div>
                    </div>
                </motion.main>

                <Footer />
            </div>
        </>
    )
}
