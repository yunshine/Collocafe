// Mongoose/SCHEMA SETUP
const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  name: String,
  area: String,
  // how to set a default value in the schema...
  // created:  {type: Date, default: Date.now},
  // One to Many database association (this is an example of object reference association vs. embedded data association) with comments...
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// Creates the model from the schema that we've designated
// const Cafe = mongoose.model('Cafe', cafeSchema);


// Creates and exports the model from the schema that we've designated
module.exports = mongoose.model('Cafe', cafeSchema);
