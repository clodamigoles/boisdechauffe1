"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        pendingOrders: 0,
        recentOrders: [],
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        try {
            const [productsRes, categoriesRes, ordersRes] = await Promise.all([
                fetch("/api/admin/products?limit=1"),
                fetch("/api/admin/categories?limit=1"),
                fetch("/api/admin/orders?limit=5"),
            ])

            const [products, categories, orders] = await Promise.all([
                productsRes.json(),
                categoriesRes.json(),
                ordersRes.json(),
            ])

            setStats({
                totalProducts: products.pagination?.total || 0,
                totalCategories: categories.pagination?.total || 0,
                totalOrders: orders.pagination?.total || 0,
                pendingOrders: orders.data?.filter((order) => order.status === "pending").length || 0,
                recentOrders: orders.data || [],
            })
        } catch (error) {
            console.error("Erreur chargement stats:", error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: "En attente", variant: "secondary" },
            confirmed: { label: "Confirmée", variant: "default" },
            processing: { label: "En cours", variant: "default" },
            shipped: { label: "Expédiée", variant: "default" },
            delivered: { label: "Livrée", variant: "default" },
            cancelled: { label: "Annulée", variant: "destructive" },
        }
        const config = statusConfig[status] || { label: status, variant: "secondary" }
        return <Badge variant={config.variant}>{config.label}</Badge>
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

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
                    <p className="text-muted-foreground">Vue d'ensemble de votre boutique</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Produits</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProducts}</div>
                            <p className="text-xs text-muted-foreground">Total des produits</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCategories}</div>
                            <p className="text-xs text-muted-foreground">Total des catégories</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalOrders}</div>
                            <p className="text-xs text-muted-foreground">Total des commandes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">En attente</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                            <p className="text-xs text-muted-foreground">Commandes en attente</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Commandes récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.recentOrders.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">Aucune commande récente</p>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentOrders.map((order) => (
                                    <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-1">
                                            <p className="font-medium">{order.orderNumber}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.customer.firstName} {order.customer.lastName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                                            </p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="font-medium">{order.total}€</p>
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}