import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    AlertCircle,
    CheckCircle,
    ChevronDown,
    Clock,
    MapPin,
    Package,
    Phone,
    Truck,
} from "lucide-react"

import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/ActionButton"
import SeoHead from "@/components/layout/SeoHead"
import { cloudinaryVideoPosterUrl, cloudinaryVideoUrl } from "@/lib/cloudinary-url"
import { useSettings } from "@/hooks/useSettings"
import { FAQ_ITEMS } from "@/constants/faq"
import { localized, useFormatter, useT } from "@/lib/i18n"

/**
 * La page livraison.
 *
 * **Elle décrivait une entreprise qui n'existe pas.** Trois zones autour de
 * Lyon, un « entrepôt lyonnais », une « Livraison Express en moins de 24 h »,
 * une « Livraison Premium avec mise en tas », un suivi par SMS à chaque étape,
 * et des seuils de gratuité — 200 €, 300 €, 500 € — qui ne correspondaient à
 * aucun réglage. Le site vend en Allemagne, livre par Land en quatre à cinq
 * jours, et ne propose qu'un seul service de livraison.
 *
 * Les tarifs affichés ici sont ceux de la base, les mêmes que ceux appliqués au
 * moment de payer. C'est la raison d'être de cette page : personne ne devrait
 * découvrir le coût du transport à la dernière étape du tunnel.
 */

/** Fond décoratif de l'en-tête. Sur Cloudinary, jamais dans `public/`. */
const HERO_VIDEO = "mbdc/videos/hero-background"

/** Le marché principal : sa grille est détaillée, les autres pays résumés. */
const HOME_COUNTRY = "Deutschland"

