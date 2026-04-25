import { useState } from 'react'
import { motion } from 'framer-motion'

const TOTAL_TESTIMONIALS = 234
const VISIBLE_COUNT = 5

const defaultTestimonials = [
    {
        _id: 'g1',
        name: 'Gilles C.',
        rating: 1,
        comment: `déjà client j'ai fait une nouvelle commande mais la livraison s'est avérée non conforme aux bûches commandées en 50 cm, 10% du volume livré est constitué de chute de coupe et de déchets de bois de toute sorte y compris d'écorce ! pour le service client contacté avec photos à l'appui c'est un taux de perte normal je ne recommande pas ce fournisseur qui n'a aucun égard pour ses clients renouvelants. annoncé comme bois sec prêt à brûler il prend très mal dans mon insert, du coup je dois le stocker pour l'année prochaine. sur ce coup là j'ai perdu du temps et de l'argent, mais je n'ai pas perdu la leçon`,
        date: '2026-03-30',
        verified: true
    },
    {
        _id: 'c1',
        name: 'Cyril V.',
        rating: 5,
        comment: `très bonne qualité merci`,
        date: '2026-03-02',
        verified: true
    },
    {
        _id: 't1',
        name: 'Thomas C.',
        rating: 1,
        comment: `Une très très mauvaise expérience d'achat de buches densifiées. Dès les premiers feux, je constate que les bûches brûlent extrêmement mal et génèrent un tas de cendre gigantesque qui finit par étouffer le feu. De plus les buches sont friables à la main et se cassent dès la sortie du plastique d'emballage. J'en fais part au service client et après un grand nombre d'échanges qui s'étale sur plusieurs mois, on m'a proposé un dédommagement de 80€ sur une pallette à plus de 400€. on m'a répondu que tout était conforme sans autre justificatifs. Je suis très frustré de cette situation car il n'y a aucun moyen pour prouver sa bonne foi`,
        date: '2026-02-27',
        verified: true
    },
    {
        _id: 'j1',
        name: 'Jacques B.',
        rating: 5,
        comment: `Nous avons toujours qqles difficultés pour la conclusion et le paiement sinon tout va bien`,
        date: '2026-02-27',
        verified: true
    },
    {
        _id: 's1',
        name: 'Sophie L.',
        rating: 5,
        comment: `3eme commande chez eux. je ne cherche plus ailleurs, la qualité est la même à chaque fois et le prix reste correct. rien à redire`,
        date: '2026-02-10',
        verified: true
    },
    {
        _id: 'p1',
        name: 'Pierre M.',
        rating: 4,
        comment: `bois de bonne qualité, bien calibré. la livraison a pris un jour de plus que prévu ce qui m'a un peu contraint côté organisation mais le service client m'a prévenu. rien de rédhibitoire, je reviendrai`,
        date: '2026-01-18',
        verified: true
    },
    {
        _id: 'm1',
        name: 'Michel R.',
        rating: 4,
        comment: `granulés corrects, mon poêle tourne bien depuis. deux sacs sur la palette avaient le plastique déchiré à la livraison mais le contenu était intact. j'ai contacté le SAV, ils ont répondu le même jour. positif dans l'ensemble`,
        date: '2026-01-05',
        verified: true
    },
    {
        _id: 'i1',
        name: 'Isabelle D.',
        rating: 5,
        comment: `je suis en zone rurale et j'avais un peu peur pour la livraison. tout s'est passé sans souci, le livreur a mis le bois directement dans l'abri comme je le souhaitais. bien.`,
        date: '2025-12-14',
        verified: true
    },
    {
        _id: 'jc1',
        name: 'Jean-Claude M.',
        rating: 3,
        comment: `le bois en lui-même est bon, sec et bien coupé. par contre pour la livraison j'ai eu du mal à savoir quand exactement ils allaient passer — j'ai attendu toute la matinée, ils sont venus l'après-midi. ce genre de détail mérite d'être amélioré`,
        date: '2025-12-03',
        verified: true
    },
    {
        _id: 'f1',
        name: 'Françoise B.',
        rating: 4,
        comment: `commande rapide et bois bien emballé. quelques bûches un peu courtes par rapport aux 50cm annoncés mais dans l'ensemble ça chauffe bien. je referai une commande l'hiver prochain`,
        date: '2025-11-21',
        verified: true
    },
    {
        _id: 'r1',
        name: 'Romain T.',
        rating: 5,
        comment: `nickel. 2eme commande, toujours pareil, bois sec, livraison propre, chauffagiste qui m'a confirmé la bonne qualité du bois. rien à dire`,
        date: '2025-11-14',
        verified: true
    },
    {
        _id: 'n1',
        name: 'Nathalie G.',
        rating: 3,
        comment: `le bois est correct mais j'ai eu un souci avec le créneau de livraison, on m'a livré sans prévenir alors que j'étais pas là. le voisin a signé à ma place heureusement. pour le bois en lui même pas de problème particulier`,
        date: '2025-11-08',
        verified: true
    },
    {
        _id: 'o1',
        name: 'Olivier K.',
        rating: 5,
        comment: `très satisfait. j'avais hésité à commander en ligne du bois de chauffage mais franchement c'est pratique et la qualité est là. le chêne est vraiment bien sec, s'allume facilement et tient toute la nuit dans le poêle`,
        date: '2025-10-29',
        verified: true
    },
]

