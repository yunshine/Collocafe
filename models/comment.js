// Mongoose/SCHEMA SETUP
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    // how to set a default value in the schema...
    created: { type: Date, default: Date.now() },
    author: {
        id:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // refers to the model we're referring to...
        },
        username: String,
    },
});

// Creates the model from the schema that we've designated
// const Comment = mongoose.model('Comment', commentSchema);


// Creates and exports the model from the schema that we've designated
module.exports = mongoose.model('Comment', commentSchema);
