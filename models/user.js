// Mongoose/SCHEMA SETUP
const mongoose = require('mongoose');
// for authentication...
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    // how to set a default value in the schema...
    // created:  {type: Date, default: Date.now},

    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cafe", // refers to the model that we're referring to...
        }
    ],
});

// for authentication - adds methods to our user...
userSchema.plugin(passportLocalMongoose);


// Creates the model from the schema that we've designated
// const User = mongoose.model('User', userSchema);


// Creates and exports the model from the schema that we've designated
module.exports = mongoose.model('User', userSchema);
