// Mongoose/SCHEMA SETUP
const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  name: String,
  area: String,
  // how to set a default value in the schema...
  // created:  {type: Date, default: Date.now},
});

// Creates the model from the schema that we've designated
// const Cafe = mongoose.model('Cafe', cafeSchema);


// Creates and exports the model from the schema that we've designated
module.exports = mongoose.model('Cafe', cafeSchema);
