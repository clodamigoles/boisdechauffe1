"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import { slugify } from "@/lib/slugify"
import { LOCALES, LOCALE_NAMES } from "@/lib/i18n"

/** Un champ traduit vide. */
const emptyLocalized = () => ({ de: "", fr: "" })

/** Accepte l'ancien format (une chaîne) comme le nouveau. */
const toLocalized = (value) => {
    if (typeof value === "string") return { de: "", fr: value }
    return { de: value?.de ?? "", fr: value?.fr ?? "" }
}

export default function CategoryForm({ category, onSuccess, onCancel }) {
    // La langue en cours d'édition, comme dans le formulaire produit.
    const [lang, setLang] = useState("de")

    const [formData, setFormData] = useState({
        name: emptyLocalized(),
        slug: "",
        shortDescription: emptyLocalized(),
        description: emptyLocalized(),
        image: "",
        featured: false,
        trending: false,
        isActive: true,
        order: 0,
        seoTitle: emptyLocalized(),
        seoDescription: emptyLocalized(),
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
                name: toLocalized(category.name),
                slug: category.slug || "",
                shortDescription: toLocalized(category.shortDescription),
                description: toLocalized(category.description),
                image: category.image || "",
                featured: category.featured || false,
                trending: category.trending || false,
                isActive: category.isActive !== undefined ? category.isActive : true,
                order: category.order || 0,
                seoTitle: toLocalized(category.seoTitle),
                seoDescription: toLocalized(category.seoDescription),
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
    }

    /** Un champ traduit : on ne modifie que la langue affichée. */
    const handleLocalizedChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: { ...prev[field], [lang]: value },
        }))

        // Le slug se dérive du nom allemand, et seulement à la création.
        if (field === "name" && lang === "de" && !category) {
            setFormData((prev) => ({ ...prev, slug: slugify(value) }))
        }
    }

    const LanguageTabs = () => (
        <div className="inline-flex rounded-lg border border-gray-200 p-0.5">
            {LOCALES.map((code) => (
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
                    {!formData.name?.[code] && (
                        <span
                            className="ml-1.5 inline-block size-1.5 rounded-full bg-amber-400 align-middle"
                            title="Traduction manquante"
                        />
                    )}
                </button>
            ))}
        </div>
    )

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
                    <div className="flex justify-end">
                        <LanguageTabs />
                    </div>
                    <div>
                        <Label htmlFor="name">Nom ({LOCALE_NAMES[lang]}) *</Label>
                        <Input
                            id="name"
                            value={formData.name?.[lang] ?? ""}
                            onChange={(e) => handleLocalizedChange("name", e.target.value)}
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
                        <Label htmlFor="shortDescription">Description courte ({LOCALE_NAMES[lang]})</Label>
                        <Textarea
                            id="shortDescription"
                            value={formData.shortDescription?.[lang] ?? ""}
                            onChange={(e) => handleLocalizedChange("shortDescription", e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description ({LOCALE_NAMES[lang]})</Label>
                        <Textarea
                            id="description"
                            value={formData.description?.[lang] ?? ""}
                            onChange={(e) => handleLocalizedChange("description", e.target.value)}
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
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-medium">SEO</h3>
                    <LanguageTabs />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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