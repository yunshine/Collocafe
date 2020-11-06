// Mongoose/SCHEMA SETUP
const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  name: String,
  area: String,
  image: String,
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


// Creates and exports the model from the schema that we've designated
module.exports = mongoose.model('Cafe', cafeSchema);
