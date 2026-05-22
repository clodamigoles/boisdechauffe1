import { useState } from "react"
import { useRouter } from "next/router"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminLogin() {
    const router = useRouter()
    const [code, setCode] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            })

            if (res.ok) {
                router.push("/delta")
            } else {
                setError("Code d'accès invalide")
                setCode("")
            }
        } catch {
            setError("Erreur de connexion, réessayez")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle>Espace Admin</CardTitle>
                    <CardDescription>Saisissez votre code d'accès pour continuer</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Code d'accès"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            autoFocus
                            disabled={loading}
                        />
                        {error && (
                            <p className="text-sm text-destructive text-center">{error}</p>
                        )}
                        <Button type="submit" className="w-full" disabled={loading || !code}>
                            {loading ? "Vérification..." : "Accéder"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
