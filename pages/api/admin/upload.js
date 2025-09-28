import cloudinary from "@/lib/cloudinary"
import formidable from "formidable"

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"])
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`,
        })
    }

    try {
        const form = formidable({
            maxFileSize: 5 * 1024 * 1024, // 5MB
            keepExtensions: true,
        })

        const [fields, files] = await form.parse(req)
        const file = Array.isArray(files.file) ? files.file[0] : files.file

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Aucun fichier fourni",
            })
        }

        // Upload vers Cloudinary
        const result = await cloudinary.uploader.upload(file.filepath, {
            folder: "products", // Dossier dans Cloudinary
            public_id: `${Date.now()}-${file.originalFilename?.replace(/[^a-zA-Z0-9]/g, "_")}`,
            resource_type: "auto",
            transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }, { fetch_format: "auto" }],
        })

        return res.status(200).json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
            },
            message: "Image uploadée avec succès",
        })
    } catch (error) {
        console.error("Erreur upload:", error)
        return res.status(500).json({
            success: false,
            message: "Erreur lors de l'upload de l'image",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        })
    }
}