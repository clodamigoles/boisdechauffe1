import connectDB from "@/lib/mongoose"
import { Category, Product } from "@/models"
import { DEFAULT_LOCALE, LOCALES, LOCALE_TAGS } from "@/lib/i18n"

/**
 * Le plan du site, engendré à la demande.
 *
 * `public/sitemap.xml` contenait une seule URL — la racine — datée du
 * 3 mars 2024. Aucun produit, aucune catégorie, aucune des deux langues :
 * autant ne pas en avoir.
 *
 * Chaque page est déclarée une fois par langue, et chaque entrée porte les
 * `xhtml:link` de ses variantes. C'est la forme qu'attend Google pour un site
 * multilingue : sans elles, les deux versions se concurrencent au lieu de se
 * désigner l'une l'autre.
 */
const STATIC_PATHS = [
    { path: "", changefreq: "daily", priority: "1.0" },
    { path: "/shop", changefreq: "daily", priority: "0.9" },
    { path: "/livraison", changefreq: "monthly", priority: "0.7" },
    { path: "/faq", changefreq: "monthly", priority: "0.7" },
    { path: "/contact", changefreq: "monthly", priority: "0.6" },
    { path: "/suivi", changefreq: "monthly", priority: "0.4" },
    { path: "/cgv", changefreq: "yearly", priority: "0.3" },
    { path: "/mentions-legales", changefreq: "yearly", priority: "0.3" },
    { path: "/politique-confidentialite", changefreq: "yearly", priority: "0.3" },
    { path: "/cookies", changefreq: "yearly", priority: "0.3" },
]

function localizedUrl(siteUrl, locale, path) {
    const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`
    return `${siteUrl}${prefix}${path}` || `${siteUrl}/`
}

/** Une entrée `<url>`, avec le lien vers chacune de ses traductions. */
function urlEntry(siteUrl, path, { lastmod, changefreq, priority }) {
    return LOCALES.map((locale) => {
        const alternates = LOCALES.map(
            (other) =>
                `    <xhtml:link rel="alternate" hreflang="${LOCALE_TAGS[other]}" href="${localizedUrl(siteUrl, other, path)}"/>`,
        ).join("\n")

        return `  <url>
    <loc>${localizedUrl(siteUrl, locale, path)}</loc>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl(siteUrl, DEFAULT_LOCALE, path)}"/>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    }).join("\n")
}

export async function getServerSideProps({ res }) {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://monboisdechauffe.com").replace(/\/$/, "")

    await connectDB()

    const [products, categories] = await Promise.all([
        Product.find({ isActive: true }).select("slug updatedAt").lean(),
        Category.find({ isActive: true }).select("slug updatedAt").lean(),
    ])

    const entries = [
        ...STATIC_PATHS.map((entry) => urlEntry(siteUrl, entry.path, entry)),
        ...categories.map((category) =>
            urlEntry(siteUrl, `/shop?category=${category.slug}`, {
                lastmod: new Date(category.updatedAt).toISOString().slice(0, 10),
                changefreq: "weekly",
                priority: "0.8",
            }),
        ),
        ...products.map((product) =>
            urlEntry(siteUrl, `/produits/${product.slug}`, {
                lastmod: new Date(product.updatedAt).toISOString().slice(0, 10),
                changefreq: "weekly",
                priority: "0.8",
            }),
        ),
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>`

    res.setHeader("Content-Type", "application/xml; charset=utf-8")
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400")
    res.write(xml)
    res.end()

    return { props: {} }
}

export default function Sitemap() {
    return null
}
