import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout/Layout'
import ProductCard from '@/components/Product/ProductCard'
import useCartStore from '@/lib/store/cartStore'
import toast from 'react-hot-toast'
import { connectToDatabase, Product, Category } from '@/lib/models'

const StarIcon = ({ filled = false }) => (
    <svg
        className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
)

const HeartIcon = ({ filled = false }) => (
    <svg
        className={`w-6 h-6 ${filled ? 'text-red-500' : 'text-gray-400'}`}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
)

const MinusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
)

const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
)

const CartIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 0L6 5H5m0 0L3 3m4 10v6a1 1 0 001 1h9a1 1 0 001-1v-6M7 13l-4-8" />
    </svg>
)

export default function ProductDetailPage({ product, relatedProducts }) {
    const router = useRouter()
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const addItem = useCartStore(state => state.addItem)

    if (router.isFallback) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="spinner"></div>
                </div>
            </Layout>
        )
    }

    if (!product) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-heading mb-4">Produit introuvable</h1>
                        <Link href="/produits">
                            <button className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                                Retour aux produits
                            </button>
                        </Link>
                    </div>
                </div>
            </Layout>
        )
    }

    const handleAddToCart = async () => {
        setIsLoading(true)

        try {
            addItem(product, quantity)
            toast.success(`${quantity} × ${product.name} ajouté${quantity > 1 ? 's' : ''} au panier !`, {
                icon: '🛒',
                style: { background: '#10B981', color: 'white' },
            })
        } catch (error) {
            toast.error('Erreur lors de l\'ajout au panier')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite)
        toast.success(
            isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
            { icon: isFavorite ? '💔' : '❤️' }
        )
    }

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <StarIcon key={index} filled={index < Math.floor(rating)} />
        ))
    }

    const renderBadges = () => {
        if (!product.badges?.length) return null

        const badgeStyles = {
            nouveau: 'bg-green-100 text-green-800',
            populaire: 'bg-blue-100 text-blue-800',
            premium: 'bg-purple-100 text-purple-800',
            économique: 'bg-orange-100 text-orange-800',
            local: 'bg-yellow-100 text-yellow-800'
        }

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {product.badges.map((badge) => (
                    <span
                        key={badge}
                        className={`px-3 py-1 text-sm font-medium rounded-full ${badgeStyles[badge] || 'bg-gray-100 text-gray-800'}`}
                    >
                        {badge}
                    </span>
                ))}
            </div>
        )
    }

    return (
        <Layout>
            <Head>
                <title>{product.seoTitle || `${product.name} | BoisChauffage Pro`}</title>
                <meta name="description" content={product.seoDescription || product.shortDescription} />
                <meta property="og:title" content={product.name} />
                <meta property="og:description" content={product.shortDescription} />
                <meta property="og:image" content={product.images?.[0]?.url} />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="container-custom py-4">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-4">
                                <li>
                                    <Link href="/" className="text-gray-500 hover:text-gray-700">
                                        Accueil
                                    </Link>
                                </li>
                                <li>
                                    <span className="text-gray-400">/</span>
                                </li>
                                <li>
                                    <Link href="/produits" className="text-gray-500 hover:text-gray-700">
                                        Produits
                                    </Link>
                                </li>
                                {product.categoryId && (
                                    <>
                                        <li>
                                            <span className="text-gray-400">/</span>
                                        </li>
                                        <li>
                                            <Link
                                                href={`/categories/${product.categoryId.slug}`}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                {product.categoryId.name}
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <span className="text-gray-400">/</span>
                                </li>
                                <li>
                                    <span className="text-gray-900 font-medium">{product.name}</span>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="container-custom py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* Galerie d'images */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Image principale */}
                            <div className="mb-4">
                                <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-wood-100 to-wood-200 rounded-2xl overflow-hidden shadow-lg">
                                    {product.images?.[selectedImage]?.url ? (
                                        <motion.img
                                            key={selectedImage}
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            src={product.images[selectedImage].url}
                                            alt={product.images[selectedImage].alt || product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-8xl">🪵</span>
                                        </div>
                                    )}

                                    {/* Badges overlay */}
                                    {product.badges?.length > 0 && (
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            {renderBadges()}
                                        </div>
                                    )}

                                    {/* Bouton favori */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleFavorite}
                                        className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <HeartIcon filled={isFavorite} />
                                    </motion.button>
                                </div>

                                {/* Miniatures */}
                                {product.images?.length > 1 && (
                                    <div className="flex gap-2 mt-4">
                                        {product.images.map((image, index) => (
                                            <motion.button
                                                key={index}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedImage(index)}
                                                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                        ? 'border-primary-500'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={image.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Informations produit */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Titre et catégorie */}
                            <div>
                                {product.categoryId && (
                                    <Link
                                        href={`/categories/${product.categoryId.slug}`}
                                        className="text-primary-600 hover:text-primary-700 font-medium text-sm uppercase tracking-wider"
                                    >
                                        {product.categoryId.name}
                                    </Link>
                                )}
                                <h1 className="text-3xl lg:text-4xl font-heading text-gray-900 mt-2 mb-4">
                                    {product.name}
                                </h1>
                                <p className="text-lg text-gray-600 capitalize">
                                    Essence : <span className="font-medium">{product.essence}</span>
                                </p>
                            </div>

                            {/* Badges */}
                            {renderBadges()}

                            {/* Rating */}
                            {product.averageRating > 0 && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        {renderStars(product.averageRating)}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {product.averageRating} sur 5 ({product.reviewCount} avis)
                                    </span>
                                </div>
                            )}

                            {/* Prix */}
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-bold text-primary-600">
                                    {product.price}€
                                </span>
                                <span className="text-lg text-gray-500">
                                    /{product.unit}
                                </span>
                                {product.compareAtPrice && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            {product.compareAtPrice}€
                                        </span>
                                        <span className="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">
                                            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Description courte */}
                            {product.shortDescription && (
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {product.shortDescription}
                                </p>
                            )}

                            {/* Stock */}
                            <div className="flex items-center gap-2">
                                {product.stock > 0 ? (
                                    <>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-green-700 font-medium">
                                            En stock ({product.stock} disponibles)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-red-700 font-medium">Rupture de stock</span>
                                    </>
                                )}
                            </div>

                            {/* Sélecteur de quantité et ajout au panier */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700">
                                        Quantité :
                                    </label>
                                    <div className="flex items-center bg-gray-100 rounded-lg">
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            <MinusIcon />
                                        </motion.button>
                                        <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                                            {quantity}
                                        </span>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                            className="p-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                                        >
                                            <PlusIcon />
                                        </motion.button>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddToCart}
                                    disabled={isLoading || product.stock === 0}
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            Ajout en cours...
                                        </>
                                    ) : (
                                        <>
                                            <CartIcon />
                                            Ajouter au panier
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            {/* Livraison */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-green-700">
                                    <span className="text-xl">🚚</span>
                                    <span className="font-medium">Livraison rapide</span>
                                </div>
                                <p className="text-sm text-green-600 mt-1">
                                    Livraison en 48h partout en France. Gratuite dès 500€ d'achat.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Onglets d'informations */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16"
                    >
                        <div className="border-b border-gray-200">
                            <div className="flex">
                                <button className="px-6 py-4 font-medium text-primary-600 border-b-2 border-primary-600">
                                    Description
                                </button>
                                <button className="px-6 py-4 font-medium text-gray-500 hover:text-gray-700">
                                    Caractéristiques
                                </button>
                                <button className="px-6 py-4 font-medium text-gray-500 hover:text-gray-700">
                                    Livraison
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {product.description}
                                </p>

                                {/* Spécifications */}
                                {product.specifications?.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-heading text-gray-800 mb-4">
                                            Caractéristiques techniques
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {product.specifications.map((spec, index) => (
                                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium text-gray-700">{spec.name}</span>
                                                    <span className="text-gray-600">
                                                        {spec.value} {spec.unit}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Certifications */}
                                {product.certifications?.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-heading text-gray-800 mb-4">
                                            Certifications
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            {product.certifications.map((cert, index) => (
                                                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <div className="font-medium text-green-800">{cert.name}</div>
                                                    {cert.code && (
                                                        <div className="text-sm text-green-600">{cert.code}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Produits similaires */}
                    {relatedProducts?.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <h2 className="text-3xl font-heading text-gray-800 mb-8 text-center">
                                Produits similaires
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedProducts.map((relatedProduct) => (
                                    <motion.div
                                        key={relatedProduct._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProductCard product={relatedProduct} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticPaths() {
    try {
        await connectToDatabase()
        const products = await Product.find({ isActive: true }).select('slug')

        const paths = products.map((product) => ({
            params: { slug: product.slug }
        }))

        return {
            paths,
            fallback: 'blocking'
        }
    } catch (error) {
        console.error('Error in getStaticPaths:', error)
        return {
            paths: [],
            fallback: 'blocking'
        }
    }
}

export async function getStaticProps({ params }) {
    try {
        await connectToDatabase()

        // Récupérer le produit
        const product = await Product
            .findOne({ slug: params.slug, isActive: true })
            .populate('categoryId', 'name slug')
            .lean()

        if (!product) {
            return {
                notFound: true
            }
        }

        // Récupérer des produits similaires (même catégorie ou même essence)
        const relatedProducts = await Product
            .find({
                _id: { $ne: product._id },
                isActive: true,
                $or: [
                    { categoryId: product.categoryId },
                    { essence: product.essence }
                ]
            })
            .populate('categoryId', 'name slug')
            .limit(3)
            .lean()

        return {
            props: {
                product: JSON.parse(JSON.stringify(product)),
                relatedProducts: JSON.parse(JSON.stringify(relatedProducts))
            },
            revalidate: 3600 // Revalidate every hour
        }
    } catch (error) {
        console.error('Error in getStaticProps:', error)
        return {
            notFound: true
        }
    }
}