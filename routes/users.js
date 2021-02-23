const express = require('express');
const router = express.Router();
// const passport = require('passport');

// add in the correct models...
const User = require('../models/user');
const Cafe = require('../models/cafe');

// add in the middlewareObj...
const middleware = require('../middleware/index.js');

// user: 5fa4f19ccf84ec1429e47128
// cafe: 5fc5d8f75f084f05eb4c33c7
// http://localhost:3000/users/5fa4f19ccf84ec1429e47128/bookmark/5fc5d8f75f084f05eb4c33c7

// UPDATE User - bookmarks one cafe to the user model...
// Q: first, before bookmarking, is the user logged in? Use middleware...
router.put("/users/:userID/bookmark/:cafeID", middleware.isLoggedIn, (req, res) => {

    Cafe.findById(req.params.cafeID, function (err, foundCafe) {
        if (err) {
            console.log(error);
            req.flash('error', "There was an error, and that cafe could not be found...");
            res.redirect("/cafes");
        } else {
            // middleware has already checked if the user is logged in...
            console.log("Found Cafe: ", foundCafe);
            console.log("User: ", req.params.userID);
            // console.log("req.body: ", req.body);
            // res.render('cafes/edit.ejs', { cafe: foundCafe });

            let newUser = {};

            User.findByIdAndUpdate(req.params.userID, newUser, function (err, updatedUser) {
                console.log("updatedUser1: ", updatedUser);

                updatedUser.bookmarks.push(foundCafe);
                updatedUser.save();
                if (err) {
                    console.log(error);
                    req.flash('error', "That cafe could not be found.");
                    res.redirect(`/ cafes / ${req.params.id}`);
                } else {
                    console.log("updatedUser2: ", updatedUser);
                    // newCafe.images.push(req.files.map(f => ({ url: f.path, filename: f.filename })));
                    // req.flash('success', "This cafe has been updated.");
                    // res.redirect(`/ cafes / ${req.params.id}`);
                }
            });
        }
    });
    res.send("here is the bookmark route...");
});

// UPDATE User - bookmarks one cafe to the user model...
// Q: first, before bookmarking, is the user logged in? Use middleware...
router.put("/users/:userID/deletebookmark/:cafeID", middleware.isLoggedIn, (req, res) => {

    // Cafe.findById(req.params.cafeID, function (err, foundCafe) {
    //     if (err) {
    //         console.log(error);
    //         req.flash('error', "There was an error, and that cafe could not be found...");
    //         res.redirect("/cafes");
    //     } else {
    //         // middleware has already checked if the user is logged in...
    //         console.log("Found Cafe: ", foundCafe);
    //         console.log("User: ", req.params.userID);
    //         // console.log("req.body: ", req.body);
    //         // res.render('cafes/edit.ejs', { cafe: foundCafe });

    //         let newUser = {};

    //         User.findByIdAndUpdate(req.params.userID, newUser, function (err, updatedUser) {
    //             console.log("updatedUser1: ", updatedUser);

    //             updatedUser.bookmarks.push(foundCafe);
    //             updatedUser.save();
    //             if (err) {
    //                 console.log(error);
    //                 req.flash('error', "That cafe could not be found.");
    //                 res.redirect(`/ cafes / ${req.params.id}`);
    //             } else {
    //                 console.log("updatedUser2: ", updatedUser);
    //                 // newCafe.images.push(req.files.map(f => ({ url: f.path, filename: f.filename })));
    //                 // req.flash('success', "This cafe has been updated.");
    //                 // res.redirect(`/ cafes / ${req.params.id}`);
    //             }
    //         });
    //     }
    // });
    res.send("here is the bookmark delete route......");
});


// SHOW Route - shows one user
router.get("/users/:id", (req, res) => {
    // *** Finds a cafe in the DB by its id & passes that cafe to the show page***
    // Cafe.findById(req.params.id, function (err, foundCafe) {

    // *** Finds a cafe in the DB by its id & passes that cafe to the edit page with associated comments using .populate("comments").exec ***
    // User.findById(req.params.id).populate("comments").exec(function (err, foundCafe) {

    // http://localhost:3000/users/5fb0c5904e6966001720ab8c

    User.findById(req.params.id).populate("bookmarks").exec(function (err, foundUser) {
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
