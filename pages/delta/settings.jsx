"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save, Plus, Trash2, Globe, Mail, Phone, MapPin, Building2, Truck, Clock, FileText } from "lucide-react"
import toast from "react-hot-toast"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/admin/settings")
            const data = await res.json()

            if (data.success) {
                setSettings(data.data)
            } else {
                toast.error("Erreur lors du chargement des paramètres")
            }
        } catch (error) {
            console.error("Erreur:", error)
            toast.error("Erreur lors du chargement des paramètres")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings),
            })

            const data = await res.json()

            if (data.success) {
                toast.success("Paramètres enregistrés avec succès")
                setSettings(data.data)
            } else {
                toast.error(data.message || "Erreur lors de l'enregistrement")
            }
        } catch (error) {
            console.error("Erreur:", error)
            toast.error("Erreur lors de l'enregistrement")
        } finally {
            setSaving(false)
        }
    }

    const handleInputChange = (field, value) => {
        setSettings((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleNestedInputChange = (parent, field, value) => {
        setSettings((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value,
            },
        }))
    }

    const handleAddShippingZone = () => {
        setSettings((prev) => ({
            ...prev,
            shippingZones: [
                ...prev.shippingZones,
                {
                    country: "",
                    regions: [{ name: "", cost: 0 }],
                },
            ],
        }))
    }

    const handleRemoveShippingZone = (index) => {
        setSettings((prev) => ({
            ...prev,
            shippingZones: prev.shippingZones.filter((_, i) => i !== index),
        }))
    }

    const handleShippingZoneChange = (zoneIndex, field, value) => {
        setSettings((prev) => ({
            ...prev,
            shippingZones: prev.shippingZones.map((zone, i) =>
                i === zoneIndex ? { ...zone, [field]: value } : zone
            ),
        }))
    }

    const handleAddRegion = (zoneIndex) => {
        setSettings((prev) => ({
            ...prev,
            shippingZones: prev.shippingZones.map((zone, i) =>
                i === zoneIndex
                    ? {
                          ...zone,
                          regions: [...zone.regions, { name: "", cost: 0 }],
                      }
                    : zone
            ),
        }))
    }

    const handleRemoveRegion = (zoneIndex, regionIndex) => {
        setSettings((prev) => ({
            ...prev,
            shippingZones: prev.shippingZones.map((zone, i) =>
                i === zoneIndex
                    ? {
                          ...zone,
                          regions: zone.regions.filter((_, j) => j !== regionIndex),
                      }
                    : zone
            ),
        }))
    }

    const handleRegionChange = (zoneIndex, regionIndex, field, value) => {
        setSettings((prev) => ({
            ...prev,
            shippingZones: prev.shippingZones.map((zone, i) =>
                i === zoneIndex
                    ? {
                          ...zone,
                          regions: zone.regions.map((region, j) =>
                              j === regionIndex ? { ...region, [field]: value } : region
                          ),
                      }
                    : zone
            ),
        }))
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        )
    }

    if (!settings) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Erreur lors du chargement des paramètres</p>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Paramètres du site</h1>
                        <p className="text-muted-foreground">Gérez les informations et paramètres de votre site</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        <Save className="h-4 w-4" />
                        {saving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </div>

                {/* Informations générales */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <CardTitle>Informations générales</CardTitle>
                        </div>
                        <CardDescription>Informations de base du site</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Nom du site</Label>
                                <Input
                                    id="siteName"
                                    value={settings.siteName || ""}
                                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                                    placeholder="Mon bois de chauffe"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                                <Input
                                    id="companyName"
                                    value={settings.companyName || ""}
                                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                                    placeholder="Nom de l'entreprise"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="siteDescription">Description du site</Label>
                            <Input
                                id="siteDescription"
                                value={settings.siteDescription || ""}
                                onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                                placeholder="Description pour le SEO"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="siteKeywords">Mots-clés SEO</Label>
                            <Input
                                id="siteKeywords"
                                value={settings.siteKeywords || ""}
                                onChange={(e) => handleInputChange("siteKeywords", e.target.value)}
                                placeholder="bois, chauffage, livraison, france"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            <CardTitle>Informations de contact</CardTitle>
                        </div>
                        <CardDescription>Email, téléphone et WhatsApp</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Email</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    value={settings.contactEmail || ""}
                                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                                    placeholder="contact@exemple.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactPhone">Téléphone</Label>
                                <Input
                                    id="contactPhone"
                                    value={settings.contactPhone || ""}
                                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                                    placeholder="+33 6 00 00 00 00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsappLink">Lien WhatsApp</Label>
                            <Input
                                id="whatsappLink"
                                value={settings.whatsappLink || ""}
                                onChange={(e) => handleInputChange("whatsappLink", e.target.value)}
                                placeholder="https://wa.me/33600000000"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Adresse */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <CardTitle>Adresse de l'entreprise</CardTitle>
                        </div>
                        <CardDescription>Adresse physique de votre entreprise</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="street">Rue</Label>
                            <Input
                                id="street"
                                value={settings.address?.street || ""}
                                onChange={(e) => handleNestedInputChange("address", "street", e.target.value)}
                                placeholder="10 RUE DU MONUMENT"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Code postal</Label>
                                <Input
                                    id="postalCode"
                                    value={settings.address?.postalCode || ""}
                                    onChange={(e) => handleNestedInputChange("address", "postalCode", e.target.value)}
                                    placeholder="75001"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">Ville</Label>
                                <Input
                                    id="city"
                                    value={settings.address?.city || ""}
                                    onChange={(e) => handleNestedInputChange("address", "city", e.target.value)}
                                    placeholder="Paris"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Pays</Label>
                                <Input
                                    id="country"
                                    value={settings.address?.country || ""}
                                    onChange={(e) => handleNestedInputChange("address", "country", e.target.value)}
                                    placeholder="France"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Informations légales */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <CardTitle>Informations légales</CardTitle>
                        </div>
                        <CardDescription>SIREN, SIRET, TVA</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="siren">SIREN</Label>
                                <Input
                                    id="siren"
                                    value={settings.siren || ""}
                                    onChange={(e) => handleInputChange("siren", e.target.value)}
                                    placeholder="123456789"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="siret">SIRET</Label>
                                <Input
                                    id="siret"
                                    value={settings.siret || ""}
                                    onChange={(e) => handleInputChange("siret", e.target.value)}
                                    placeholder="12345678900013"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vatNumber">N° TVA Intracommunautaire</Label>
                                <Input
                                    id="vatNumber"
                                    value={settings.vatNumber || ""}
                                    onChange={(e) => handleInputChange("vatNumber", e.target.value)}
                                    placeholder="FR12345678901"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contenus légaux */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <CardTitle>Contenus légaux</CardTitle>
                        </div>
                        <CardDescription>Gérez les contenus des pages légales (Markdown supporté)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="mentionsLegales">Mentions Légales</Label>
                                <a
                                    href="/mentions-legales"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Voir la page
                                </a>
                            </div>
                            <Textarea
                                id="mentionsLegales"
                                value={settings.legalContent?.mentionsLegales || ""}
                                onChange={(e) => handleNestedInputChange("legalContent", "mentionsLegales", e.target.value)}
                                placeholder="Contenu des mentions légales (Markdown)"
                                rows={6}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Laissez vide pour utiliser le contenu par défaut généré automatiquement
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="politiqueConfidentialite">Politique de Confidentialité</Label>
                                <a
                                    href="/politique-confidentialite"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Voir la page
                                </a>
                            </div>
                            <Textarea
                                id="politiqueConfidentialite"
                                value={settings.legalContent?.politiqueConfidentialite || ""}
                                onChange={(e) => handleNestedInputChange("legalContent", "politiqueConfidentialite", e.target.value)}
                                placeholder="Contenu de la politique de confidentialité (Markdown)"
                                rows={6}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Laissez vide pour utiliser le contenu par défaut généré automatiquement
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="cgv">Conditions Générales de Vente (CGV)</Label>
                                <a
                                    href="/cgv"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Voir la page
                                </a>
                            </div>
                            <Textarea
                                id="cgv"
                                value={settings.legalContent?.cgv || ""}
                                onChange={(e) => handleNestedInputChange("legalContent", "cgv", e.target.value)}
                                placeholder="Contenu des conditions générales de vente (Markdown)"
                                rows={6}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Laissez vide pour utiliser le contenu par défaut généré automatiquement
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="cookies">Politique de Cookies</Label>
                                <a
                                    href="/cookies"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Voir la page
                                </a>
                            </div>
                            <Textarea
                                id="cookies"
                                value={settings.legalContent?.cookies || ""}
                                onChange={(e) => handleNestedInputChange("legalContent", "cookies", e.target.value)}
                                placeholder="Contenu de la politique de cookies (Markdown)"
                                rows={6}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Laissez vide pour utiliser le contenu par défaut généré automatiquement
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Zones de livraison */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-primary" />
                                <div>
                                    <CardTitle>Zones de livraison</CardTitle>
                                    <CardDescription>Configurez les pays et régions de livraison avec leurs tarifs</CardDescription>
                                </div>
                            </div>
                            <Button onClick={handleAddShippingZone} variant="outline" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Ajouter un pays
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="freeShippingThreshold">Seuil de livraison gratuite (€)</Label>
                            <Input
                                id="freeShippingThreshold"
                                type="number"
                                value={settings.freeShippingThreshold || 0}
                                onChange={(e) => handleInputChange("freeShippingThreshold", parseFloat(e.target.value))}
                                placeholder="500"
                            />
                        </div>

                        <Separator />

                        {settings.shippingZones?.map((zone, zoneIndex) => (
                            <div key={zoneIndex} className="border rounded-lg p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor={`country-${zoneIndex}`}>Pays</Label>
                                        <Input
                                            id={`country-${zoneIndex}`}
                                            value={zone.country || ""}
                                            onChange={(e) => handleShippingZoneChange(zoneIndex, "country", e.target.value)}
                                            placeholder="France"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => handleRemoveShippingZone(zoneIndex)}
                                        variant="ghost"
                                        size="icon"
                                        className="ml-2 text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="space-y-3 pl-4 border-l-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Régions</Label>
                                        <Button
                                            onClick={() => handleAddRegion(zoneIndex)}
                                            variant="outline"
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Ajouter une région
                                        </Button>
                                    </div>

                                    {zone.regions?.map((region, regionIndex) => (
                                        <div key={regionIndex} className="flex items-end gap-2">
                                            <div className="flex-1 space-y-2">
                                                <Label htmlFor={`region-${zoneIndex}-${regionIndex}`} className="text-xs">
                                                    Nom de la région
                                                </Label>
                                                <Input
                                                    id={`region-${zoneIndex}-${regionIndex}`}
                                                    value={region.name || ""}
                                                    onChange={(e) =>
                                                        handleRegionChange(zoneIndex, regionIndex, "name", e.target.value)
                                                    }
                                                    placeholder="Île-de-France"
                                                    size="sm"
                                                />
                                            </div>

                                            <div className="w-32 space-y-2">
                                                <Label htmlFor={`cost-${zoneIndex}-${regionIndex}`} className="text-xs">
                                                    Prix (€)
                                                </Label>
                                                <Input
                                                    id={`cost-${zoneIndex}-${regionIndex}`}
                                                    type="number"
                                                    value={region.cost || 0}
                                                    onChange={(e) =>
                                                        handleRegionChange(
                                                            zoneIndex,
                                                            regionIndex,
                                                            "cost",
                                                            parseFloat(e.target.value)
                                                        )
                                                    }
                                                    placeholder="15"
                                                    size="sm"
                                                />
                                            </div>

                                            <Button
                                                onClick={() => handleRemoveRegion(zoneIndex, regionIndex)}
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Bouton d'enregistrement final */}
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
                        <Save className="h-4 w-4" />
                        {saving ? "Enregistrement..." : "Enregistrer tous les paramètres"}
                    </Button>
                </div>
            </div>
        </AdminLayout>
    )
}
