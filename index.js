if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./Models/userModel.js');
const listings = require('./routes/listings.js');
const reviews = require('./routes/reviews.js');
const users = require('./routes/users.js');

const port = process.env.PORT || 3000;

// ================================
// Parsing Middleware
// ================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

app.use(methodOverride("_method"));

const mongoSession = MongoStore.create({
    mongoUrl: process.env.ATLAS_DB,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

mongoSession.on("error", (error) => {
    console.log(`Mongo Session Error: ${error}`);
});

app.use(session({
    store: mongoSession,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: "email"
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
});

// ================================
// Flash + Locals
// ================================
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMsg = req.flash("flashMsg");
    res.locals.optName = req.flash("optType");
    res.locals.currentUser = req.user;
    next();
});

// ================================
// MongoDB Connection
// ================================
main().then(() => {
    console.log("Mongo Connection Open");
}).catch(err => {
    console.log("Mongo Connection Error:", err.message);
});
async function main() {
    await mongoose.connect(process.env.ATLAS_DB);
}

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

app.use((req, res) => {
    res.status(404).render("listings/error", {
        message: "Page not found",
        statusCode: 404
    });
});

app.use((err, req, res, next) => {
    if (err.name === "CastError") {
        err.message = "Invalid ID";
        err.statusCode = 400;
        return next(err);
    }
    if (err.name === "ValidationError") {
        err.message = "Required field is missing";
        err.statusCode = 400;
        return next(err);
    }
    next(err);
});

app.use((err, req, res, next) => {
    if (err.code === 11000) {
        err.message = "This record already exists";
        err.statusCode = 409;
    }
    next(err);
});

app.use((err, req, res, next) => {
    if (err.name === "MongoNetworkError") {
        err.message = "Database connection error";
        err.statusCode = 503;
    }
    next(err);
});

app.use((err, req, res, next) => {
    let { message = "Something went wrong", statusCode = 500 } = err;
    res.status(statusCode).render("listings/error", { message, statusCode });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});