import Link from "next/link"
import { useRouter } from "next/router"

import { LOCALES, LOCALE_NAMES, useT } from "@/lib/i18n"

/**
 * Le sélecteur de langue.
 *
 * Il remplace la pastille flottante de GTranslate, qui recouvrait le contenu
 * dans un coin de l'écran et changeait la langue sans changer l'URL — la page
 * traduite n'était donc ni partageable, ni indexable, ni conservée au clic
 * suivant.
 *
 * Ici, chaque langue est un vrai lien vers la même page dans l'autre langue.
 * Deux conséquences qui comptent : le lien se copie, et Next mémorise le choix
 * dans le cookie `NEXT_LOCALE`, si bien que la détection automatique ne vient
 * plus contredire le visiteur à la visite suivante.
 */
export default function LocaleSwitcher({ className = "", tone = "dark" }) {
    const router = useRouter()
    const t = useT()

    // `asPath` est le chemin sans préfixe de langue : passer le même à `href`
    // avec `locale` laisse Next poser le bon préfixe.
    const path = router.asPath

    const toneClasses =
        tone === "light"
            ? {
                active: "bg-white/20 text-white",
                idle: "text-white/70 hover:text-white hover:bg-white/10",
                frame: "border-white/25",
            }
            : {
                active: "bg-amber-50 text-amber-700",
                idle: "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                frame: "border-gray-200",
            }

    return (
        <div
            className={`inline-flex items-center rounded-lg border ${toneClasses.frame} p-0.5 ${className}`}
            role="group"
            aria-label={t("nav.chooseLanguage")}
        >
            {LOCALES.map((locale) => {
                const isActive = router.locale === locale
                return (
                    <Link
                        key={locale}
                        href={path}
                        locale={locale}
                        // `scroll={false}` : changer de langue n'est pas une
                        // navigation, le lecteur veut rester où il était.
                        scroll={false}
                        hrefLang={locale}
                        aria-current={isActive ? "true" : undefined}
                        className={`rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors duration-200 ${isActive ? toneClasses.active : toneClasses.idle
                            }`}
                    >
                        <span aria-hidden="true">{locale}</span>
                        <span className="sr-only">{LOCALE_NAMES[locale]}</span>
                    </Link>
                )
            })}
        </div>
    )
}
