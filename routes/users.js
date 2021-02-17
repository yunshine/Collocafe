const express = require('express');
const router = express.Router();
// const passport = require('passport');

// add in the correct models...
const User = require('../models/user');

// add in the middlewareObj...
// const middleware = require('../middleware/index.js');

// SHOW Route - shows one user
router.get("/users/:id", (req, res) => {
    // *** Finds a cafe in the DB by its id & passes that cafe to the show page***
    // Cafe.findById(req.params.id, function (err, foundCafe) {

    // *** Finds a cafe in the DB by its id & passes that cafe to the edit page with associated comments using .populate("comments").exec ***
    // User.findById(req.params.id).populate("comments").exec(function (err, foundCafe) {

    // http://localhost:3000/users/5fb0c5904e6966001720ab8c

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            req.flash('error', "There was an error, and that user could not be found...");
            res.redirect("/cafes");
        } else {
            // renders the show page view with the one user from the DB
            console.log("foundUser from user show route: ", foundUser);

            res.render("users/show.ejs", { user: foundUser });
        }
    });
});

module.exports = router;
