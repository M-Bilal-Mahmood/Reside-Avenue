const express = require("express");
const router = express.Router();
const upload = require('../config/multer.js');
const wrapAsync = require('../utils/wrapAsync.js');
const listingSchema = require('../JoiSchemas/listingSchema.js');
const listingController = require('../controllers/listings.js')
const { isLoggedIn, isOwner, formValidation } = require('../middleware.js');

router.route("/").
    get(wrapAsync(listingController.index)).
    post( upload.single('image'), isLoggedIn, formValidation, wrapAsync(listingController.createListing));

router.get("/new", isLoggedIn, listingController.showListingForm);

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.showEditform));

router.route("/:id").
    get(wrapAsync(listingController.showListing)).
    put( upload.single('image'), isLoggedIn, isOwner ,formValidation, wrapAsync(listingController.updateListing)).
    delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
module.exports = router;