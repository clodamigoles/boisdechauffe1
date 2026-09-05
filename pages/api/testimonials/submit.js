import { withPublicAPI, createResponse } from '@/middleware/api'
import { Testimonial } from '@/models'
import { resolveLocale } from '@/lib/localize-doc'
import { serverT } from '@/lib/server-i18n'

async function handler(req, res) {
    const t = serverT(req)
    const { name, comment, rating } = req.body

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json(createResponse.error(t('api.reviewNameRequired'), 'VALIDATION_ERROR'))
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 10) {
        return res.status(400).json(createResponse.error(t('api.reviewCommentRequired'), 'VALIDATION_ERROR'))
    }

    if (name.trim().length > 100) {
        return res.status(400).json(createResponse.error(t('api.reviewNameLong'), 'VALIDATION_ERROR'))
    }

    if (comment.trim().length > 1000) {
        return res.status(400).json(createResponse.error(t('api.reviewCommentLong'), 'VALIDATION_ERROR'))
    }

    // La note était imposée à cinq étoiles : le visiteur choisissait deux
    // étoiles, le site enregistrait cinq, et la moyenne affichée n'avait plus
    // de rapport avec ce que les clients avaient écrit.
    const stars = Number(rating)
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
        return res.status(400).json(createResponse.error(t('api.reviewRatingInvalid'), 'VALIDATION_ERROR'))
    }

    const testimonial = await Testimonial.create({
        name: name.trim(),
        comment: comment.trim(),
        // Faute de demander le pays au visiteur, on enregistre le marché
        // depuis lequel il écrit plutôt qu'un « France » constant.
        location: resolveLocale(req) === 'de' ? 'Deutschland' : 'France',
        rating: stars,
        verified: false,
        featured: false,
        isActive: false, // en attente de modération
    })

    return res.status(201).json(
        createResponse.success(
            { id: testimonial._id },
            t('api.reviewSent')
        )
    )
}

export default withPublicAPI({
    methods: ['POST'],
    cacheSeconds: 0,
    rateLimitMax: 10
})(handler)
