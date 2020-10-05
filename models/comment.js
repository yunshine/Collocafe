// Mongoose/SCHEMA SETUP
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  author: String
  // how to set a default value in the schema...
  // created:  {type: Date, default: Date.now},
});

// Creates the model from the schema that we've designated
// const Comment = mongoose.model('Comment', commentSchema);


// Creates and exports the model from the schema that we've designated
module.exports = mongoose.model('Comment', commentSchema);
