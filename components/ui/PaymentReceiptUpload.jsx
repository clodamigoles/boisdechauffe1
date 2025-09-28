"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react"
import Button from "./Button"

export default function PaymentReceiptUpload({ orderNumber, onUploadSuccess }) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState(null) // 'success', 'error', null
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const handleFileSelect = (file) => {
        if (!file) return

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
        if (!allowedTypes.includes(file.type)) {
            setUploadStatus("error")
            return
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            setUploadStatus("error")
            return
        }

        setSelectedFile(file)
        setUploadStatus(null)
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0])
        }
    }

    const uploadFile = async () => {
        if (!selectedFile) return

        setIsUploading(true)
        setUploadStatus(null)

        try {
            const formData = new FormData()
            formData.append("receipt", selectedFile)

            const response = await fetch(`/api/orders/${orderNumber}/upload-receipt`, {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            if (result.success) {
                setUploadStatus("success")
                setSelectedFile(null)
                if (onUploadSuccess) {
                    onUploadSuccess(result.data)
                }
            } else {
                setUploadStatus("error")
            }
        } catch (error) {
            console.error("Erreur upload:", error)
            setUploadStatus("error")
        } finally {
            setIsUploading(false)
        }
    }

    const resetUpload = () => {
        setSelectedFile(null)
        setUploadStatus(null)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6"
        >
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">Envoyer votre récépissé de paiement</h3>
            </div>

            <p className="text-sm text-blue-800 mb-4">
                Une fois votre virement effectué, vous pouvez nous envoyer votre récépissé bancaire pour accélérer le traitement
                de votre commande.
            </p>

            {uploadStatus === "success" ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">Récépissé envoyé avec succès !</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">Nous traiterons votre commande dès que possible.</p>
                </div>
            ) : uploadStatus === "error" ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-800 font-medium">Erreur lors de l'envoi</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                        Veuillez vérifier le format du fichier (JPG, PNG, PDF) et la taille (max 10MB).
                    </p>
                </div>
            ) : null}

            {!selectedFile ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Glissez-déposez votre récépissé ici ou</p>
                    <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">parcourez vos fichiers</span>
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileInput} />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Formats acceptés: JPG, PNG, PDF (max 10MB)</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button onClick={resetUpload} className="text-gray-400 hover:text-gray-600" disabled={isUploading}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex space-x-3">
                        <Button onClick={uploadFile} disabled={isUploading} className="flex-1">
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Envoyer le récépissé
                                </>
                            )}
                        </Button>
                        <Button variant="outline" onClick={resetUpload} disabled={isUploading}>
                            Annuler
                        </Button>
                    </div>
                </div>
            )}
        </motion.div>
    )
}