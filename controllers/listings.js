let expressError = require('../utils/expressError.js');
const ListingModel = require('../Models/listingModel.js');
let cloudinary = require('../config/cloudinary.js');
const axios = require('axios');

// map geocoding function
let geocode = async(location) => {
    try {
        let URL = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${process.env.OPENCAGE_API_KEY}`;
        let mapResponse = await axios.get(URL);
        if(mapResponse.data.results.length == 0) {
            return {lat: 0, lng: 0};
        }
        let {lat, lng} = mapResponse.data.results[0].geometry;
        return {lng, lat};
    } catch (err) {
        console.error("Geocoding Error:", err.message);
        return {lat: 0, lng: 0};
    }
}
module.exports.index = async (req,res,next) => {
    let allListings = await ListingModel.find({});
    res.render("listings/index", { allListings });
};
module.exports.showListingForm = (req,res) => {
    res.render("listings/new");
};
module.exports.createListing = async(req,res, next) => {
    let newListing = req.body;
    newListing.owner = req.user._id;
    if(req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        }
    }
    let {lng, lat} = await geocode(newListing.location);
    newListing.geometry = {
        type: "Point",
        coordinates: [lng, lat]
    };
    await ListingModel.create(newListing);
    req.flash("flashMsg", "Listing is created successfully!");
    req.flash("optType", "create")
    res.redirect("/listings");
};
module.exports.showListing = async (req,res, next) => {
    let {id} =req.params;
    let listingDetails =await ListingModel.findById(id).populate("reviews").populate("owner");
    res.render("listings/show", { listingDetails });
};
module.exports.showEditform = async(req,res, next) => {
    let {id} = req.params;
    let listingDetails = await ListingModel.findById(id);
    if(!listingDetails) {
        req.flash("flashMsg", "The requested Listing is not found!");
        req.flash("optType", "notFound")
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listingDetails });
};
module.exports.updateListing = async (req,res, next) => {
    let {id} = req.params;
    let editedListing = req.body;
    let oldListing = await ListingModel.findById(id);
    if(req.file) {
        await cloudinary.uploader.destroy(oldListing.image.filename);
        editedListing.image = {
            url: req.file.path,
            filename: req.file.filename
        }
    }
    let {lng, lat} = await geocode(editedListing.location);
    editedListing.geometry = {
        type: "Point",
        coordinates: [lng, lat]
    };
    await ListingModel.findByIdAndUpdate(id, editedListing, {new: true});
    req.flash("flashMsg", "Listing is updated successfully!");
    req.flash("optType", "update")
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing =async (req,res, next) => {
    let {id} = req.params;
    let listing = await ListingModel.findById(id);
    if(listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }
    await ListingModel.findByIdAndDelete(id);
    req.flash("flashMsg", "Listing is deleted successfully!");
    req.flash("optType", "delete")
    res.redirect("/listings");
};
