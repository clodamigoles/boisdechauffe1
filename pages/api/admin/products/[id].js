import connectDB, { handleDBErrors } from "@/lib/mongoose"
import { Product, Category } from "@/models"

export default async function handler(req, res) {
    await connectDB()

    const { id } = req.query

    switch (req.method) {
        case "GET":
            return await getProduct(req, res, id)
        case "PUT":
            return await updateProduct(req, res, id)
        case "DELETE":
            return await deleteProduct(req, res, id)
        default:
            res.setHeader("Allow", ["GET", "PUT", "DELETE"])
            return res.status(405).json({
                success: false,
                message: `Méthode ${req.method} non autorisée`,
            })
    }
}

async function getProduct(req, res, id) {
    try {
        const product = await Product.findById(id).populate("categoryId", "name slug")
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Produit non trouvé",
            })
        }

        return res.status(200).json({
            success: true,
            data: product,
        })
    } catch (error) {
        console.error("Erreur récupération produit:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
        })
    }
}

async function updateProduct(req, res, id) {
    try {
        const updateData = req.body

        // Vérifier que la catégorie existe si elle est modifiée
        if (updateData.categoryId) {
            const category = await Category.findById(updateData.categoryId)
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: "Catégorie non trouvée",
                })
            }
        }

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(
            "categoryId",
            "name slug",
        )

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Produit non trouvé",
            })
        }

        return res.status(200).json({
            success: true,
            data: product,
            message: "Produit mis à jour avec succès",
        })
    } catch (error) {
        console.error("Erreur mise à jour produit:", error)
        const dbError = handleDBErrors(error)
        return res.status(400).json({
            success: false,
            message: dbError.message,
        })
    }
}

async function deleteProduct(req, res, id) {
    try {
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Produit non trouvé",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Produit supprimé avec succès",
        })
    } catch (error) {
        console.error("Erreur suppression produit:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
        })
    }
}