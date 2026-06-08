if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const listings = require('./routes/listings.js');
const reviews = require('./routes/reviews.js');
const users = require('./routes/users.js');
const User = require('./Models/userModel.js');
const passport = require('passport');
const LocalStrategy = require(`passport-local`).Strategy;

const port = process.env.PORT || 3000;
//=================================
// Middlewares
//=================================

// Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS template Midlleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files Middleware
app.use(express.static(path.join(__dirname, "public")));

// Method Override Middleware
app.use(methodOverride("_method"));

// ejs mate Middleware
app.engine("ejs", ejsMate);
// // mongo session Middleware
const mongoSession = MongoStore.create({
    mongoUrl: process.env.ATLAS_DB,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

mongoSession.on("error", (error) => {
    console.log(`Mongo Session Error: ${error}`);
})

// express-session Middleware
let sessionOptions = {
    store: mongoSession,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
app.use(session(sessionOptions));

passport.use(new LocalStrategy({
    usernameField: "email"
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Adding the passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Middleware to disable browser caching for all routes
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
});

// connect-flash Middleware
app.use(flash());
app.use((req,res,next) => {
    res.locals.flashMsg = req.flash("flashMsg");
    res.locals.optName = req.flash("optType")
    res.locals.currentUser = req.user;
    next()
})

// Mongo connection
const dbURL = process.env.ATLAS_DB;
main().then(() => {
    console.log("Mongo Connection Open");
}).catch(err => {
    console.log("Mongo Connection Error");
});
async function main () {
    await mongoose.connect(dbURL);    
};

// ================================
// Express Router
// ================================
app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)
app.use("/", users)

// Page not found 
app.use((req,res) => {
    res.status(404).render("listings/error", { message: "Page not found", statusCode: 404 });
});

//=================================
// Error Handler
//=================================

// Cast and validation Error handler
app.use((err,req,res,next) => {
    if (err.name === "CastError") {
        err.message  = "Invalid ID";
        err.statusCode = 400;
        return next(err);
    }
    if (err.name === "ValidationError") {
        err.message  = "Required field is missing";
        err.statusCode = 400;
        return next(err);
    }
    next(err);
});

// Duplicate key Error handler 
app.use((err,req,res,next) => {
    if (err.code === 11000) {
        err.message = "This record (title, email, or username) already exists";
        err.statusCode = 409;
    }
    next(err);
});

//Mongo Server Network Error handler
app.use((err,req,res,next) => {
    if (err.name === "MongoNetworkError") {
        err.message = "Database connection error";
        err.statusCode = 503;
    }
    next(err);
});

// Main error handler
app.use((err,req,res,next) => {
    let { message = "Something went wrong", statusCode = 500 } = err;
    res.status(statusCode).render("listings/error", { message, statusCode });
});

// ==================================
// End of Error Handler
//=================================

// App Start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

