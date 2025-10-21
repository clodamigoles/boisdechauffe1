import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Head from "next/head"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { FileText } from "lucide-react"
import { useTranslation } from "@/lib/useTranslation"
import { loadTranslations } from "@/lib/i18n-server"

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
    const { t } = useTranslation('cgv')
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
                    // Toujours utiliser le contenu traduit
                    setContent(generateTranslatedContent(data.data, t))
                }
            } catch (error) {
                console.error("Erreur lors du chargement du contenu:", error)
                setContent(generateTranslatedContent({}, t))
            } finally {
                setIsLoading(false)
            }
        }
        loadContent()
    }, [t])

    const generateTranslatedContent = (settings, t) => {
        const companyName = settings?.companyName || settings?.siteName || "Mon bois de chauffe"
        const freeShippingThreshold = settings?.freeShippingThreshold || 500
        const contactEmail = settings?.contactEmail || ""
        const contactPhone = settings?.contactPhone || ""
        const address = `${settings?.address?.street || ""}, ${settings?.address?.postalCode || ""} ${settings?.address?.city || ""}`
        
        return `
# ${t('content.title')}

## ${t('content.section1.title')}

${t('content.section1.content', { companyName })}

## ${t('content.section2.title')}

${t('content.section2.intro')}

${t('content.section2.items').map((item, i) => `- ${item}`).join('\n')}

## ${t('content.section3.title')}

${t('content.section3.intro')}

**${t('content.section3.delivery.title')}**
${t('content.section3.delivery.items').map((item, i) => `- ${item.replace('{{freeShippingThreshold}}', freeShippingThreshold)}`).join('\n')}

${t('content.section3.outro')}

## ${t('content.section4.title')}

### ${t('content.section4.subsection1.title')}

${t('content.section4.subsection1.steps').map((step, i) => `${i + 1}. ${step}`).join('\n')}

### ${t('content.section4.subsection2.title')}

${t('content.section4.subsection2.content')}

## ${t('content.section5.title')}

### ${t('content.section5.subsection1.title')}

${t('content.section5.subsection1.intro')}
${t('content.section5.subsection1.items').map(item => `- ${item}`).join('\n')}

### ${t('content.section5.subsection2.title')}

${t('content.section5.subsection2.content')}

### ${t('content.section5.subsection3.title')}

${t('content.section5.subsection3.content')}

## ${t('content.section6.title')}

### ${t('content.section6.subsection1.title')}

${t('content.section6.subsection1.content')}

### ${t('content.section6.subsection2.title')}

${t('content.section6.subsection2.items').map(item => `- ${item}`).join('\n')}

### ${t('content.section6.subsection3.title')}

${t('content.section6.subsection3.items').map(item => `- ${item}`).join('\n')}

## ${t('content.section7.title')}

${t('content.section7.paragraph1')}

${t('content.section7.paragraph2')}

## ${t('content.section8.title')}

### ${t('content.section8.subsection1.title')}

${t('content.section8.subsection1.intro')}
${t('content.section8.subsection1.items').map(item => `- ${item}`).join('\n')}

### ${t('content.section8.subsection2.title')}

${t('content.section8.subsection2.content', { contactEmail })}

## ${t('content.section9.title')}

${t('content.section9.content')}

## ${t('content.section10.title')}

${t('content.section10.content')}

## ${t('content.section11.title')}

${t('content.section11.content')}

## ${t('content.section12.title')}

${t('content.section12.content')}

## ${t('content.section13.title')}

${t('content.section13.content')}

## ${t('content.section14.title')}

${t('content.section14.paragraph1')}

${t('content.section14.paragraph2')}

**${t('content.section14.mediatorTitle')}**
${t('content.section14.mediatorNote')}

## ${t('content.section15.title')}

${t('content.section15.intro')}

**${t('content.section15.email')}** ${contactEmail}
**${t('content.section15.phone')}** ${contactPhone}
**${t('content.section15.address')}** ${address}

## ${t('content.section16.title')}

${t('content.section16.content')}
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
                    {t('seo.title', { siteName: settings?.siteName || "Mon bois de chauffe" })}
                </title>
                <meta
                    name="description"
                    content={t('seo.description')}
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
                                    {t('header.title')}
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                {t('header.subtitle')}
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
                                {t('lastUpdate', { 
                                    date: settings?.updatedAt
                                        ? new Date(settings.updatedAt).toLocaleDateString()
                                        : new Date().toLocaleDateString()
                                })}
                            </p>
                        </div>
                    </div>
                </motion.main>

                <Footer />
            </div>
        </>
    )
}

export async function getServerSideProps({ locale }) {
    try {
        // Charger les traductions
        const translations = await loadTranslations(locale || 'en', ['common', 'cgv'])
        
        return {
            props: {
                translations
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement des traductions:", error)
        
        const translations = await loadTranslations(locale || 'en', ['common', 'cgv'])
        
        return {
            props: {
                translations
            }
        }
    }
}
