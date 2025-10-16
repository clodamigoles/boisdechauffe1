import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Head from "next/head"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Cookie } from "lucide-react"

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

export default function CookiesPage() {
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
                        data.data.legalContent?.cookies || generateDefaultContent(data.data),
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
# Politique de Cookies

## 1. Qu'est-ce qu'un cookie ?

Un cookie est un petit fichier texte déposé sur votre ordinateur ou appareil mobile lors de votre visite sur notre site. Les cookies permettent de reconnaître votre navigateur et de mémoriser certaines informations.

## 2. Types de cookies utilisés

### 2.1 Cookies strictement nécessaires

Ces cookies sont essentiels au fonctionnement du site :

- **Cookies de session :** Maintiennent votre connexion pendant votre visite
- **Cookies de panier :** Conservent les articles de votre panier
- **Cookies de sécurité :** Protègent votre navigation

**Durée de conservation :** Session ou 30 jours maximum

**Base légale :** Intérêt légitime (fonctionnement du site)

### 2.2 Cookies de performance

Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site :

- Pages visitées
- Durée de visite
- Parcours de navigation
- Messages d'erreur rencontrés

**Durée de conservation :** 13 mois

**Base légale :** Consentement

### 2.3 Cookies de fonctionnalité

Ces cookies permettent de mémoriser vos préférences :

- Langue préférée
- Région de livraison
- Préférences d'affichage

**Durée de conservation :** 12 mois

**Base légale :** Consentement

### 2.4 Cookies publicitaires

Ces cookies sont utilisés pour afficher des publicités pertinentes :

- Suivi des conversions
- Publicités personnalisées
- Remarketing

**Durée de conservation :** Variable selon le fournisseur

**Base légale :** Consentement

## 3. Cookies tiers

Notre site peut utiliser des services tiers qui déposent leurs propres cookies :

**Google Analytics :**
- Analyse du trafic
- Statistiques de visite
- [En savoir plus](https://policies.google.com/technologies/cookies)

**Facebook Pixel :**
- Suivi des conversions
- Remarketing
- [En savoir plus](https://www.facebook.com/policies/cookies/)

## 4. Gestion des cookies

### 4.1 Paramètres du navigateur

Vous pouvez configurer votre navigateur pour :

- Accepter tous les cookies
- Refuser tous les cookies
- Être averti avant d'accepter un cookie
- Supprimer les cookies existants

**Chrome :**
Paramètres > Confidentialité et sécurité > Cookies

**Firefox :**
Paramètres > Vie privée et sécurité > Cookies et données de sites

**Safari :**
Préférences > Confidentialité > Cookies et données de sites web

**Edge :**
Paramètres > Confidentialité, recherche et services > Cookies

### 4.2 Conséquences du refus

Le refus des cookies peut entraîner :

- Impossibilité d'utiliser certaines fonctionnalités
- Panier non sauvegardé
- Préférences non mémorisées
- Expérience utilisateur dégradée

### 4.3 Gestion de vos préférences

Vous pouvez modifier vos préférences de cookies à tout moment en cliquant sur "Gérer mes cookies" en bas de page.

## 5. Cookies et données personnelles

Les cookies peuvent contenir des données personnelles. Ces données sont traitées conformément à notre [Politique de confidentialité](/politique-confidentialite).

## 6. Durée de conservation

Les cookies sont conservés pour une durée maximale de 13 mois, conformément aux recommandations de la CNIL.

## 7. Cookies Flash

Nous n'utilisons pas de cookies Flash (LSO - Local Shared Objects) sur notre site.

## 8. Mise à jour de la politique

Cette politique peut être mise à jour pour refléter les changements dans nos pratiques ou pour se conformer aux évolutions légales.

## 9. Liste des cookies utilisés

| Nom | Type | Durée | Finalité |
|-----|------|-------|----------|
| session_id | Nécessaire | Session | Maintient la session utilisateur |
| cart_items | Nécessaire | 30 jours | Sauvegarde le panier |
| consent | Nécessaire | 12 mois | Mémorise le consentement cookies |
| _ga | Analytique | 2 ans | Google Analytics |
| _fbp | Publicitaire | 3 mois | Facebook Pixel |

## 10. Contact

Pour toute question concernant notre utilisation des cookies :

**Email :** ${settings?.contactEmail || ""}
**Téléphone :** ${settings?.contactPhone || ""}

## 11. En savoir plus

Pour plus d'informations sur les cookies et la protection de votre vie privée :

- [CNIL - Les cookies](https://www.cnil.fr/fr/cookies-et-autres-traceurs)
- [Commission Européenne - Protection des données](https://ec.europa.eu/info/law/law-topic/data-protection_fr)

## 12. Consentement

En continuant à naviguer sur ce site, vous acceptez l'utilisation des cookies strictement nécessaires. Pour les autres cookies, votre consentement explicite est requis via la bannière de cookies.
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
                <title>Politique de Cookies - {settings?.siteName || "Mon bois de chauffe"}</title>
                <meta
                    name="description"
                    content="Notre politique d'utilisation des cookies et traceurs"
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
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Cookie className="w-6 h-6 text-purple-600" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Politique de Cookies
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Comment nous utilisons les cookies et comment les gérer
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
                                className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-600 prose-strong:text-gray-900 prose-a:text-purple-600 hover:prose-a:text-purple-700 prose-table:text-sm"
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
                                        .replace(/^\| (.+)/gm, (match) => {
                                            const cells = match
                                                .slice(2)
                                                .split("|")
                                                .map((cell) => cell.trim())
                                            return (
                                                "<tr>" +
                                                cells.map((cell) => `<td>${cell}</td>`).join("") +
                                                "</tr>"
                                            )
                                        })
                                        .replace(/(<tr>.*<\/tr>)/s, "<table>$1</table>")
                                        .replace(/^(?!<[h|p|t])/gm, "<p>")
                                        .replace(/(?<![>])$/gm, "</p>")
                                        .replace(/<p><\/p>/g, "")
                                        .replace(/<p>(<h[1-6])/g, "$1")
                                        .replace(/(<\/h[1-6]>)<\/p>/g, "$1")
                                        .replace(/<p>(<table)/g, "$1")
                                        .replace(/(<\/table>)<\/p>/g, "$1"),
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
