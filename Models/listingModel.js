let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const Review = require("./reviewModel.js");

let propertyListingSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80"
        },
        filename: {
            type: String,
            default: ""
        }
    },
    price: { 
        type: Number,
        required: true
    },
    location: { 
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0,0]
        }
    },
    country: { 
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// Post Middleware to delete associated reviews when a listing is deleted
propertyListingSchema.post("findOneAndDelete", async(deleteListing) => {
    if (deleteListing) {
        if (deleteListing.reviews.length) {
            await Review.deleteMany({ _id: { $in: deleteListing.reviews } });
            console.log(deleteListing.reviews);
        }  
        console.log("Associated reviews deleted");
    }
});

let propertyListing = mongoose.model("propertyListing", propertyListingSchema);
module.exports = propertyListing; 