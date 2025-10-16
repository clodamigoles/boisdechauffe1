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

export default function MentionsLegalesPage() {
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
                        data.data.legalContent?.mentionsLegales ||
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
# Mentions Légales

## 1. Éditeur du site

**Raison sociale :** ${settings?.companyName || settings?.siteName || "Mon bois de chauffe"}

**Adresse :** ${settings?.address?.street || ""}, ${settings?.address?.postalCode || ""} ${settings?.address?.city || ""}, ${settings?.address?.country || ""}

**Téléphone :** ${settings?.contactPhone || ""}

**Email :** ${settings?.contactEmail || ""}

**SIREN :** ${settings?.siren || ""}

**SIRET :** ${settings?.siret || ""}

${settings?.vatNumber ? `**Numéro de TVA :** ${settings.vatNumber}` : ""}

## 2. Directeur de la publication

Le directeur de la publication est le représentant légal de l'entreprise.

## 3. Hébergeur du site

Le site est hébergé par :

**Vercel Inc.**
340 S Lemon Ave #4133
Walnut, CA 91789
États-Unis

## 4. Propriété intellectuelle

L'ensemble du contenu de ce site (textes, images, vidéos, logos) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.

## 5. Données personnelles

Les informations collectées sur ce site sont traitées conformément à notre [Politique de confidentialité](/politique-confidentialite).

## 6. Cookies

Pour en savoir plus sur l'utilisation des cookies sur notre site, consultez notre [Politique de cookies](/cookies).

## 7. Responsabilité

L'éditeur s'efforce d'assurer l'exactitude des informations présentes sur le site, mais ne saurait être tenu responsable des erreurs ou omissions.

## 8. Droit applicable

Le présent site est soumis au droit français. Tout litige sera porté devant les tribunaux compétents.
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
                <title>Mentions Légales - {settings?.siteName || "Mon bois de chauffe"}</title>
                <meta
                    name="description"
                    content="Mentions légales et informations légales de notre site"
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
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-amber-600" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Mentions Légales
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Informations légales et coordonnées de l'éditeur du site
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
                                className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-gray-600 prose-strong:text-gray-900 prose-a:text-amber-600 hover:prose-a:text-amber-700"
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
