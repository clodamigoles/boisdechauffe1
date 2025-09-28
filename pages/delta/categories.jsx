"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import CategoryForm from "@/components/admin/CategoryForm"

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

    useEffect(() => {
        fetchCategories()
    }, [search, pagination.page])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(search && { search }),
            })

            const response = await fetch(`/api/admin/categories?${params}`)
            const data = await response.json()

            if (data.success) {
                setCategories(data.data)
                setPagination((prev) => ({ ...prev, ...data.pagination }))
            }
        } catch (error) {
            console.error("Erreur chargement catégories:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (categoryId) => {
        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: "DELETE",
            })
            const data = await response.json()

            if (data.success) {
                fetchCategories()
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
        setSelectedCategory(null)
        fetchCategories()
    }

    const openEditForm = (category) => {
        setSelectedCategory(category)
        setIsFormOpen(true)
    }

    const openCreateForm = () => {
        setSelectedCategory(null)
        setIsFormOpen(true)
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Catégories</h1>
                        <p className="text-muted-foreground">Gérez vos catégories de produits</p>
                    </div>

                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateForm}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvelle catégorie
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{selectedCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
                            </DialogHeader>
                            <CategoryForm
                                category={selectedCategory}
                                onSuccess={handleFormSuccess}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search */}
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Rechercher une catégorie..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Categories List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des catégories ({pagination.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Aucune catégorie trouvée</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {categories.map((category) => (
                                    <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            {category.image && (
                                                <img
                                                    src={category.image || "/placeholder.svg"}
                                                    alt={category.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">{category.name}</h3>
                                                    {category.featured && <Badge variant="secondary">Mise en avant</Badge>}
                                                    {!category.isActive && <Badge variant="destructive">Inactif</Badge>}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {category.shortDescription || "Aucune description"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {category.productCount || 0} produit(s) • Slug: {category.slug}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm" onClick={() => openEditForm(category)}>
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
                                                        <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Êtes-vous sûr de vouloir supprimer "{category.name}" ? Cette action est irréversible.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(category._id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Supprimer
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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