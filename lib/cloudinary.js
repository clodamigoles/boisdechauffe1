import { v2 as cloudinary } from "cloudinary"

// Configuration Cloudinary
if (!cloudinary.config().cloud_name) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })
}

export default cloudinary

// Fonction utilitaire pour uploader une image
export const uploadImage = async (filePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "products",
            resource_type: "auto",
            ...options,
        })
        return {
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
            },
        }
    } catch (error) {
        console.error("Erreur upload Cloudinary:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

// Fonction pour supprimer une image
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return {
            success: result.result === "ok",
            data: result,
        }
    } catch (error) {
        console.error("Erreur suppression Cloudinary:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}