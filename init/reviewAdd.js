let mongoose = require('mongoose');
let ListingModel = require('../Models/Listing.js');
let ReviewModel = require('../Models/review.js');
let Schema = mongoose.Schema;
let Model = mongoose.model;

// Establishing a Link with MongoDB
const siteURL = "mongodb://localhost:27017/Reside_Avenue";
async function main () {
    await mongoose.connect(siteURL);    
};

//
let addingReviews = async() => {
    let review1 = await ReviewModel.create({
        name: "John Doe",
        comment: "Great place to live, but not a good place to work although the food is good and the staff is friendly",
        rating: 4
    });
    let review2 = await ReviewModel.create({
        name: "Ashley Smith",
        comment: "Have a good day for you but not for me as i have a headache",
        rating: 2
    });
    let review3 = await ReviewModel.create({
        name: "Michael Johnson",
        comment: "A greeat place for the stay but dont recommend it for work",
        rating: 3
    });
    // Find the first listing available in the database
    let selectedListing = await ListingModel.findOne({});
    selectedListing.reviews.push(review1._id, review2._id, review3._id);
    await selectedListing.save();
    return selectedListing;
};
(async () => {
    await main();
    let result = await addingReviews();
    console.log(result);
    mongoose.connection.close(); 
})();