function StarRating({ rating }) {
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="ml-1 text-sm text-gray-500">{rating} sur 5</span>
        </div>
    )
}

function ReviewItem({ testimonial }) {
    const date = new Date(testimonial.date).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <div className="py-5 border-b border-gray-100 last:border-0">
            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">{testimonial.name}</span>
                {testimonial.verified && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Achat vérifié
                    </span>
                )}
            </div>
            <StarRating rating={testimonial.rating} />
            <p className="mt-2 text-gray-700 text-sm leading-relaxed">{testimonial.comment}</p>
            <p className="mt-2 text-xs text-gray-400">Publié le {date}</p>
        </div>
    )
}

export default function TestimonialsSection({ testimonials = [] }) {
    const [showAll, setShowAll] = useState(false)
    const [formState, setFormState] = useState({ name: '', comment: '' })
    const [formStatus, setFormStatus] = useState(null)
    const [formError, setFormError] = useState('')

    const list = testimonials.length > 0 ? testimonials : defaultTestimonials
    const visible = showAll ? list : list.slice(0, VISIBLE_COUNT)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setFormStatus('loading')

        try {
            const res = await fetch('/api/testimonials/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState)
            })
            const data = await res.json()

            if (!res.ok) {
                setFormError(data.message || 'Une erreur est survenue.')
                setFormStatus('error')
            } else {
                setFormStatus('success')
                setFormState({ name: '', comment: '' })
            }
        } catch {
            setFormError('Erreur réseau, veuillez réessayer.')
            setFormStatus('error')
        }
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                {/* En-tête */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Avis clients</h2>
                    <p className="text-sm text-gray-500">{TOTAL_TESTIMONIALS} avis déposés</p>
                </div>

                {/* Liste d'avis */}
                <div className="divide-y divide-gray-100">
                    {visible.map((t, i) => (
                        <motion.div
                            key={t._id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <ReviewItem testimonial={t} />
                        </motion.div>
                    ))}
                </div>

                {/* Voir plus */}
                {!showAll && list.length > VISIBLE_COUNT && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="mt-6 w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Voir tous les avis ({list.length})
                    </button>
                )}

                {/* Formulaire */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Laisser un avis</h3>
                    <p className="text-xs text-gray-400 mb-6">Les avis sont vérifiés avant publication.</p>

                    {formStatus === 'success' ? (
                        <div className="flex items-center gap-3 py-4 px-4 rounded-xl bg-green-50 text-green-700 text-sm">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Merci. Votre avis sera publié après validation.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="t-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="t-name"
                                    type="text"
                                    value={formState.name}
                                    onChange={(e) => setFormState(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Prénom N."
                                    maxLength={100}
                                    required
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition"
                                />
                            </div>

                            <div>
                                <label htmlFor="t-comment" className="block text-sm font-medium text-gray-700 mb-1">
                                    Commentaire <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    id="t-comment"
                                    value={formState.comment}
                                    onChange={(e) => setFormState(p => ({ ...p, comment: e.target.value }))}
                                    placeholder="Votre expérience..."
                                    rows={4}
                                    maxLength={1000}
                                    required
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm text-gray-900 placeholder-gray-400 resize-none transition"
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">{formState.comment.length}/1000</p>
                            </div>

                            {formStatus === 'error' && (
                                <p className="text-red-500 text-sm">{formError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={formStatus === 'loading'}
                                className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {formStatus === 'loading' ? 'Envoi...' : 'Envoyer'}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </section>
    )
}
