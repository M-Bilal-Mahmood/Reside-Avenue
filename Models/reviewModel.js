let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Model = mongoose.model;

// Review Schema 
let reviewsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

// Model Creation
let Review = Model("Review", reviewsSchema);

// Exporting model
module.exports = Review;