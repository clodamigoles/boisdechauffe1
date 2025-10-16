import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Head from "next/head"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Shield } from "lucide-react"

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

export default function PolitiqueConfidentialitePage() {
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
                    setContent(
                        data.data.legalContent?.politiqueConfidentialite ||
                            generateDefaultContent(data.data),
                    )
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
# Politique de Confidentialité

## 1. Introduction

${settings?.companyName || settings?.siteName || "Mon bois de chauffe"} s'engage à protéger la confidentialité et la sécurité de vos données personnelles. Cette politique décrit comment nous collectons, utilisons et protégeons vos informations.

## 2. Données collectées

Nous collectons les données suivantes :

**Données d'identification :**
- Nom et prénom
- Adresse email
- Numéro de téléphone
- Adresse postale

**Données de commande :**
- Historique des commandes
- Préférences de livraison
- Informations de paiement (traitées de manière sécurisée)

**Données de navigation :**
- Adresse IP
- Type de navigateur
- Pages visitées
- Durée de visite

## 3. Utilisation des données

Vos données sont utilisées pour :

- Traiter vos commandes et livraisons
- Vous contacter concernant votre commande
- Améliorer nos services
- Vous envoyer des informations promotionnelles (avec votre consentement)
- Respecter nos obligations légales

## 4. Base légale du traitement

Le traitement de vos données repose sur :

- L'exécution du contrat de vente
- Votre consentement (newsletter, cookies)
- Nos obligations légales (facturation, comptabilité)
- Notre intérêt légitime (amélioration des services)

## 5. Conservation des données

Nous conservons vos données :

- Données de compte : pendant la durée de votre relation client + 3 ans
- Données de commande : 10 ans (obligations comptables)
- Données de prospection : 3 ans à compter du dernier contact

## 6. Partage des données

Vos données peuvent être partagées avec :

- Nos prestataires de livraison (pour assurer la livraison)
- Nos prestataires de paiement (pour traiter les paiements)
- Les autorités légales (si requis par la loi)

Nous ne vendons jamais vos données à des tiers.

## 7. Vos droits

Conformément au RGPD, vous disposez des droits suivants :

- **Droit d'accès :** Obtenir une copie de vos données
- **Droit de rectification :** Corriger vos données inexactes
- **Droit à l'effacement :** Supprimer vos données
- **Droit à la limitation :** Limiter le traitement de vos données
- **Droit à la portabilité :** Recevoir vos données dans un format structuré
- **Droit d'opposition :** Vous opposer au traitement de vos données
- **Droit de retirer votre consentement :** À tout moment

Pour exercer vos droits, contactez-nous à : ${settings?.contactEmail || ""}

## 8. Sécurité des données

Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :

- Chiffrement SSL/TLS
- Accès restreint aux données
- Sauvegardes régulières
- Surveillance des accès

## 9. Cookies

Pour plus d'informations sur l'utilisation des cookies, consultez notre [Politique de cookies](/cookies).

## 10. Modifications

Nous nous réservons le droit de modifier cette politique. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.

## 11. Contact

Pour toute question concernant cette politique, contactez-nous :

**Email :** ${settings?.contactEmail || ""}
**Téléphone :** ${settings?.contactPhone || ""}
**Adresse :** ${settings?.address?.street || ""}, ${settings?.address?.postalCode || ""} ${settings?.address?.city || ""}

## 12. Autorité de contrôle

En cas de litige, vous pouvez contacter la CNIL (Commission Nationale de l'Informatique et des Libertés) :

**CNIL**
3 Place de Fontenoy
TSA 80715
75334 PARIS CEDEX 07
Téléphone : 01 53 73 22 22
Site web : [www.cnil.fr](https://www.cnil.fr)
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
                    Politique de Confidentialité - {settings?.siteName || "Mon bois de chauffe"}
                </title>
                <meta
                    name="description"
                    content="Notre politique de confidentialité et protection des données personnelles"
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
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Politique de Confidentialité
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Comment nous collectons, utilisons et protégeons vos données
                                personnelles
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
                                className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-gray-600 prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-700"
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
