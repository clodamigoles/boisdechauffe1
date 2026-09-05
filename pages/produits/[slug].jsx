import { useRouter } from "next/router"
import Head from "next/head"
import { motion } from "framer-motion"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ProductDetailHero from "../../components/product/ProductDetailHero"
import ProductDetailInfo from "../../components/product/ProductDetailInfo"
import ProductDetailSpecs from "../../components/product/ProductDetailSpecs"
import ProductDetailActions from "../../components/product/ProductDetailActions"
import SimilarProducts from "../../components/product/SimilarProducts"
import ProductBreadcrumb from "../../components/product/ProductBreadcrumb"
import { pageVariants } from "../../utils/animations"
import connectDB from "@/lib/mongoose"
import { localizeDoc } from "@/lib/localize-doc"
import { Product } from "@/models"
import SeoHead from "@/components/layout/SeoHead"
import { useT } from "@/lib/i18n"
import { useSettings } from "@/hooks/useSettings"

export default function ProductDetailPage({ product, similarProducts, seoData, error }) {
    const t = useT()
    const { siteName } = useSettings()
    const router = useRouter()

    // `fallback: "blocking"` ne rend jamais cet état côté serveur, mais une
    // navigation client vers une fiche pas encore générée y passe.
    const loading = router.isFallback

    if (loading) {
        return (
            <>
                <Head>
                    <title>{t('common.loading')}</title>
                </Head>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="pt-20">
                        <div className="min-h-screen flex items-center justify-center">
                            <LoadingSpinner size="xl" text={t('common.loading')} />
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        )
    }

    if (error || !product) {
        return (
            <>
                <SeoHead title={t('product.notFound')} noindex />
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="pt-20">
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || t('product.notFound')}</h1>
                                <p className="text-gray-600 mb-6">
                                    {t('product.notFound')}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push("/shop")}
                                    className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                                >
                                    {t('product.backToShop')}
                                </motion.button>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        )
    }

    return (
        <>
            <SeoHead
                title={seoData?.title || product.name}
                description={seoData?.description || product.shortDescription}
                image={product.images?.[0]?.url}
            >
                {/* Données structurées : c'est ce qui fait apparaître le prix
                    et la disponibilité sous le résultat de recherche. */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org/",
                            "@type": "Product",
                            name: product.name,
                            description: product.description || product.shortDescription,
                            image: product.images?.map((img) => img.url) || [],
                            brand: {
                                "@type": "Brand",
                                name: siteName,
                            },
                            category: product.category?.name,
                            offers: {
                                "@type": "Offer",
                                price: product.price,
                                priceCurrency: "EUR",
                                availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                                seller: {
                                    "@type": "Organization",
                                    name: siteName,
                                },
                            },
                            aggregateRating: product.averageRating
                                ? {
                                    "@type": "AggregateRating",
                                    ratingValue: product.averageRating,
                                    reviewCount: product.reviewCount,
                                }
                                : undefined,
                        }),
                    }}
                />
            </SeoHead>

            <div className="min-h-screen bg-gray-50">
                <Header />

                <motion.main className="pt-20" initial="initial" animate="enter" variants={pageVariants}>
                    {/* Breadcrumb */}
                    <div className="bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <ProductBreadcrumb product={product} />
                        </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                            {/* Images du produit */}
                            <ProductDetailHero product={product} />

                            {/* Informations du produit */}
                            <div className="space-y-6">
                                <ProductDetailInfo product={product} />
                                <ProductDetailActions product={product} />
                            </div>
                        </div>

                        {/* Spécifications détaillées */}
                        <ProductDetailSpecs product={product} />

                        {/* Produits similaires */}
                        {similarProducts.length > 0 && <SimilarProducts products={similarProducts} />}
                    </div>
                </motion.main>

                <Footer />
            </div>
        </>
    )
}

/**
 * Les fiches sont générées à la construction, puis régénérées.
 *
 * `fallback: "blocking"` : un produit créé après le dernier déploiement est
 * rendu à la première visite, puis mis en cache — il n'y a pas de page 404 à
 * attendre le prochain build, et pas d'écran de chargement à indexer.
 *
 * `locales` fait que chaque fiche existe dans les deux langues : Next appelle
 * cette fonction une fois par langue, et `locale` décide de la version servie
 * par l'API.
 */
export async function getStaticPaths({ locales }) {
    await connectDB()

    const products = await Product.find({ isActive: true }).select("slug").lean()

    return {
        paths: products.flatMap((product) =>
            locales.map((locale) => ({ params: { slug: product.slug }, locale })),
        ),
        fallback: "blocking",
    }
}

export async function getStaticProps({ params, locale }) {
    await connectDB()

    const product = await Product.findOne({ slug: params.slug, isActive: true })
        .populate("categoryId", "name slug shortDescription")
        .lean()

    if (!product) {
        return { notFound: true, revalidate: 60 }
    }

    const similar = await Product.find({
        _id: { $ne: product._id },
        categoryId: product.categoryId?._id ?? product.categoryId,
        isActive: true,
    })
        .populate("categoryId", "name slug")
        .limit(4)
        .lean()

    const translated = localizeDoc(product, locale)
    const enriched = {
        ...translated,
        category: translated.categoryId,
        discountPercentage:
            product.compareAtPrice && product.compareAtPrice > product.price
                ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                : 0,
        inStock: product.stock > 0,
        isLowStock: product.stock > 0 && product.stock <= 5,
    }

    return {
        // `JSON.parse(JSON.stringify(...))` : Mongo rend des `ObjectId` et des
        // `Date`, que Next refuse de sérialiser vers le composant.
        props: JSON.parse(
            JSON.stringify({
                product: enriched,
                similarProducts: localizeDoc(similar, locale).map((entry) => ({
                    ...entry,
                    category: entry.categoryId,
                    inStock: entry.stock > 0,
                })),
                seoData: {
                    title: enriched.seoTitle || enriched.name,
                    description: enriched.seoDescription || enriched.shortDescription,
                },
                error: null,
            }),
        ),
        revalidate: 600,
    }
}
