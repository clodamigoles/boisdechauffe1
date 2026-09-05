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
import { BADGES, ESSENCES, UNITS } from "@/constants/catalog"
import { slugify } from "@/lib/slugify"
import { LOCALES, LOCALE_NAMES } from "@/lib/i18n"

/** Un champ traduit vide, quelle que soit sa provenance. */
const emptyLocalized = () => ({ de: "", fr: "" })

/** Accepte l'ancien format (une chaîne) comme le nouveau. Les documents
 *  d'avant la migration en portent encore, et un formulaire qui affiche
 *  « [object Object] » est pire qu'un champ vide. */
const toLocalized = (value) => {
    if (typeof value === "string") return { de: "", fr: value }
    return { de: value?.de ?? "", fr: value?.fr ?? "" }
}

export default function ProductForm({ product, categories, onSuccess, onCancel }) {
    // La langue en cours d'édition. L'allemand d'abord : c'est la langue de
    // référence du catalogue, celle dont le slug est dérivé.
    const [lang, setLang] = useState("de")

    const [formData, setFormData] = useState({
        name: emptyLocalized(),
        slug: "",
        shortDescription: emptyLocalized(),
        description: emptyLocalized(),
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
        seoTitle: emptyLocalized(),
        seoDescription: emptyLocalized(),
    })
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Recopiées ici et dans le filtre de la boutique, elles avaient déjà
    // divergé une fois. Elles vivent maintenant à un seul endroit.
    const essences = ESSENCES
    const units = UNITS
    const availableBadges = BADGES

    useEffect(() => {
        if (product) {
            setFormData({
                name: toLocalized(product.name),
                slug: product.slug || "",
                shortDescription: toLocalized(product.shortDescription),
                description: toLocalized(product.description),
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
                seoTitle: toLocalized(product.seoTitle),
                seoDescription: toLocalized(product.seoDescription),
            })
        }
    }, [product])

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    /** Un champ traduit : on ne modifie que la langue affichée. */
    const handleLocalizedChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: { ...prev[field], [lang]: value },
        }))

        // Le slug se dérive du nom allemand, et seulement à la création : le
        // changer sur un produit existant casserait son URL et les liens qui
        // pointent dessus.
        if (field === "name" && lang === "de" && !product) {
            setFormData((prev) => ({ ...prev, slug: slugify(value) }))
        }
    }

    /**
     * Le sélecteur de langue du formulaire.
     *
     * Les deux versions sont éditées dans le même écran plutôt que dans deux
     * formulaires : un produit dont seule la moitié allemande serait
     * enregistrée s'afficherait à moitié en français sur le site allemand.
     */
    const LanguageTabs = () => (
        <div className="inline-flex rounded-lg border border-gray-200 p-0.5">
            {LOCALES.map((code) => {
                const filled = Boolean(formData.name?.[code])
                return (
                    <button
                        key={code}
                        type="button"
                        onClick={() => setLang(code)}
                        aria-pressed={lang === code}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${lang === code
                            ? "bg-amber-50 text-amber-700"
                            : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        {LOCALE_NAMES[code]}
                        {/* Une pastille signale la langue encore vide : sans
                            elle, on enregistre un produit à moitié traduit
                            sans s'en apercevoir. */}
                        {!filled && (
                            <span
                                className="ml-1.5 inline-block size-1.5 rounded-full bg-amber-400 align-middle"
                                title="Traduction manquante"
                            />
                        )}
                    </button>
                )
            })}
        </div>
    )

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
                    alt: formData.name?.de || formData.name?.fr || "",
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
                        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                            <CardTitle>Informations générales</CardTitle>
                            <LanguageTabs />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nom ({LOCALE_NAMES[lang]}) *</Label>
                                <Input
                                    id="name"
                                    value={formData.name?.[lang] ?? ""}
                                    onChange={(e) => handleLocalizedChange("name", e.target.value)}
                                    required={lang === "de"}
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
                                <Label htmlFor="shortDescription">Description courte ({LOCALE_NAMES[lang]}) *</Label>
                                <Textarea
                                    id="shortDescription"
                                    value={formData.shortDescription?.[lang] ?? ""}
                                    onChange={(e) => handleLocalizedChange("shortDescription", e.target.value)}
                                    rows={2}
                                    required={lang === "de"}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description détaillée ({LOCALE_NAMES[lang]})</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description?.[lang] ?? ""}
                                    onChange={(e) => handleLocalizedChange("description", e.target.value)}
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
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                    <CardTitle>SEO</CardTitle>
                    <LanguageTabs />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="seoTitle">Titre SEO ({LOCALE_NAMES[lang]})</Label>
                        <Input
                            id="seoTitle"
                            value={formData.seoTitle?.[lang] ?? ""}
                            onChange={(e) => handleLocalizedChange("seoTitle", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="seoDescription">Description SEO ({LOCALE_NAMES[lang]})</Label>
                        <Textarea
                            id="seoDescription"
                            value={formData.seoDescription?.[lang] ?? ""}
                            onChange={(e) => handleLocalizedChange("seoDescription", e.target.value)}
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