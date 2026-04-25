import { withPublicAPI, createResponse } from '@/middleware/api'
import { Testimonial } from '@/models'

async function handler(req, res) {
    const { name, comment } = req.body

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

    const testimonial = await Testimonial.create({
        name: name.trim(),
        comment: comment.trim(),
        location: 'France',
        rating: 5,
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
