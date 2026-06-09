const ListingModel = require('./Models/listingModel.js');
const ReviewModel = require('./Models/reviewModel.js');
const expressError = require('./utils/expressError.js');
const wrapAsync = require('./utils/wrapAsync.js');
const listingSchema = require('./JoiSchemas/listingSchema.js');
const reviewSchema = require('./JoiSchemas/reviewSchema.js');

let isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        // Defining ro redirect on the url whihc uer clicked after login or signup
        req.session.redirectUrl = req.originalUrl;
        req.flash("flashMsg", "Please login first!");
        req.flash("optType", "error");
        return res.redirect("/signin");
    } else {
        next();
    }
}

let redirector = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    } 
    next();
}

// Checking Listing Ownership via API (API Protected)
let isOwner = wrapAsync (async(req,res,next) => {
    let {id} = req.params;
    let listing = await ListingModel.findById(id);
    if (!listing) {
        req.flash("flashMsg", "Listing not found!");
        req.flash("optType", "error");
        return res.redirect("/listings");
    }
    if(!listing.owner.equals(req.user._id)) {
        req.flash("flashMsg", "Permission Denied!");
        req.flash("optType", "error");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

// Checking Submitted Form Validation via Joi 
const formValidation = (req,res,next) => {
    let {error} = listingSchema.validate(req.body); // a validation check for the form
    if (error) {
        return next(new expressError(error.details[0].message, 400));
    } else {
        next();
    }
};

// review form validation function
const reviewFormValidation = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        return next(new expressError(error.details[0].message, 400));
    } else {
        next();
    }
}

// Checking Review Authorization via API (API Protected) 
let isAuthor = wrapAsync(async(req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await ReviewModel.findById(reviewId);
    if (!review) {
        req.flash("flashMsg", "Review not found!");
        req.flash("optType", "error");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(req.user._id)) {
        req.flash("flashMsg", "You dont have permission to delete this review!");
        req.flash("optType", "error");
        return res.redirect(`/listings/${id}`);
    }
    next();
});
module.exports = { isLoggedIn, redirector, isOwner, isAuthor, formValidation , reviewFormValidation};
