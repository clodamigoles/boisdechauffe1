"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"
import ProductForm from "@/components/admin/ProductForm"

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedEssence, setSelectedEssence] = useState("all")
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

    const essences = ["chêne", "hêtre", "charme", "mix", "granulés", "compressé", "allume-feu"]

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [search, selectedCategory, selectedEssence, pagination.page])

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/admin/categories?limit=100")
            const data = await response.json()
            if (data.success) {
                setCategories(data.data)
            }
        } catch (error) {
            console.error("Erreur chargement catégories:", error)
        }
    }

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(search && { search }),
                ...(selectedCategory !== "all" && { category: selectedCategory }),
                ...(selectedEssence !== "all" && { essence: selectedEssence }),
            })

            const response = await fetch(`/api/admin/products?${params}`)
            const data = await response.json()

            if (data.success) {
                setProducts(data.data)
                setPagination((prev) => ({ ...prev, ...data.pagination }))
            }
        } catch (error) {
            console.error("Erreur chargement produits:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (productId) => {
        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
            })
            const data = await response.json()

            if (data.success) {
                fetchProducts()
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error("Erreur suppression:", error)
            alert("Erreur lors de la suppression")
        }
    }

    const handleFormSuccess = () => {
        setIsFormOpen(false)
        setSelectedProduct(null)
        fetchProducts()
    }

    const openEditForm = (product) => {
        setSelectedProduct(product)
        setIsFormOpen(true)
    }

    const openCreateForm = () => {
        setSelectedProduct(null)
        setIsFormOpen(true)
    }

    const getStockBadge = (stock) => {
        if (stock === 0) return <Badge variant="destructive">Rupture</Badge>
        if (stock < 10) return <Badge variant="secondary">Stock faible</Badge>
        return <Badge variant="default">En stock</Badge>
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Produits</h1>
                        <p className="text-muted-foreground">Gérez votre catalogue de produits</p>
                    </div>

                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateForm}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nouveau produit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{selectedProduct ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
                            </DialogHeader>
                            <ProductForm
                                product={selectedProduct}
                                categories={categories}
                                onSuccess={handleFormSuccess}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Rechercher un produit..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les catégories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedEssence} onValueChange={setSelectedEssence}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Toutes les essences" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les essences</SelectItem>
                            {essences.map((essence) => (
                                <SelectItem key={essence} value={essence}>
                                    {essence}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Products List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des produits ({pagination.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">Aucun produit trouvé</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {products.map((product) => (
                                    <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={product.images?.[0]?.url || "/placeholder.svg"}
                                                alt={product.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-medium">{product.name}</h3>
                                                    {product.featured && <Badge variant="secondary">Mise en avant</Badge>}
                                                    {product.bestseller && <Badge variant="default">Bestseller</Badge>}
                                                    {!product.isActive && <Badge variant="destructive">Inactif</Badge>}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-1">{product.shortDescription}</p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>Catégorie: {product.categoryId?.name}</span>
                                                    <span>Essence: {product.essence}</span>
                                                    <span>
                                                        Prix: {product.price}€/{product.unit}
                                                    </span>
                                                    <span>Stock: {product.stock}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="font-medium">{product.price}€</p>
                                                {getStockBadge(product.stock)}
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => openEditForm(product)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Êtes-vous sûr de vouloir supprimer "{product.name}" ? Cette action est irréversible.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(product._id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Supprimer
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-sm text-muted-foreground">
                                    Page {pagination.page} sur {pagination.pages}
                                </p>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page <= 1}
                                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                    >
                                        Précédent
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page >= pagination.pages}
                                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                    >
                                        Suivant
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}