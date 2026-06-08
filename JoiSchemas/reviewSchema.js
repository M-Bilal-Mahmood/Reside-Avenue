const Joi = require("joi");
let reviewSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(10).max(400).required()
});
module.exports = reviewSchema;