import connectDB, { handleDBErrors } from "@/lib/mongoose"
import { Product, Category } from "@/models"

export default async function handler(req, res) {
    await connectDB()

    switch (req.method) {
        case "GET":
            return await getProducts(req, res)
        case "POST":
            return await createProduct(req, res)
        default:
            res.setHeader("Allow", ["GET", "POST"])
            return res.status(405).json({
                success: false,
                message: `Méthode ${req.method} non autorisée`,
            })
    }
}

async function getProducts(req, res) {
    try {
        const { page = 1, limit = 10, search, category, active, essence } = req.query

        const filter = {}
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { shortDescription: { $regex: search, $options: "i" } },
            ]
        }
        if (category) {
            filter.categoryId = category
        }
        if (active !== undefined) {
            filter.isActive = active === "true"
        }
        if (essence) {
            filter.essence = essence
        }

        const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate("categoryId", "name slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number.parseInt(limit))
                .lean(),
            Product.countDocuments(filter),
        ])

        return res.status(200).json({
            success: true,
            data: products,
            pagination: {
                page: Number.parseInt(page),
                limit: Number.parseInt(limit),
                total,
                pages: Math.ceil(total / Number.parseInt(limit)),
            },
        })
    } catch (error) {
        console.error("Erreur récupération produits:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
        })
    }
}

async function createProduct(req, res) {
    try {
        const productData = req.body

        // Vérifier que la catégorie existe
        const category = await Category.findById(productData.categoryId)
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Catégorie non trouvée",
            })
        }

        // Générer le slug si non fourni
        if (!productData.slug && productData.name) {
            productData.slug = productData.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "")
        }

        const product = new Product(productData)
        await product.save()

        // Populer la catégorie pour la réponse
        await product.populate("categoryId", "name slug")

        return res.status(201).json({
            success: true,
            data: product,
            message: "Produit créé avec succès",
        })
    } catch (error) {
        console.error("Erreur création produit:", error)
        const dbError = handleDBErrors(error)
        return res.status(400).json({
            success: false,
            message: dbError.message,
        })
    }
}