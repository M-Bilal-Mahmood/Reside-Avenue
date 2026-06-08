const ListingModel = require('../Models/listingModel.js');
const ReviewModel = require('../Models/reviewModel.js');
const expressError = require('../utils/expressError.js');

module.exports.postReview = async(req,res,next) => {
    let {id} = req.params;
    let  newReview = await ReviewModel.create(req.body);
    newReview.author = req.user._id;
    await newReview.save();
    let listing = await ListingModel.findByIdAndUpdate(id, {$push: {reviews: newReview}});
    req.flash("flashMsg", "Review is posted successfully!");
    req.flash("optType", "posted");
    res.redirect(`/listings/${id}`);
};
module.exports.delteReviews = async(req,res,next) => {
    let {id, reviewId} = req.params;
    await ListingModel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);
    req.flash("flashMsg", "Review is deleted successfully!");
    req.flash("optType", "deleted");
    res.redirect(`/listings/${id}`);
};