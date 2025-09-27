import { connectToDatabase, Order } from '@/lib/models'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { promisify } from 'util'

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configuration Multer pour le stockage en mémoire
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accepter seulement les images et PDFs
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true)
        } else {
            cb(new Error('Type de fichier non autorisé. Utilisez JPG, PNG ou PDF.'), false)
        }
    },
})

const uploadMiddleware = promisify(upload.array('files', 10)) // Max 10 fichiers

// Désactiver le parser de body par défaut de Next.js
export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        await connectToDatabase()

        const { orderNumber } = req.query

        // Vérifier que la commande existe
        const order = await Order.findOne({ orderNumber })
        if (!order) {
            return res.status(404).json({ message: 'Commande introuvable' })
        }

        // Vérifier que la commande est dans un état permettant l'upload
        if (!['payment_pending', 'payment_uploaded'].includes(order.status)) {
            return res.status(400).json({
                message: 'Upload non autorisé pour cette commande'
            })
        }

        // Traitement des fichiers avec Multer
        await uploadMiddleware(req, res)

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Aucun fichier reçu' })
        }

        const uploadedFiles = []

        // Upload de chaque fichier vers Cloudinary
        for (const file of req.files) {
            try {
                // Créer un nom de fichier unique
                const timestamp = Date.now()
                const filename = `${orderNumber}_${timestamp}_${file.originalname}`

                // Upload vers Cloudinary
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: `orders/${orderNumber}/payment-proofs`,
                            public_id: filename,
                            resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image'
                        },
                        (error, result) => {
                            if (error) reject(error)
                            else resolve(result)
                        }
                    )

                    uploadStream.end(file.buffer)
                })

                uploadedFiles.push({
                    filename: file.originalname,
                    url: uploadResult.secure_url,
                    cloudinaryId: uploadResult.public_id,
                    uploadedAt: new Date()
                })

            } catch (uploadError) {
                console.error('Erreur upload Cloudinary:', uploadError)
                return res.status(500).json({
                    message: `Erreur lors de l'upload de ${file.originalname}`
                })
            }
        }

        // Mettre à jour la commande avec les nouveaux fichiers
        const updatedOrder = await Order.findOneAndUpdate(
            { orderNumber },
            {
                $push: { paymentProofs: { $each: uploadedFiles } },
                $set: {
                    status: 'payment_uploaded',
                    paymentStatus: 'uploaded'
                }
            },
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: `${uploadedFiles.length} fichier(s) uploadé(s) avec succès`,
            data: {
                uploadedFiles,
                order: {
                    _id: updatedOrder._id,
                    orderNumber: updatedOrder.orderNumber,
                    status: updatedOrder.status,
                    paymentStatus: updatedOrder.paymentStatus,
                    paymentProofs: updatedOrder.paymentProofs
                }
            }
        })

    } catch (error) {
        console.error('Erreur API upload:', error)

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'Fichier trop volumineux. Taille maximum : 5MB'
            })
        }

        if (error.message.includes('Type de fichier')) {
            return res.status(400).json({ message: error.message })
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
        })
    }
}