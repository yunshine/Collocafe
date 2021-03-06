// Mongoose/SCHEMA SETUP
const mongoose = require('mongoose');

const options = { toJSON: { virtuals: true } };

const cafeSchema = new mongoose.Schema({
    name: String,
    area: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    // how to set a default value in the schema...
    // created:  {type: Date, default: Date.now},
    // One to Many database association (this is an example of object reference association vs. embedded data association) with comments...

    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment", // refers to the model that we're referring to...
        }
    ],
});
// Creates the model from the schema that we've designated
// const Cafe = mongoose.model('Cafe', cafeSchema);

cafeSchema.virtual('properties.popupMarkup').get(function () {
    return `${this.name}`;
}, options);


// Creates and exports the model from the schema that we've designated
module.exports = mongoose.model('Cafe', cafeSchema);
