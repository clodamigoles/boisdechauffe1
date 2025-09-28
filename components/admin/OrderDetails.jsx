"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Calendar } from "lucide-react"

export default function OrderDetails({ order, onClose }) {
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const openReceiptInNewTab = (url) => {
        window.open(url, "_blank")
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">{order.orderNumber}</h2>
                    <p className="text-muted-foreground">
                        Commandée le{" "}
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
                <div className="flex gap-2">
                    {getStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.paymentStatus)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="font-medium">
                                {order.customer.firstName} {order.customer.lastName}
                            </p>
                            {order.customer.company && <p className="text-sm text-muted-foreground">{order.customer.company}</p>}
                        </div>
                        <div>
                            <p className="text-sm">Email: {order.customer.email}</p>
                            <p className="text-sm">Téléphone: {order.customer.phone}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>Adresse de livraison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <p>{order.shippingAddress.street}</p>
                            <p>
                                {order.shippingAddress.postalCode} {order.shippingAddress.city}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {order.paymentReceipts && order.paymentReceipts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="w-5 h-5" />
                            <span>Récépissés de paiement ({order.paymentReceipts.length})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {order.paymentReceipts.map((receipt, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-blue-900">{receipt.filename}</p>
                                            <div className="flex items-center space-x-2 text-sm text-blue-700">
                                                <Calendar className="w-4 h-4" />
                                                <span>Uploadé le {formatDate(receipt.uploadedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openReceiptInNewTab(receipt.url)}
                                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Voir
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const link = document.createElement("a")
                                                link.href = receipt.url
                                                link.download = receipt.filename
                                                link.click()
                                            }}
                                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Télécharger
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Articles commandés</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item.productSnapshot.image || "/placeholder.svg"}
                                        alt={item.productSnapshot.name}
                                        className="w-16 h-16 rounded object-cover"
                                    />
                                    <div>
                                        <h4 className="font-medium">{item.productSnapshot.name}</h4>
                                        <p className="text-sm text-muted-foreground">Prix unitaire: {item.unitPrice}€</p>
                                        <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{item.totalPrice}€</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Order Summary */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Sous-total:</span>
                            <span>{order.subtotal}€</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Frais de port:</span>
                            <span>{order.shippingCost}€</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>{order.total}€</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{order.notes}</p>
                    </CardContent>
                </Card>
            )}

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Historique</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {order.statusHistory.map((history, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                                    <div>
                                        <p className="font-medium">{getStatusBadge(history.status)}</p>
                                        {history.note && <p className="text-sm text-muted-foreground">{history.note}</p>}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(history.date).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}