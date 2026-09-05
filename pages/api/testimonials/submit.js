import { withPublicAPI, createResponse } from '@/middleware/api'
import { Testimonial } from '@/models'
import { resolveLocale } from '@/lib/localize-doc'

async function handler(req, res) {
    const { name, comment, rating } = req.body

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json(createResponse.error('Le nom est requis (minimum 2 caractères)', 'VALIDATION_ERROR'))
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 10) {
        return res.status(400).json(createResponse.error('Le commentaire est requis (minimum 10 caractères)', 'VALIDATION_ERROR'))
    }

    if (name.trim().length > 100) {
        return res.status(400).json(createResponse.error('Le nom ne peut dépasser 100 caractères', 'VALIDATION_ERROR'))
    }

    if (comment.trim().length > 1000) {
        return res.status(400).json(createResponse.error('Le commentaire ne peut dépasser 1000 caractères', 'VALIDATION_ERROR'))
    }

    // La note était imposée à cinq étoiles : le visiteur choisissait deux
    // étoiles, le site enregistrait cinq, et la moyenne affichée n'avait plus
    // de rapport avec ce que les clients avaient écrit.
    const stars = Number(rating)
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
        return res.status(400).json(createResponse.error('La note doit être comprise entre 1 et 5', 'VALIDATION_ERROR'))
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
            'Votre témoignage a été soumis et sera publié après validation.'
        )
    )
}

export default withPublicAPI({
    methods: ['POST'],
    cacheSeconds: 0,
    rateLimitMax: 10
})(handler)
