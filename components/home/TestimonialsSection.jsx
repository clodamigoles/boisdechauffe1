import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'

import { useFormatter, useT } from '@/lib/i18n'

/**
 * Le mur d'avis.
 *
 * Il affichait treize avis écrits en dur dans ce fichier — dont trois d'une
 * étoile qui déconseillaient explicitement le vendeur — sous un compteur qui
 * annonçait « 234 avis déposés ». Aucun des deux chiffres ne venait de la
 * base : le compteur était une constante, la liste un tableau littéral.
 *
 * Tout vient maintenant de `/api/testimonials/showcase`. La conséquence est
 * volontaire : tant qu'aucun avis n'est publié depuis l'administration, la
 * section n'affiche que le formulaire. Une moyenne inventée coûte plus cher
 * qu'une absence de moyenne — elle ne survit pas à la première vérification.
 */
const PAGE_SIZE = 10

function StarRating({ rating, label }) {
    return (
        <div className="flex items-center gap-1" role="img" aria-label={label}>
            {[...Array(5)].map((_, position) => (
                <Star
                    key={position}
                    aria-hidden="true"
                    className={`w-4 h-4 ${position < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                />
            ))}
        </div>
    )
}

/** La barre d'une note dans la répartition. */
function DistributionRow({ stars, count, total, t }) {
    const share = total > 0 ? (count / total) * 100 : 0

    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="w-16 shrink-0 text-gray-500 tabular-nums">
                {t.plural('home.reviewsStarsLabel', stars, { count: stars })}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <span
                    className="block h-full rounded-full bg-amber-400"
                    style={{ width: `${share}%` }}
                />
            </span>
            <span className="w-8 shrink-0 text-right text-gray-400 tabular-nums">{count}</span>
        </div>
    )
}

function ReviewItem({ testimonial, t, format }) {
    return (
        <div className="py-5 border-b border-gray-100 last:border-0">
            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">{testimonial.name}</span>
                {testimonial.verified && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" aria-hidden="true" />
                        {t('home.reviewsVerified')}
                    </span>
                )}
            </div>
            <StarRating
                rating={testimonial.rating}
                label={t('home.reviewsRatingLabel', { rating: testimonial.rating })}
            />
            {/* Trois avis sur douze portent un titre, et c'est ainsi qu'ils
                ont été écrits : on n'en fabrique pas pour les neuf autres. */}
            {testimonial.title ? (
                <p className="mt-2 font-semibold text-gray-900 text-sm">{testimonial.title}</p>
            ) : null}
            <p className="mt-2 text-gray-700 text-sm leading-relaxed">{testimonial.comment}</p>
            <p className="mt-2 text-xs text-gray-400">
                {t('home.reviewsPublishedOn', { date: format.date(testimonial.createdAt) })}
                {testimonial.purchasedAt ? (
                    <>
                        {' · '}
                        {t('home.reviewsAfterOrder', { date: format.date(testimonial.purchasedAt) })}
                    </>
                ) : null}
            </p>
        </div>
    )
}

const EMPTY_SHOWCASE = { average: 0, count: 0, distribution: [0, 0, 0, 0, 0], testimonials: [] }

export default function TestimonialsSection({ showcase: initialShowcase }) {
    const t = useT()
    const format = useFormatter()

    // La synthèse arrive complète du serveur : moyenne, nombre, répartition et
    // première page. Le HTML servi porte donc déjà les bons chiffres, ce qui
    // est le seul état qu'un robot d'indexation verra.
    const [showcase, setShowcase] = useState(initialShowcase ?? EMPTY_SHOWCASE)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const [formState, setFormState] = useState({ name: '', comment: '', rating: 5 })
    const [formStatus, setFormStatus] = useState(null)
    const [formError, setFormError] = useState('')

    useEffect(() => {
        // Rattrapage : la page est régénérée toutes les heures, et la lecture
        // en base peut avoir échoué à ce moment-là. Inutile de refaire l'appel
        // quand le serveur a déjà répondu.
        if (initialShowcase) return

        let cancelled = false

        fetch(`/api/testimonials/showcase?limit=${PAGE_SIZE}`)
            .then((response) => response.json())
            .then((payload) => {
                if (!cancelled && payload?.success) setShowcase(payload.data)
            })
            .catch(() => undefined)

        return () => {
            cancelled = true
        }
    }, [initialShowcase])

    const loadMore = async () => {
        setIsLoadingMore(true)
        try {
            const response = await fetch(
                `/api/testimonials/showcase?limit=${PAGE_SIZE}&skip=${showcase.testimonials.length}`,
            )
            const payload = await response.json()
            if (payload?.success) {
                setShowcase((current) => ({
                    ...payload.data,
                    testimonials: [...current.testimonials, ...payload.data.testimonials],
                }))
            }
        } catch {
            // Un « voir plus » qui échoue laisse la liste en place : rien à dire.
        } finally {
            setIsLoadingMore(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setFormError('')
        setFormStatus('loading')

        try {
            const response = await fetch('/api/testimonials/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            })
            const payload = await response.json()

            if (!response.ok) {
                setFormError(payload.message || t('common.error'))
                setFormStatus('error')
            } else {
                setFormStatus('success')
                setFormState({ name: '', comment: '', rating: 5 })
            }
        } catch {
            setFormError(t('common.networkError'))
            setFormStatus('error')
        }
    }

    const { average, count, distribution, testimonials } = showcase
    const hasReviews = count > 0

    return (
        <section className="py-16 bg-white" aria-labelledby="reviews-title">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="mb-8">
                    <h2 id="reviews-title" className="text-2xl font-bold text-gray-900 mb-1">
                        {t('home.reviewsTitle')}
                    </h2>
                    {hasReviews ? (
                        <p className="text-sm text-gray-500">
                            {t.plural('home.reviewsBasedOn', count, { count })}
                        </p>
                    ) : null}
                </div>

                {hasReviews ? (
                    <>
                        {/* Synthèse : la moyenne et la répartition portent sur
                            tous les avis publiés, pas sur ceux affichés. */}
                        <div className="mb-8 flex flex-col gap-6 rounded-xl border border-gray-100 bg-gray-50 p-6 sm:flex-row sm:items-center">
                            <div className="shrink-0 text-center sm:text-left">
                                <div className="text-4xl font-bold text-gray-900 tabular-nums">
                                    {format.number(Math.round(average * 10) / 10)}
                                </div>
                                <div className="mt-1 flex justify-center sm:justify-start">
                                    <StarRating
                                        rating={Math.round(average)}
                                        label={t('home.reviewsRatingLabel', {
                                            rating: format.number(Math.round(average * 10) / 10),
                                        })}
                                    />
                                </div>
                            </div>
                            <div
                                className="flex-1 space-y-1.5"
                                aria-label={t('home.reviewsDistribution')}
                            >
                                {[5, 4, 3, 2, 1].map((stars) => (
                                    <DistributionRow
                                        key={stars}
                                        stars={stars}
                                        count={distribution[stars - 1] ?? 0}
                                        total={count}
                                        t={t}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {testimonials.map((testimonial, position) => (
                                <motion.div
                                    key={testimonial._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: Math.min(position, 5) * 0.05 }}
                                >
                                    <ReviewItem testimonial={testimonial} t={t} format={format} />
                                </motion.div>
                            ))}
                        </div>

                        {testimonials.length < count && (
                            <button
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                className="mt-6 w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {isLoadingMore ? t('common.loading') : t('home.reviewsLoadMore')}
                            </button>
                        )}

                        <p className="mt-3 text-center text-xs text-gray-400">
                            {t('home.reviewsShown', { shown: testimonials.length, total: count })}
                        </p>
                    </>
                ) : (
                    <p className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                        {t('home.reviewsEmpty')}
                    </p>
                )}

                {/* Formulaire */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {t('home.reviewsFormTitle')}
                    </h3>
                    <p className="text-xs text-gray-400 mb-6">{t('home.reviewsFormNotice')}</p>

                    {formStatus === 'success' ? (
                        <div className="flex items-center gap-3 py-4 px-4 rounded-xl bg-green-50 text-green-700 text-sm">
                            <Check className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                            {t('home.reviewsFormSuccess')}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="t-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('home.reviewsFormName')} <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="t-name"
                                    type="text"
                                    value={formState.name}
                                    onChange={(event) => setFormState((p) => ({ ...p, name: event.target.value }))}
                                    placeholder={t('home.reviewsFormNamePlaceholder')}
                                    maxLength={100}
                                    required
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm text-gray-900 placeholder-gray-400 transition"
                                />
                            </div>

                            {/* La note était imposée à cinq étoiles côté serveur :
                                le visiteur écrivait un avis mitigé et le site le
                                publiait comme un avis parfait. */}
                            <fieldset>
                                <legend className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('home.reviewsFormRating')} <span className="text-red-400">*</span>
                                </legend>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((stars) => (
                                        <button
                                            key={stars}
                                            type="button"
                                            onClick={() => setFormState((p) => ({ ...p, rating: stars }))}
                                            aria-pressed={formState.rating === stars}
                                            aria-label={t.plural('home.reviewsStarsLabel', stars, { count: stars })}
                                            className="p-1"
                                        >
                                            <Star
                                                aria-hidden="true"
                                                className={`w-6 h-6 transition-colors ${stars <= formState.rating
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-gray-200 fill-gray-200'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            <div>
                                <label htmlFor="t-comment" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('home.reviewsFormComment')} <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    id="t-comment"
                                    value={formState.comment}
                                    onChange={(event) => setFormState((p) => ({ ...p, comment: event.target.value }))}
                                    placeholder={t('home.reviewsFormCommentPlaceholder')}
                                    rows={4}
                                    maxLength={1000}
                                    required
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm text-gray-900 placeholder-gray-400 resize-none transition"
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right tabular-nums">
                                    {formState.comment.length}/1000
                                </p>
                            </div>

                            {formStatus === 'error' && <p className="text-red-500 text-sm">{formError}</p>}

                            <button
                                type="submit"
                                disabled={formStatus === 'loading'}
                                className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {formStatus === 'loading' ? t('common.sending') : t('home.reviewsFormSubmit')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}
