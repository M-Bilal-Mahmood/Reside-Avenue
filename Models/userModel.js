const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const passportLocalMongoose = require('passport-local-mongoose');

// User Schema Definition
let userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Fix: Ensure we pass the function (handles ESM/CJS interop issues)
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose, {
    usernameField: "email"
});

// Model Creation
let User = Model("User", userSchema);

// Exporting model
module.exports = User;