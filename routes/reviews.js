const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const reviewSchema = require('../JoiSchemas/reviewSchema.js');
const listingReviewscontroller = require('../controllers/listingReviews.js');
const { isLoggedIn, isAuthor, reviewFormValidation } = require('../middleware.js');

router.post("/new", isLoggedIn,reviewFormValidation, wrapAsync(listingReviewscontroller.postReview));
router.delete("/:reviewId", isLoggedIn, isAuthor,wrapAsync(listingReviewscontroller.delteReviews));
module.exports = router;