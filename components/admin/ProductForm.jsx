"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Loader2, Plus, Trash2 } from "lucide-react"

export default function ProductForm({ product, categories, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        shortDescription: "",
        description: "",
        categoryId: "",
        essence: "",
        price: 0,
        compareAtPrice: 0,
        unit: "stère",
        stock: 0,
        images: [],
        specifications: [],
        badges: [],
        featured: false,
        bestseller: false,
        trending: false,
        isActive: true,
        seoTitle: "",
        seoDescription: "",
    })
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    const essences = ["chêne", "hêtre", "charme", "mix", "granulés", "compressé", "allume-feu"]
    const units = ["stère", "tonne", "pack", "kg", "sac"]
    const availableBadges = ["premium", "bestseller", "nouveau", "populaire", "offre", "écologique", "innovation"]

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                slug: product.slug || "",
                shortDescription: product.shortDescription || "",
                description: product.description || "",
                categoryId: product.categoryId?._id || product.categoryId || "",
                essence: product.essence || "",
                price: product.price || 0,
                compareAtPrice: product.compareAtPrice || 0,
                unit: product.unit || "stère",
                stock: product.stock || 0,
                images: product.images || [],
                specifications: product.specifications || [],
                badges: product.badges || [],
                featured: product.featured || false,
                bestseller: product.bestseller || false,
                trending: product.trending || false,
                isActive: product.isActive !== undefined ? product.isActive : true,
                seoTitle: product.seoTitle || "",
                seoDescription: product.seoDescription || "",
            })
        }
    }, [product])

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Auto-generate slug from name
        if (field === "name" && !product) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "")
            setFormData((prev) => ({ ...prev, slug }))
        }
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setUploading(true)
        try {
            const formDataUpload = new FormData()
            formDataUpload.append("file", file)

            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formDataUpload,
            })

            const data = await response.json()
            if (data.success) {
                const newImage = {
                    url: data.data.url,
                    alt: formData.name,
                    isPrimary: formData.images.length === 0,
                }
                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, newImage],
                }))
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

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }))
    }

    const setPrimaryImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.map((img, i) => ({
                ...img,
                isPrimary: i === index,
            })),
        }))
    }

    const addSpecification = () => {
        setFormData((prev) => ({
            ...prev,
            specifications: [...prev.specifications, { name: "", value: "", unit: "" }],
        }))
    }

    const updateSpecification = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            specifications: prev.specifications.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)),
        }))
    }

    const removeSpecification = (index) => {
        setFormData((prev) => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index),
        }))
    }

    const toggleBadge = (badge) => {
        setFormData((prev) => ({
            ...prev,
            badges: prev.badges.includes(badge) ? prev.badges.filter((b) => b !== badge) : [...prev.badges, badge],
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = product ? `/api/admin/products/${product._id}` : "/api/admin/products"

            const method = product ? "PUT" : "POST"

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations de base */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations générales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                <Label htmlFor="shortDescription">Description courte *</Label>
                                <Textarea
                                    id="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                                    rows={2}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description détaillée</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Catégorie et essence */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Classification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="categoryId">Catégorie *</Label>
                                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="essence">Essence *</Label>
                                <Select value={formData.essence} onValueChange={(value) => handleInputChange("essence", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une essence" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {essences.map((essence) => (
                                            <SelectItem key={essence} value={essence}>
                                                {essence}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Prix et stock */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Prix et stock</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Prix *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="compareAtPrice">Prix de comparaison</Label>
                                    <Input
                                        id="compareAtPrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.compareAtPrice}
                                        onChange={(e) => handleInputChange("compareAtPrice", Number.parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="unit">Unité *</Label>
                                    <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {units.map((unit) => (
                                                <SelectItem key={unit} value={unit}>
                                                    {unit}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="stock">Stock *</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value) || 0)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="featured">Mise en avant</Label>
                                <Switch
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="bestseller">Bestseller</Label>
                                <Switch
                                    id="bestseller"
                                    checked={formData.bestseller}
                                    onCheckedChange={(checked) => handleInputChange("bestseller", checked)}
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
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Images */}
            <Card>
                <CardHeader>
                    <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image.url || "/placeholder.svg"}
                                    alt={image.alt}
                                    className="w-full h-32 object-cover rounded border"
                                />
                                {image.isPrimary && <Badge className="absolute top-2 left-2">Principal</Badge>}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeImage(index)}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                                {!image.isPrimary && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
                                        onClick={() => setPrimaryImage(index)}
                                    >
                                        Principal
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Cliquez pour ajouter des images</p>
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
                                "Ajouter une image"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Badges */}
            <Card>
                <CardHeader>
                    <CardTitle>Badges</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {availableBadges.map((badge) => (
                            <Badge
                                key={badge}
                                variant={formData.badges.includes(badge) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => toggleBadge(badge)}
                            >
                                {badge}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Spécifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Spécifications
                        <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {formData.specifications.map((spec, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <Input
                                    placeholder="Nom"
                                    value={spec.name}
                                    onChange={(e) => updateSpecification(index, "name", e.target.value)}
                                />
                                <Input
                                    placeholder="Valeur"
                                    value={spec.value}
                                    onChange={(e) => updateSpecification(index, "value", e.target.value)}
                                />
                                <Input
                                    placeholder="Unité"
                                    value={spec.unit}
                                    onChange={(e) => updateSpecification(index, "unit", e.target.value)}
                                    className="w-24"
                                />
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeSpecification(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* SEO */}
            <Card>
                <CardHeader>
                    <CardTitle>SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
            </Card>

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
                    ) : product ? (
                        "Mettre à jour"
                    ) : (
                        "Créer"
                    )}
                </Button>
            </div>
        </form>
    )
}