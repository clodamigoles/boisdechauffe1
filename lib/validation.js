const Joi = require("joi")

// Schéma de validation pour les commandes
const orderSchema = Joi.object({
    customer: Joi.object({
        firstName: Joi.string().trim().min(2).max(50).required().messages({
            "string.empty": "Le prénom est requis",
            "string.min": "Le prénom doit contenir au moins 2 caractères",
            "string.max": "Le prénom ne peut pas dépasser 50 caractères",
        }),
        lastName: Joi.string().trim().min(2).max(50).required().messages({
            "string.empty": "Le nom est requis",
            "string.min": "Le nom doit contenir au moins 2 caractères",
            "string.max": "Le nom ne peut pas dépasser 50 caractères",
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "L'email est requis",
            "string.email": "Format d'email invalide",
        }),
        phone: Joi.string()
            .pattern(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
            .required()
            .messages({
                "string.empty": "Le téléphone est requis",
                "string.pattern.base": "Numéro de téléphone invalide",
            }),
        company: Joi.string().trim().max(100).allow("").messages({
            "string.max": "Le nom de l'entreprise ne peut pas dépasser 100 caractères",
        }),
    }).required(),

    shippingAddress: Joi.object({
        street: Joi.string().trim().min(5).max(200).required().messages({
            "string.empty": "L'adresse est requise",
            "string.min": "L'adresse doit contenir au moins 5 caractères",
            "string.max": "L'adresse ne peut pas dépasser 200 caractères",
        }),
        city: Joi.string().trim().min(2).max(100).required().messages({
            "string.empty": "La ville est requise",
            "string.min": "La ville doit contenir au moins 2 caractères",
            "string.max": "La ville ne peut pas dépasser 100 caractères",
        }),
        postalCode: Joi.string()
            .pattern(/^[0-9]{5}$/)
            .required()
            .messages({
                "string.empty": "Le code postal est requis",
                "string.pattern.base": "Code postal invalide (5 chiffres requis)",
            }),
        country: Joi.string().trim().default("France"),
    }).required(),

    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().required().messages({
                    "string.empty": "L'ID du produit est requis",
                }),
                quantity: Joi.number().integer().min(1).max(100).required().messages({
                    "number.base": "La quantité doit être un nombre",
                    "number.integer": "La quantité doit être un nombre entier",
                    "number.min": "La quantité doit être au moins 1",
                    "number.max": "La quantité ne peut pas dépasser 100",
                }),
            }),
        )
        .min(1)
        .required()
        .messages({
            "array.min": "Au moins un article est requis",
        }),

    notes: Joi.string().trim().max(500).allow("").messages({
        "string.max": "Les notes ne peuvent pas dépasser 500 caractères",
    }),
})

// Fonction de validation des données de commande
const validateOrderData = (data) => {
    return orderSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    })
}

module.exports = {
    validateOrderData,
    orderSchema,
}