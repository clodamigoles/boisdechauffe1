import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"

import Header from "./Header"
import Footer from "./Footer"
import SeoHead from "./SeoHead"
import { localized, useFormatter, useT } from "@/lib/i18n"

/**
 * Le gabarit commun des pages légales.
 *
 * Les quatre — mentions légales, CGV, confidentialité, cookies — étaient
 * quatre fichiers de deux à trois cents lignes, identiques à la couleur d'une
 * icône près, chacun portant sa propre copie d'un convertisseur Markdown écrit
 * à la main et son propre repli français écrit en dur. Corriger le rendu d'une
 * liste à puces demandait de le corriger quatre fois.
 *
 * Le contenu vient des paramètres, en `{ de, fr }`, et s'édite depuis
 * l'administration. Quand il manque, la page le dit plutôt que d'afficher un
 * texte générique qui décrirait une autre entreprise.
 */

/**
 * Markdown → HTML, pour le sous-ensemble que ces textes utilisent.
 *
 * Le contenu ne vient pas d'un visiteur mais de l'administration, protégée par
 * mot de passe : c'est ce qui rend `dangerouslySetInnerHTML` acceptable ici.
 * Les balises HTML brutes présentes dans le texte sont donc conservées — les
 * documents en contiennent (tableaux, liens), et les échapper les casserait.
 */
function renderMarkdown(markdown) {
    const escapeAttr = (value) => value.replace(/"/g, "&quot;")

    return markdown
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[(.+?)\]\((.+?)\)/g, (_, label, href) => `<a href="${escapeAttr(href)}">${label}</a>`)
        // Les listes : chaque groupe de lignes commençant par « - » devient un
        // <ul>. La version précédente les rendait en paragraphes avec un tiret.
        .replace(/(?:^- .+\n?)+/gm, (block) => {
            const items = block
                .trimEnd()
                .split("\n")
                .map((line) => `<li>${line.replace(/^- /, "")}</li>`)
                .join("")
            return `<ul>${items}</ul>`
        })
        .split(/\n{2,}/)
        .map((block) => (/^\s*<(h[1-6]|ul|ol|table|p)/.test(block.trim()) ? block : `<p>${block.trim()}</p>`))
        .join("\n")
        .replace(/<p>\s*<\/p>/g, "")
}

export default function LegalPage({ documentKey, titleKey, introKey, icon: Icon = FileText }) {
    const t = useT()
    const format = useFormatter()
    const { locale } = useRouter()

    const [settings, setSettings] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        fetch("/api/settings")
            .then((response) => response.json())
            .then((payload) => {
                if (!cancelled && payload?.success) setSettings(payload.data)
            })
            .catch(() => undefined)
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [])

    const content = localized(settings?.legalContent?.[documentKey], locale)

    return (
        <>
            <SeoHead title={t(titleKey)} description={t(introKey)} />

            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="pt-20 pb-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <div className="mb-4 flex items-center space-x-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                                    <Icon className="h-6 w-6 text-amber-700" aria-hidden="true" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl">{t(titleKey)}</h1>
                            </div>
                            <p className="text-gray-600">{t(introKey)}</p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
                        >
                            {isLoading ? (
                                <p className="text-sm text-gray-500">{t("common.loading")}</p>
                            ) : content ? (
                                <div
                                    className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-xl prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-lg prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-a:text-amber-700 hover:prose-a:text-amber-800"
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                                />
                            ) : (
                                // Un texte générique s'affichait ici quand la base
                                // était vide — il décrivait une autre société, dans
                                // une autre langue, sous un autre droit.
                                <p className="text-sm text-gray-500">{t("legal.missing")}</p>
                            )}
                        </motion.div>

                        {settings?.updatedAt ? (
                            <p className="mt-8 text-center text-sm text-gray-500">
                                {t("legal.updatedOn", { date: format.date(settings.updatedAt) })}
                            </p>
                        ) : null}
                    </div>
                </main>

                <Footer />
            </div>
        </>
    )
}
