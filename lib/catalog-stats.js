import connectDB from "@/lib/mongoose"
import { localizeDocs } from "@/lib/localize-doc"
import { Category, Product } from "@/models"

/**
 * Le nombre de produits réellement au catalogue.
 *
 * La page d'accueil annonçait « 50+ références » — un chiffre écrit à la main
 * dans le composant, pour un catalogue qui en compte dix-neuf. Un visiteur qui
 * ouvre la boutique juste après le compte lui-même : autant qu'il tombe juste.
 */
export async function countActiveProducts() {
    await connectDB()
    return Product.countDocuments({ isActive: true })
}

/**
 * Les catégories et les produits mis en avant, lus directement en base.
 *
 * La page d'accueil les demandait à sa propre API, en HTTP, depuis
 * `getStaticProps` — c'est-à-dire au moment de la construction, quand aucun
 * serveur n'écoute. L'appel échouait (« Erreur de connexion au serveur »), le
 * repli renvoyait des tableaux vides, et la page était donc publiée sans
 * catégories ni produits ; seul le navigateur les rattrapait ensuite.
 */
export async function getHomeCatalog(locale, limit = 8) {
    await connectDB()

    const [categories, products] = await Promise.all([
        Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
        Product.find({ isActive: true, stock: { $gt: 0 } })
            .sort({ featured: -1, bestseller: -1, averageRating: -1, salesCount: -1 })
            .limit(limit)
            .populate("categoryId", "name slug")
            .lean(),
    ])

    return {
        categories: localizeDocs(categories, locale),
        products: localizeDocs(products, locale).map((product) => ({
            ...product,
            category: product.categoryId,
            inStock: product.stock > 0,
            discountPercentage:
                product.compareAtPrice && product.compareAtPrice > product.price
                    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                    : 0,
        })),
    }
}
