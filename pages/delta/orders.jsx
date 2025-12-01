"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Send, ShoppingCart, FileText, CheckCircle, XCircle, Package, Truck, Circle, Bell } from "lucide-react"
import toast from "react-hot-toast"
import OrderDetails from "@/components/admin/OrderDetails"
import QuoteForm from "@/components/admin/QuoteForm"

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isQuoteOpen, setIsQuoteOpen] = useState(false)
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
    const [updatingOrders, setUpdatingOrders] = useState(new Set())
    const [sendingReminder, setSendingReminder] = useState(new Set())

    const statusOptions = [
        { value: "pending", label: "En attente" },
        { value: "confirmed", label: "Confirmée" },
        { value: "processing", label: "En cours" },
        { value: "shipped", label: "Expédiée" },
        { value: "delivered", label: "Livrée" },
        { value: "cancelled", label: "Annulée" },
    ]

    const paymentStatusOptions = [
        { value: "pending", label: "En attente" },
        { value: "received", label: "Reçu" },
        { value: "failed", label: "Échoué" },
    ]

    useEffect(() => {
        fetchOrders()
    }, [search, selectedStatus, selectedPaymentStatus, pagination.page])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(search && { search }),
                ...(selectedStatus !== "all" && { status: selectedStatus }),
                ...(selectedPaymentStatus !== "all" && { paymentStatus: selectedPaymentStatus }),
            })

            const response = await fetch(`/api/admin/orders?${params}`)
            const data = await response.json()

            if (data.success) {
                setOrders(data.data)
                setPagination((prev) => ({ ...prev, ...data.pagination }))
            }
        } catch (error) {
            console.error("Erreur chargement commandes:", error)
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

    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: "En attente", variant: "secondary" },
            received: { label: "Reçu", variant: "default" },
            failed: { label: "Échoué", variant: "destructive" },
        }
        const config = statusConfig[status] || { label: status, variant: "secondary" }
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    const openDetails = (order) => {
        setSelectedOrder(order)
        setIsDetailsOpen(true)
    }

    const openQuoteForm = (order) => {
        setSelectedOrder(order)
        setIsQuoteOpen(true)
    }

    const handleQuoteSent = () => {
        setIsQuoteOpen(false)
        setSelectedOrder(null)
        fetchOrders()
    }

    const isNewOrder = (order) => {
        const orderDate = new Date(order.createdAt)
        const now = new Date()
        const hoursDiff = (now - orderDate) / (1000 * 60 * 60)
        return hoursDiff < 24 && order.status === "pending"
    }

    const handleStatusUpdate = async (orderId, status, paymentStatus = null) => {
        setUpdatingOrders((prev) => new Set(prev).add(orderId))

        try {
            const response = await fetch(`/api/admin/orders/${orderId}/update-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status,
                    paymentStatus,
                    note: `Statut mis à jour depuis l'interface admin`,
                }),
            })

            const data = await response.json()

            if (data.success) {
                // Mettre à jour la commande dans la liste
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? {
                                  ...order,
                                  status: data.data.order.status,
                                  paymentStatus: data.data.order.paymentStatus,
                                  statusHistory: data.data.order.statusHistory,
                              }
                            : order,
                    ),
                )
            } else {
                alert(data.message || "Erreur lors de la mise à jour")
            }
        } catch (error) {
            console.error("Erreur mise à jour statut:", error)
            alert("Erreur lors de la mise à jour du statut")
        } finally {
            setUpdatingOrders((prev) => {
                const newSet = new Set(prev)
                newSet.delete(orderId)
                return newSet
            })
        }
    }

    const handleSendReminder = async (orderId) => {
        setSendingReminder((prev) => new Set(prev).add(orderId))

        try {
            const response = await fetch(`/api/admin/orders/${orderId}/send-reminder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await response.json()

            if (data.success) {
                toast.success(data.message)
                // Mettre à jour la commande dans la liste
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? {
                                  ...order,
                                  reminderCount: data.data.reminderCount,
                                  reminderHistory: data.data.reminderHistory,
                              }
                            : order,
                    ),
                )
            } else {
                toast.error(data.message || "Erreur lors de l'envoi du rappel")
            }
        } catch (error) {
            console.error("Erreur envoi rappel:", error)
            toast.error("Erreur lors de l'envoi du rappel")
        } finally {
            setSendingReminder((prev) => {
                const newSet = new Set(prev)
                newSet.delete(orderId)
                return newSet
            })
        }
    }

    const getStatusIcon = (status) => {
        const icons = {
            pending: Circle,
            confirmed: CheckCircle,
            processing: Package,
            shipped: Truck,
            delivered: CheckCircle,
            cancelled: XCircle,
        }
        return icons[status] || Circle
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Commandes</h1>
                        <p className="text-muted-foreground">Gérez les commandes et envoyez des devis</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Rechercher une commande..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            {statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Tous les paiements" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les paiements</SelectItem>
                            {paymentStatusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Orders List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des commandes ({pagination.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-8">
                                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">Aucune commande trouvée</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => {
                                    const isNew = isNewOrder(order)
                                    const StatusIcon = getStatusIcon(order.status)
                                    const isUpdating = updatingOrders.has(order._id)

                                    return (
                                        <div
                                            key={order._id}
                                            className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                                                isNew ? "bg-amber-50 border-amber-200 shadow-sm" : ""
                                            } ${isUpdating ? "opacity-50" : ""}`}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium">{order.orderNumber}</h3>
                                                        {isNew && (
                                                            <Badge variant="outline" className="bg-amber-500 text-white border-amber-600 animate-pulse">
                                                                Nouveau
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {getStatusBadge(order.status)}
                                                    {getPaymentStatusBadge(order.paymentStatus)}
                                                    {order.paymentReceipts && order.paymentReceipts.length > 0 && (
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                                            <FileText className="w-3 h-3 mr-1" />
                                                            {order.paymentReceipts.length} récépissé{order.paymentReceipts.length > 1 ? "s" : ""}
                                                        </Badge>
                                                    )}
                                                </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        {order.customer.firstName} {order.customer.lastName}
                                                    </p>
                                                    <p>{order.customer.email}</p>
                                                    <p>{order.customer.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Livraison</p>
                                                    <p>{order.shippingAddress.street}</p>
                                                    <p>
                                                        {order.shippingAddress.postalCode} {order.shippingAddress.city}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Commande</p>
                                                    <p>{order.items.length} article(s)</p>
                                                    <p>Total: {order.total}€</p>
                                                    <p className="text-xs">
                                                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 flex-wrap gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => openDetails(order)} disabled={isUpdating}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Voir
                                                    </Button>

                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => openQuoteForm(order)}
                                                        disabled={order.status === "cancelled" || isUpdating}
                                                    >
                                                        <Send className="h-4 w-4 mr-2" />
                                                        Devis
                                                    </Button>

                                                    {order.paymentStatus === "pending" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleSendReminder(order._id)}
                                                            disabled={sendingReminder.has(order._id) || isUpdating}
                                                            className="bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                                                        >
                                                            <Bell className="h-4 w-4 mr-2" />
                                                            {sendingReminder.has(order._id) ? "Envoi..." : "Rappel"}
                                                            {order.reminderCount > 0 && (
                                                                <Badge variant="secondary" className="ml-2 bg-amber-200 text-amber-800">
                                                                    {order.reminderCount}
                                                                </Badge>
                                                            )}
                                                        </Button>
                                                    )}

                                                    <Select
                                                        value={order.status}
                                                        onValueChange={(value) => handleStatusUpdate(order._id, value)}
                                                        disabled={isUpdating}
                                                    >
                                                        <SelectTrigger className="w-40">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {statusOptions.map((status) => (
                                                                <SelectItem key={status.value} value={status.value}>
                                                                    {status.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <Select
                                                        value={order.paymentStatus}
                                                        onValueChange={(value) => handleStatusUpdate(order._id, null, value)}
                                                        disabled={isUpdating}
                                                    >
                                                        <SelectTrigger className="w-40">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {paymentStatusOptions.map((status) => (
                                                                <SelectItem key={status.value} value={status.value}>
                                                                    {status.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
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

                {/* Order Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Détails de la commande {selectedOrder?.orderNumber}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                            <OrderDetails
                                order={selectedOrder}
                                onClose={() => setIsDetailsOpen(false)}
                                onUpdate={(updatedOrder) => {
                                    // Mettre à jour la commande dans la liste
                                    setOrders((prevOrders) =>
                                        prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
                                    )
                                    setSelectedOrder(updatedOrder)
                                    fetchOrders() // Rafraîchir la liste complète
                                }}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Quote Form Dialog */}
                <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Envoyer un devis - {selectedOrder?.orderNumber}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                            <QuoteForm order={selectedOrder} onSuccess={handleQuoteSent} onCancel={() => setIsQuoteOpen(false)} />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    )
}