export default function LivraisonPage() {
    const t = useT()
    const format = useFormatter()
    const { locale } = useRouter()
    const { shippingZones, freeShippingThreshold, contactPhone, whatsappLink } = useSettings()
    const [openQuestion, setOpenQuestion] = useState(null)

    const homeZone = shippingZones?.find((zone) => zone.country === HOME_COUNTRY)
    const otherZones = shippingZones?.filter((zone) => zone.country !== HOME_COUNTRY) ?? []

    // Les régions sont triées par tarif : le lecteur cherche d'abord combien
    // ça lui coûte, pas où se situe son Land dans l'alphabet.
    const regions = [...(homeZone?.regions ?? [])].sort((a, b) => a.cost - b.cost)

    const steps = [
        { icon: CheckCircle, title: t("delivery.step1"), text: t("delivery.step1Text") },
        { icon: Clock, title: t("delivery.step2"), text: t("delivery.step2Text") },
        { icon: Package, title: t("delivery.step3"), text: t("delivery.step3Text") },
        { icon: Phone, title: t("delivery.step4"), text: t("delivery.step4Text") },
        { icon: Truck, title: t("delivery.step5"), text: t("delivery.step5Text") },
    ]

    const preparations = [
        { title: t("delivery.prep1"), text: t("delivery.prep1Text") },
        { title: t("delivery.prep2"), text: t("delivery.prep2Text") },
        { title: t("delivery.prep3"), text: t("delivery.prep3Text") },
        { title: t("delivery.prep4"), text: t("delivery.prep4Text") },
    ]

    // Les questions sur la livraison sont déjà écrites dans le module de FAQ,
    // dans les deux langues : les recopier ici en ferait deux versions à tenir
    // à jour, qui divergeraient à la première correction.
    const questions = FAQ_ITEMS.filter((item) => item.category === "delivery").map((item) => ({
        question: localized(item.question, locale),
        answer: localized(item.answer, locale),
    }))

    return (
        <>
            <SeoHead
                title={t("meta.deliveryTitle")}
                description={t("meta.deliveryDescription")}
            />

            <div className="min-h-screen bg-white">
                <Header />

                <main>
                    {/* En-tête */}
                    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gray-900">
                        <div className="absolute inset-0 z-0">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="none"
                                className="h-full w-full object-cover opacity-60"
                                poster={cloudinaryVideoPosterUrl(HERO_VIDEO, { width: 1600, height: 900 })}
                                src={cloudinaryVideoUrl(HERO_VIDEO, { width: 1280, maxBitrate: "700k" })}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/65 to-gray-900/40" />
                        </div>

                        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
                            >
                                <Truck className="mr-2 h-4 w-4" aria-hidden="true" />
                                {t("delivery.badge")}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="mb-6 text-4xl font-bold leading-tight text-white lg:text-5xl"
                            >
                                {t("delivery.title")}
                                <span className="block text-amber-400">{t("delivery.titleAccent")}</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300"
                            >
                                {t("delivery.subtitle")}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                            >
                                <Link href="/shop">
                                    <Button variant="primary" size="lg">{t("delivery.ctaShop")}</Button>
                                </Link>
                                <Link href="/contact">
                                    <span className="font-semibold text-white underline decoration-white/40 underline-offset-8 transition-colors hover:decoration-white">
                                        {t("delivery.ctaContact")}
                                    </span>
                                </Link>
                            </motion.div>
                        </div>
                    </section>

                    {/* Tarifs — la donnée vient des paramètres, comme au panier */}
                    <section className="bg-white py-16 lg:py-20">
                        <div className="mx-auto max-w-5xl px-4 sm:px-6">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                                    {t("delivery.ratesTitle")}
                                </h2>
                                <p className="mt-3 leading-relaxed text-gray-600">{t("delivery.ratesIntro")}</p>
                            </div>

                            {regions.length > 0 ? (
                                <>
                                    <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 text-gray-500">
                                                <tr>
                                                    <th scope="col" className="px-5 py-3 font-medium">
                                                        {t("delivery.ratesRegion")}
                                                    </th>
                                                    <th scope="col" className="px-5 py-3 text-right font-medium">
                                                        {t("delivery.ratesPrice")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {regions.map((region) => (
                                                    <tr key={region.name}>
                                                        <th scope="row" className="px-5 py-3 font-normal text-gray-900">
                                                            {t(`regions.${region.name}`)}
                                                        </th>
                                                        <td className="px-5 py-3 text-right font-semibold tabular-nums text-gray-900">
                                                            {format.price(region.cost)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {freeShippingThreshold ? (
                                        <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                            {t("delivery.ratesFreeNotice", {
                                                amount: format.price(freeShippingThreshold),
                                            })}
                                        </p>
                                    ) : null}

                                    {otherZones.length > 0 ? (
                                        <div className="mt-10">
                                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                                {t("delivery.ratesOtherCountries")}
                                            </h3>
                                            <ul className="mt-4 flex flex-wrap gap-2">
                                                {otherZones.map((zone) => (
                                                    <li
                                                        key={zone.country}
                                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700"
                                                    >
                                                        {t(`countries.${zone.country}`)}
                                                        <span className="ml-2 font-semibold tabular-nums">
                                                            {format.price(Math.min(...zone.regions.map((r) => r.cost)))}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}
                                </>
                            ) : (
                                <p className="mt-8 text-sm text-gray-500">{t("delivery.ratesUnavailable")}</p>
                            )}
                        </div>
                    </section>

                    {/* Étapes */}
                    <section className="border-y border-gray-100 bg-gray-50 py-16 lg:py-20">
                        <div className="mx-auto max-w-5xl px-4 sm:px-6">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                                    {t("delivery.stepsTitle")}
                                </h2>
                                <p className="mt-3 leading-relaxed text-gray-600">{t("delivery.stepsIntro")}</p>
                            </div>

                            <ol className="mt-10 space-y-6">
                                {steps.map((step, index) => {
                                    const Icon = step.icon
                                    return (
                                        <motion.li
                                            key={step.title}
                                            initial={{ opacity: 0, y: 12 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: Math.min(index, 4) * 0.05 }}
                                            className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5"
                                        >
                                            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-100">
                                                <Icon className="h-5 w-5 text-amber-700" aria-hidden="true" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    <span className="mr-2 tabular-nums text-amber-600">{index + 1}.</span>
                                                    {step.title}
                                                </h3>
                                                <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.text}</p>
                                            </div>
                                        </motion.li>
                                    )
                                })}
                            </ol>

                            <p className="mt-6 flex items-start gap-2 text-sm text-gray-500">
                                <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                {t("delivery.leadTimeNotice")}
                            </p>
                        </div>
                    </section>

                    {/* Préparation */}
                    <section className="bg-white py-16 lg:py-20">
                        <div className="mx-auto max-w-5xl px-4 sm:px-6">
                            <h2 className="max-w-2xl text-2xl font-bold text-gray-900 lg:text-3xl">
                                {t("delivery.prepTitle")}
                            </h2>

                            <div className="mt-10 grid gap-6 sm:grid-cols-2">
                                {preparations.map((item) => (
                                    <div key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                                        <div className="mb-3 flex items-center gap-2">
                                            <MapPin className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                        </div>
                                        <p className="text-sm leading-relaxed text-gray-600">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Questions */}
                    <section className="border-t border-gray-100 bg-gray-50 py-16 lg:py-20">
                        <div className="mx-auto max-w-3xl px-4 sm:px-6">
                            <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                                {t("delivery.faqTitle")}
                            </h2>

                            <div className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
                                {questions.map((item, index) => {
                                    const isOpen = openQuestion === index
                                    return (
                                        <div key={item.question}>
                                            <button
                                                type="button"
                                                onClick={() => setOpenQuestion(isOpen ? null : index)}
                                                aria-expanded={isOpen}
                                                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                            >
                                                <span className="font-medium text-gray-900">{item.question}</span>
                                                <ChevronDown
                                                    aria-hidden="true"
                                                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>
                                            {isOpen ? (
                                                <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600">
                                                    {item.answer}
                                                </p>
                                            ) : null}
                                        </div>
                                    )
                                })}
                            </div>

                            <Link
                                href="/faq"
                                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
                            >
                                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                                {t("delivery.faqCta")}
                            </Link>
                        </div>
                    </section>

                    {/* Appel à l'action */}
                    <section className="bg-gray-900 py-16">
                        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                            <h2 className="text-2xl font-bold text-white lg:text-3xl">{t("delivery.finalTitle")}</h2>
                            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-gray-300">
                                {t("delivery.finalText")}
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link href="/shop">
                                    <Button variant="primary" size="lg">{t("delivery.ctaShop")}</Button>
                                </Link>
                                {contactPhone ? (
                                    <a
                                        href={whatsappLink || `tel:${contactPhone}`}
                                        className="font-semibold text-white underline decoration-white/40 underline-offset-8 transition-colors hover:decoration-white"
                                    >
                                        {contactPhone}
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    )
}
