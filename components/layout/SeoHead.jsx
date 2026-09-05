import Head from "next/head"
import { useRouter } from "next/router"

import { DEFAULT_LOCALE, LOCALES, LOCALE_TAGS } from "@/lib/i18n"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://monboisdechauffe.com").replace(/\/$/, "")

/**
 * L'en-tête commun à toutes les pages : titre, description, canonique et
 * `hreflang`.
 *
 * C'est la moitié manquante de la traduction. Traduire le corps d'une page ne
 * la fait pas apparaître dans un résultat de recherche allemand : ce sont le
 * `<title>`, la `<meta description>` et les `hreflang` qui disent à Google
 * qu'il existe deux versions de cette page, laquelle servir à qui, et qu'elles
 * ne sont pas du contenu dupliqué.
 *
 * Chaque page rend ce composant avec son titre et sa description déjà
 * traduits ; les liens entre langues sont dérivés du chemin courant, donc
 * justes sans que l'appelant ait à s'en occuper.
 */
export default function SeoHead({
    title,
    description,
    image,
    noindex = false,
    children,
}) {
    const router = useRouter()

    // `asPath` porte le chemin réel, sans le préfixe de langue — c'est ce
    // qu'il faut pour construire l'URL de chaque version. On coupe la partie
    // requête : `?category=x` ne doit pas se retrouver dans une canonique.
    const path = router.asPath.split("?")[0].split("#")[0]
    const cleanPath = path === "/" ? "" : path

    const urlFor = (locale) =>
        locale === DEFAULT_LOCALE
            ? `${SITE_URL}${cleanPath}` || `${SITE_URL}/`
            : `${SITE_URL}/${locale}${cleanPath}`

    const canonical = urlFor(router.locale ?? DEFAULT_LOCALE)
    const ogImage = image?.startsWith("http") ? image : `${SITE_URL}${image || "/images/logo.svg"}`

    return (
        <Head>
            <title>{title}</title>
            {description ? <meta name="description" content={description} /> : null}

            <link rel="canonical" href={canonical} />

            {/* Une paire par langue, plus `x-default` : sans lui, un visiteur
                dont la langue n'est ni l'allemand ni le français n'a pas de
                version désignée et Google en choisit une au hasard. */}
            {LOCALES.map((locale) => (
                <link
                    key={locale}
                    rel="alternate"
                    hrefLang={LOCALE_TAGS[locale]}
                    href={urlFor(locale)}
                />
            ))}
            <link rel="alternate" hrefLang="x-default" href={urlFor(DEFAULT_LOCALE)} />

            {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}

            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            {description ? <meta property="og:description" content={description} /> : null}
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:locale" content={LOCALE_TAGS[router.locale ?? DEFAULT_LOCALE].replace("-", "_")} />
            <meta name="twitter:card" content="summary_large_image" />

            {children}
        </Head>
    )
}
