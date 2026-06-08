const Joi = require("joi");
const listingSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description:Joi.string().min(10).max(1000).required() ,
    image: Joi.string().allow("", null).optional(),
    price: Joi.number().min(1).max(100000).required(),
    country: Joi.string().required(),
    location: Joi.string().required()
});

module.exports = listingSchema;