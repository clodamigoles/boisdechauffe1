import { useState } from 'react'

export default function NewsletterSection() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'homepage' }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'inscription')
            }

            setIsSuccess(true)
            setEmail('')
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="py-14 bg-gray-900">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Restez informé de nos offres et nouveautés
                </h2>

                {isSuccess ? (
                    <p className="text-gray-300 text-sm">
                        Inscription confirmée. Vérifiez votre boîte mail.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Votre adresse email"
                            required
                            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-amber-400 transition text-sm"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {isLoading ? 'Inscription...' : 'S\'inscrire'}
                        </button>
                    </form>
                )}

                {error && (
                    <p className="mt-3 text-red-400 text-sm">{error}</p>
                )}

                <p className="mt-4 text-xs text-gray-500">
                    Désabonnement possible à tout moment.
                </p>
            </div>
        </section>
    )
}
