import connectDB, { handleDBErrors } from "@/lib/mongoose"
import { Category, Product } from "@/models"

export default async function handler(req, res) {
    await connectDB()

    switch (req.method) {
        case "GET":
            return await getCategories(req, res)
        case "POST":
            return await createCategory(req, res)
        default:
            res.setHeader("Allow", ["GET", "POST"])
            return res.status(405).json({
                success: false,
                message: `Méthode ${req.method} non autorisée`,
            })
    }
}

async function getCategories(req, res) {
    try {
        const { page = 1, limit = 10, search, active } = req.query

        const filter = {}
        if (search) {
            filter.name = { $regex: search, $options: "i" }
        }
        if (active !== undefined) {
            filter.isActive = active === "true"
        }

        const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

        const [categories, total] = await Promise.all([
            Category.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number.parseInt(limit)).lean(),
            Category.countDocuments(filter),
        ])

        // Ajouter le nombre de produits pour chaque catégorie
        const enrichedCategories = await Promise.all(
            categories.map(async (category) => {
                const productCount = await Product.countDocuments({
                    categoryId: category._id,
                    isActive: true,
                })
                return { ...category, productCount }
            }),
        )

        return res.status(200).json({
            success: true,
            data: enrichedCategories,
            pagination: {
                page: Number.parseInt(page),
                limit: Number.parseInt(limit),
                total,
                pages: Math.ceil(total / Number.parseInt(limit)),
            },
        })
    } catch (error) {
        console.error("Erreur récupération catégories:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
        })
    }
}

async function createCategory(req, res) {
    try {
        const categoryData = req.body

        // Générer le slug si non fourni
        if (!categoryData.slug && categoryData.name) {
            categoryData.slug = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "")
        }

        const category = new Category(categoryData)
        await category.save()

        return res.status(201).json({
            success: true,
            data: category,
            message: "Catégorie créée avec succès",
        })
    } catch (error) {
        console.error("Erreur création catégorie:", error)
        const dbError = handleDBErrors(error)
        return res.status(400).json({
            success: false,
            message: dbError.message,
        })
    }
}