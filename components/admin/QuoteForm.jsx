"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function QuoteForm({ order, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        amount: order.total,
        iban: "",
        bic: "",
        accountName: "Bois de Chauffe",
        notes: "",
    })
    const [loading, setLoading] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch(`/api/admin/orders/${order._id}/quote`, {
                method: "POST",
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
            console.error("Erreur envoi devis:", error)
            alert("Erreur lors de l'envoi du devis")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Récapitulatif de la commande</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Client:</span>
                            <span>
                                {order.customer.firstName} {order.customer.lastName}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Email:</span>
                            <span>{order.customer.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Articles:</span>
                            <span>{order.items.length}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Total commande:</span>
                            <span>{order.total}€</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quote Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="amount">Montant à payer (€) *</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => handleInputChange("amount", Number.parseFloat(e.target.value) || 0)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="iban">IBAN *</Label>
                    <Input
                        id="iban"
                        value={formData.iban}
                        onChange={(e) => handleInputChange("iban", e.target.value)}
                        placeholder="FR76 1234 5678 9012 3456 7890 123"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="bic">BIC *</Label>
                    <Input
                        id="bic"
                        value={formData.bic}
                        onChange={(e) => handleInputChange("bic", e.target.value)}
                        placeholder="ABCDFRPP"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="accountName">Nom du bénéficiaire *</Label>
                    <Input
                        id="accountName"
                        value={formData.accountName}
                        onChange={(e) => handleInputChange("accountName", e.target.value)}
                        placeholder="Bois de Chauffe"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="notes">Notes additionnelles</Label>
                    <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        rows={4}
                        placeholder="Instructions de paiement, délais de livraison, etc."
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            "Envoyer le devis"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}