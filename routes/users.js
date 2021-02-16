const express = require('express');
const router = express.Router();
const passport = require('passport');


// add in the correct models...
const User = require('../models/user');

// add in the middlewareObj...
const middleware = require('../middleware/index.js');

// SHOW Route - shows one user
router.get('/users', (req, res) => {
    // *** Finds a cafe in the DB by its id & passes that cafe to the show page***
    // Cafe.findById(req.params.id, function (err, foundCafe) {

    // *** Finds a cafe in the DB by its id & passes that cafe to the edit page with associated comments using .populate("comments").exec ***
    // User.findById(req.params.id).populate("comments").exec(function (err, foundCafe) {

    // res.render("users/show.ejs");
    res.send('hi testing...');

    // await User.findById(req.params.id, function (err, foundUser) {
    //     if (err) {
    //         console.log(err);
    //         req.flash('error', "There was an error, and that user could not be found...");
    //         res.redirect("/cafes");
    //     } else {
    //         // renders the show page view with the one user from the DB
    //         // res.render("users/show.ejs", { user: foundUser });
    //     }
    // });
});

// router.get('/users', (req, res) => {
//     // handle incoming flash-connect messages in the render...
//     res.send('testing...');
// });

module.exports = router;
