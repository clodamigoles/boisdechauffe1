import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function NewsletterSection() {
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [interests, setInterests] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const interestOptions = [
        { id: 'promotions', label: 'Promotions exclusives', icon: '💰' },
        { id: 'nouveautes', label: 'Nouveaux produits', icon: '✨' },
        { id: 'conseils', label: 'Conseils d\'experts', icon: '💡' },
        { id: 'saisons', label: 'Conseils saisonniers', icon: '🍂' }
    ]

    const handleInterestChange = (interestId) => {
        setInterests(prev =>
            prev.includes(interestId)
                ? prev.filter(id => id !== interestId)
                : [...prev, interestId]
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    firstName: firstName || undefined,
                    interests,
                    source: 'homepage'
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'inscription')
            }

            setIsSuccess(true)
            setEmail('')
            setFirstName('')
            setInterests([])

            // Reset success state after 5 seconds
            setTimeout(() => setIsSuccess(false), 5000)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Éléments décoratifs */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500 to-pink-600 rounded-full blur-3xl" />
            </div>

            {/* Particules flottantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.8, 0.2],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    {/* En-tête */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-12"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6"
                        >
                            <span className="mr-2">📬</span>
                            Newsletter Exclusive
                        </motion.div>

                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            Restez Informé des
                            <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                                Meilleures Offres
                            </span>
                        </h2>

                        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Inscrivez-vous à notre newsletter et recevez en exclusivité nos promotions,
                            nouveautés et conseils d'experts pour optimiser votre chauffage au bois.
                        </p>
                    </motion.div>

                    {/* Formulaire */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20"
                    >
                        {isSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    Inscription réussie !
                                </h3>
                                <p className="text-gray-300 text-lg">
                                    Merci ! Vous recevrez bientôt un email de confirmation.
                                    Consultez votre boîte mail (et vos spams) pour valider votre abonnement.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Champs principaux */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Input
                                            type="email"
                                            placeholder="Votre adresse email *"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="text"
                                            placeholder="Votre prénom (optionnel)"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Centres d'intérêt */}
                                <div className="text-left">
                                    <label className="block text-white font-medium mb-4">
                                        Que souhaitez-vous recevoir ? (optionnel)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {interestOptions.map((option) => (
                                            <motion.label
                                                key={option.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300 ${interests.includes(option.id)
                                                        ? 'bg-amber-500/20 border-2 border-amber-400/50'
                                                        : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={interests.includes(option.id)}
                                                    onChange={() => handleInterestChange(option.id)}
                                                    className="sr-only"
                                                />
                                                <span className="text-2xl">{option.icon}</span>
                                                <span className="text-white font-medium">{option.label}</span>
                                                {interests.includes(option.id) && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="ml-auto text-amber-400"
                                                    >
                                                        ✓
                                                    </motion.div>
                                                )}
                                            </motion.label>
                                        ))}
                                    </div>
                                </div>

                                {/* Message d'erreur */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 text-red-300"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Bouton d'inscription */}
                                <div className="text-center">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={isLoading || !email}
                                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-12 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Inscription...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="mr-2">✉️</span>
                                                S'inscrire Gratuitement
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-sm text-gray-400 mt-4">
                                        * Champ obligatoire. Désabonnement possible à tout moment.
                                    </p>
                                </div>
                            </form>
                        )}
                    </motion.div>

                    {/* Avantages Newsletter
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: '🎯',
                                title: 'Offres Exclusives',
                                description: 'Promotions réservées aux abonnés, jusqu\'à -30%'
                            },
                            {
                                icon: '📚',
                                title: 'Conseils d\'Expert',
                                description: 'Guides pratiques et astuces pour optimiser votre chauffage'
                            },
                            {
                                icon: '⚡',
                                title: 'Priorité Accès',
                                description: 'Accès anticipé aux nouveaux produits et stocks limités'
                            }
                        ].map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="text-center p-6 bg-white/5 rounded-2xl border border-white/10"
                            >
                                <div className="text-4xl mb-4">{benefit.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-300">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Statistiques Newsletter
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="mt-12 flex flex-wrap justify-center items-center space-x-8 text-gray-400"
                    >
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">👥</span>
                            <span>+25k abonnés</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">📊</span>
                            <span>Taux d'ouverture 78%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🔒</span>
                            <span>0 spam garanti</span>
                        </div>
                    </motion.div> */}
                </div>
            </div>
        </section>
    )
}