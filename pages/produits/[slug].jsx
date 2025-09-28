"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { motion } from "framer-motion"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import { productsService } from "../../lib/api"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ProductDetailHero from "../../components/product/ProductDetailHero"
import ProductDetailInfo from "../../components/product/ProductDetailInfo"
import ProductDetailSpecs from "../../components/product/ProductDetailSpecs"
import ProductDetailActions from "../../components/product/ProductDetailActions"
import SimilarProducts from "../../components/product/SimilarProducts"
import ProductBreadcrumb from "../../components/product/ProductBreadcrumb"
import { pageVariants } from "../../utils/animations"

export default function ProductDetailPage() {
    const router = useRouter()
    const { slug } = router.query
    const [product, setProduct] = useState(null)
    const [similarProducts, setSimilarProducts] = useState([])
    const [seoData, setSeoData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!slug) return

        const loadProduct = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await productsService.getBySlug(slug)

                if (response.success) {
                    setProduct(response.data.product)
                    setSimilarProducts(response.data.similarProducts || [])
                    setSeoData(response.data.seo)
                } else {
                    setError("Produit non trouvé")
                }
            } catch (err) {
                console.error("Erreur lors du chargement du produit:", err)
                setError(err.message || "Erreur lors du chargement du produit")
            } finally {
                setLoading(false)
            }
        }

        loadProduct()
    }, [slug])

    if (loading) {
        return (
            <>
                <Head>
                    <title>Chargement... | BoisChauffage Pro</title>
                </Head>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="pt-20">
                        <div className="min-h-screen flex items-center justify-center">
                            <LoadingSpinner size="xl" text="Chargement du produit..." />
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
                <Head>
                    <title>Produit non trouvé | BoisChauffage Pro</title>
                </Head>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="pt-20">
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Produit non trouvé"}</h1>
                                <p className="text-gray-600 mb-6">
                                    Le produit que vous recherchez n'existe pas ou n'est plus disponible.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push("/shop")}
                                    className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                                >
                                    Retour à la boutique
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
            <Head>
                <title>{seoData?.title || `${product.name} | BoisChauffage Pro`}</title>
                <meta name="description" content={seoData?.description || product.shortDescription} />
                <meta
                    name="keywords"
                    content={seoData?.keywords || `${product.essence}, bois de chauffage, ${product.category?.name}`}
                />
                <link
                    rel="canonical"
                    href={seoData?.canonical || `${process.env.NEXT_PUBLIC_SITE_URL}/produits/${product.slug}`}
                />

                {/* Open Graph */}
                <meta property="og:title" content={seoData?.title || product.name} />
                <meta property="og:description" content={seoData?.description || product.shortDescription} />
                <meta property="og:image" content={seoData?.ogImage || product.images?.[0]?.url} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/produits/${product.slug}`} />
                <meta property="og:type" content="product" />

                {/* Product Schema */}
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
                                name: "BoisChauffage Pro",
                            },
                            category: product.category?.name,
                            offers: {
                                "@type": "Offer",
                                price: product.price,
                                priceCurrency: "EUR",
                                availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                                seller: {
                                    "@type": "Organization",
                                    name: "BoisChauffage Pro",
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
            </Head>

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