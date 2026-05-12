import { CreditCard, Building2 } from "lucide-react"

export default function PaymentMethodSelect({ value, onChange }) {
    const methods = [
        {
            id: "card",
            label: "Carte bancaire",
            description: "Paiement sécurisé par carte Visa, Mastercard ou American Express.",
            icon: <CreditCard className="h-5 w-5" />,
        },
        {
            id: "bank_transfer",
            label: "Virement bancaire",
            description:
                "Après validation de votre commande, vous recevrez les coordonnées bancaires par email.",
            icon: <Building2 className="h-5 w-5" />,
        },
    ]

    return (
        <div className="space-y-3">
            {methods.map((m) => (
                <button
                    key={m.id}
                    type="button"
                    onClick={() => onChange(m.id)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                        value === m.id
                            ? "border-amber-600 bg-amber-50"
                            : "border-gray-200 hover:border-amber-400"
                    }`}
                >
                    <div className={`mt-0.5 shrink-0 ${value === m.id ? "text-amber-600" : "text-gray-400"}`}>
                        {m.icon}
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900">{m.label}</p>
                        <p className="text-sm text-gray-600">{m.description}</p>
                    </div>
                    <div
                        className={`ml-auto mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                            value === m.id ? "border-amber-600 bg-amber-600" : "border-gray-300"
                        }`}
                    />
                </button>
            ))}
        </div>
    )
}
