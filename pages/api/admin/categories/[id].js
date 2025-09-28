import connectDB, { handleDBErrors } from "@/lib/mongoose"
import { Category, Product } from "@/models"

export default async function handler(req, res) {
    await connectDB()

    const { id } = req.query

    switch (req.method) {
        case "GET":
            return await getCategory(req, res, id)
        case "PUT":
            return await updateCategory(req, res, id)
        case "DELETE":
            return await deleteCategory(req, res, id)
        default:
            res.setHeader("Allow", ["GET", "PUT", "DELETE"])
            return res.status(405).json({
                success: false,
                message: `Méthode ${req.method} non autorisée`,
            })
    }
}

async function getCategory(req, res, id) {
    try {
        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Catégorie non trouvée",
            })
        }

        return res.status(200).json({
            success: true,
            data: category,
        })
    } catch (error) {
        console.error("Erreur récupération catégorie:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
        })
    }
}

async function updateCategory(req, res, id) {
    try {
        const updateData = req.body

        const category = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Catégorie non trouvée",
            })
        }

        return res.status(200).json({
            success: true,
            data: category,
            message: "Catégorie mise à jour avec succès",
        })
    } catch (error) {
        console.error("Erreur mise à jour catégorie:", error)
        const dbError = handleDBErrors(error)
        return res.status(400).json({
            success: false,
            message: dbError.message,
        })
    }
}

async function deleteCategory(req, res, id) {
    try {
        // Vérifier s'il y a des produits dans cette catégorie
        const productCount = await Product.countDocuments({ categoryId: id })
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Impossible de supprimer la catégorie. Elle contient ${productCount} produit(s).`,
            })
        }

        const category = await Category.findByIdAndDelete(id)
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Catégorie non trouvée",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Catégorie supprimée avec succès",
        })
    } catch (error) {
        console.error("Erreur suppression catégorie:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
        })
    }
}