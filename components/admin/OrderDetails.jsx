"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Download, Eye, Calendar, Mail, Edit2, Save, X } from "lucide-react"
import { useState } from "react"

export default function OrderDetails({ order, onClose, onUpdate }) {
    const [isSendingEmail, setIsSendingEmail] = useState(false)
    const [emailStatus, setEmailStatus] = useState(null)
    const [isEditingBankDetails, setIsEditingBankDetails] = useState(false)
    const [bankDetails, setBankDetails] = useState({
        iban: order.bankDetails?.iban || "",
        bic: order.bankDetails?.bic || "",
        accountName: order.bankDetails?.accountName || "",
        amountToPay: order.bankDetails?.amountToPay || order.total,
    })
    const [isSavingBankDetails, setIsSavingBankDetails] = useState(false)

    const handleSendBankDetails = async () => {
        setIsSendingEmail(true)
        setEmailStatus(null)

        try {
            const response = await fetch(`/api/admin/orders/${order._id}/send-bank-details`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await response.json()

            if (data.success) {
                setEmailStatus({ type: "success", message: "Email envoyé avec succès !" })
            } else {
                setEmailStatus({ type: "error", message: data.message || "Erreur lors de l'envoi" })
            }
        } catch (error) {
            console.error("Erreur:", error)
            setEmailStatus({ type: "error", message: "Erreur de connexion" })
        } finally {
            setIsSendingEmail(false)
        }
    }

    const handleSaveBankDetails = async () => {
        setIsSavingBankDetails(true)

        try {
            const response = await fetch(`/api/orders/${order.orderNumber}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bankDetails: {
                        iban: bankDetails.iban.trim().toUpperCase(),
                        bic: bankDetails.bic.trim().toUpperCase(),
                        accountName: bankDetails.accountName.trim(),
                        amountToPay: parseFloat(bankDetails.amountToPay),
                    },
                }),
            })

            const data = await response.json()

            if (data.success) {
                setIsEditingBankDetails(false)
                // Mettre à jour l'ordre localement
                const updatedOrder = { ...order, bankDetails: data.data.bankDetails }
                setEmailStatus({ type: "success", message: "Coordonnées bancaires mises à jour avec succès !" })
                // Appeler le callback pour mettre à jour la liste parente
                if (onUpdate) {
                    onUpdate(updatedOrder)
                }
            } else {
                setEmailStatus({ type: "error", message: data.message || "Erreur lors de la mise à jour" })
            }
        } catch (error) {
            console.error("Erreur:", error)
            setEmailStatus({ type: "error", message: "Erreur de connexion" })
        } finally {
            setIsSavingBankDetails(false)
        }
    }

    const handleCancelEdit = () => {
        setIsEditingBankDetails(false)
        setBankDetails({
            iban: order.bankDetails?.iban || "",
            bic: order.bankDetails?.bic || "",
            accountName: order.bankDetails?.accountName || "",
            amountToPay: order.bankDetails?.amountToPay || order.total,
        })
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

            {/* Bank Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Informations bancaires</span>
                        <div className="flex gap-2">
                            {!isEditingBankDetails ? (
                                <>
                                    {order.bankDetails && order.bankDetails.iban && (
                                        <Button
                                            onClick={handleSendBankDetails}
                                            disabled={isSendingEmail}
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            {isSendingEmail ? "Envoi en cours..." : "Envoyer par email"}
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => setIsEditingBankDetails(true)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        {order.bankDetails && order.bankDetails.iban ? "Modifier" : "Ajouter"}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={handleSaveBankDetails}
                                        disabled={isSavingBankDetails}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isSavingBankDetails ? "Enregistrement..." : "Enregistrer"}
                                    </Button>
                                    <Button
                                        onClick={handleCancelEdit}
                                        variant="outline"
                                        size="sm"
                                        disabled={isSavingBankDetails}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Annuler
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {emailStatus && (
                        <div
                            className={`mb-4 p-3 rounded ${emailStatus.type === "success"
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                                }`}
                        >
                            {emailStatus.message}
                        </div>
                    )}

                    {isEditingBankDetails ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-iban">IBAN</Label>
                                <Input
                                    id="edit-iban"
                                    value={bankDetails.iban}
                                    onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value })}
                                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                                    className="font-mono"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-bic">BIC</Label>
                                    <Input
                                        id="edit-bic"
                                        value={bankDetails.bic}
                                        onChange={(e) => setBankDetails({ ...bankDetails, bic: e.target.value })}
                                        placeholder="ABCDEFGH"
                                        className="font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-accountName">Bénéficiaire</Label>
                                    <Input
                                        id="edit-accountName"
                                        value={bankDetails.accountName}
                                        onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                                        placeholder="Nom du bénéficiaire"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-amountToPay">Montant à payer (€)</Label>
                                <Input
                                    id="edit-amountToPay"
                                    type="number"
                                    step="0.01"
                                    value={bankDetails.amountToPay}
                                    onChange={(e) => setBankDetails({ ...bankDetails, amountToPay: parseFloat(e.target.value) || 0 })}
                                    placeholder={order.total.toString()}
                                />
                            </div>
                        </div>
                    ) : (
                        order.bankDetails && order.bankDetails.iban ? (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">IBAN:</span>
                                    <span className="font-mono">{order.bankDetails.iban}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">BIC:</span>
                                    <span className="font-mono">{order.bankDetails.bic}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Bénéficiaire:</span>
                                    <span>{order.bankDetails.accountName}</span>
                                </div>
                                {order.bankDetails.amountToPay && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Montant à payer:</span>
                                        <span className="font-semibold">{order.bankDetails.amountToPay}€</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Mis à jour le:</span>
                                    <span>{formatDate(order.bankDetails.updatedAt)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Aucune coordonnée bancaire définie pour cette commande.</p>
                                <p className="text-sm mt-2">Cliquez sur "Ajouter" pour définir les coordonnées bancaires.</p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>

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