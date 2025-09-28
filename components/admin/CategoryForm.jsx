"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"

export default function CategoryForm({ category, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        shortDescription: "",
        description: "",
        image: "",
        featured: false,
        trending: false,
        isActive: true,
        order: 0,
        seoTitle: "",
        seoDescription: "",
        metadata: {
            color: "",
            icon: "",
        },
    })
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                slug: category.slug || "",
                shortDescription: category.shortDescription || "",
                description: category.description || "",
                image: category.image || "",
                featured: category.featured || false,
                trending: category.trending || false,
                isActive: category.isActive !== undefined ? category.isActive : true,
                order: category.order || 0,
                seoTitle: category.seoTitle || "",
                seoDescription: category.seoDescription || "",
                metadata: {
                    color: category.metadata?.color || "",
                    icon: category.metadata?.icon || "",
                },
            })
        }
    }, [category])

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Auto-generate slug from name
        if (field === "name" && !category) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "")
            setFormData((prev) => ({ ...prev, slug }))
        }
    }

    const handleMetadataChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [field]: value,
            },
        }))
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()
            if (data.success) {
                setFormData((prev) => ({ ...prev, image: data.data.url }))
            } else {
                alert("Erreur lors de l'upload de l'image")
            }
        } catch (error) {
            console.error("Erreur upload:", error)
            alert("Erreur lors de l'upload de l'image")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = category ? `/api/admin/categories/${category._id}` : "/api/admin/categories"

            const method = category ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()
            if (data.success) {
                onSuccess()
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error("Erreur sauvegarde:", error)
            alert("Erreur lors de la sauvegarde")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations de base */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nom *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => handleInputChange("slug", e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="shortDescription">Description courte</Label>
                        <Textarea
                            id="shortDescription"
                            value={formData.shortDescription}
                            onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>

                {/* Image et paramètres */}
                <div className="space-y-4">
                    <div>
                        <Label>Image</Label>
                        <Card className="p-4">
                            {formData.image ? (
                                <div className="relative">
                                    <img
                                        src={formData.image || "/placeholder.svg"}
                                        alt="Aperçu"
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground mb-2">Cliquez pour uploader une image</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                        disabled={uploading}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById("image-upload").click()}
                                        disabled={uploading}
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Upload...
                                            </>
                                        ) : (
                                            "Choisir une image"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="order">Ordre</Label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => handleInputChange("order", Number.parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="color">Couleur</Label>
                            <Input
                                id="color"
                                value={formData.metadata.color}
                                onChange={(e) => handleMetadataChange("color", e.target.value)}
                                placeholder="#000000"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="featured">Mise en avant</Label>
                            <Switch
                                id="featured"
                                checked={formData.featured}
                                onCheckedChange={(checked) => handleInputChange("featured", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="trending">Tendance</Label>
                            <Switch
                                id="trending"
                                checked={formData.trending}
                                onCheckedChange={(checked) => handleInputChange("trending", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="isActive">Actif</Label>
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">SEO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="seoTitle">Titre SEO</Label>
                        <Input
                            id="seoTitle"
                            value={formData.seoTitle}
                            onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="seoDescription">Description SEO</Label>
                        <Textarea
                            id="seoDescription"
                            value={formData.seoDescription}
                            onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sauvegarde...
                        </>
                    ) : category ? (
                        "Mettre à jour"
                    ) : (
                        "Créer"
                    )}
                </Button>
            </div>
        </form>
    )
}