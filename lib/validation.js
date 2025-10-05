const Joi = require("joi")

const orderSchema = Joi.object({
    customer: Joi.object({
        firstName: Joi.string().trim().max(100).required(),
        lastName: Joi.string().trim().max(100).required(),
        email: Joi.string().trim().required(),
        phone: Joi.string().trim().required(),
        company: Joi.string().trim().max(200).allow("").optional(),
    }).required(),

    shippingAddress: Joi.object({
        street: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        postalCode: Joi.string().trim().required(),
        country: Joi.string().trim().default("France"),
    }).required(),

    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().required(),
                quantity: Joi.number().integer().min(1).required(),
            }),
        )
        .min(1)
        .required(),

    notes: Joi.string().trim().allow("").optional(),
    shippingCost: Joi.number().min(0).required(),
})

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