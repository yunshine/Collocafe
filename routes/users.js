const express = require('express');
const router = express.Router();
// const passport = require('passport');

// add in the correct models...
const User = require('../models/user');
const Cafe = require('../models/cafe');

// add in the middlewareObj...
const middleware = require('../middleware/index.js');
const { request } = require('express');

// UPDATE User - bookmarks one cafe to the user model...
// Q: first, before bookmarking, is the user logged in? Use middleware...
router.put("/users/:userID/bookmark/:cafeID", middleware.isLoggedIn, (req, res) => {

    Cafe.findById(req.params.cafeID, function (err, foundCafe) {
        if (err) {
            console.log(error);
            req.flash('error', "There was an error, and that cafe could not be found...");
            res.redirect(`cafes/${req.params.cafeID}`);
        } else {
            // middleware has already checked if the user is logged in...
            let newUser = {};

            User.findByIdAndUpdate(req.params.userID, newUser, function (err, updatedUser) {
                updatedUser.bookmarks.push(foundCafe);
                updatedUser.save();
                if (err) {
                    console.log(error);
                    req.flash('error', "That user could not be found.");
                    res.redirect(`/ users / ${req.params.userID}`);
                } else {
                    req.flash('success', "That cafe has been bookmarked.");
                    res.redirect(`/users/${req.params.userID}`);
                }
            });
        }
    });
});

// UPDATE User - deletes a bookmarks from the user model...
// Q: first, before deleting the bookmark, is user logged in? Use middleware...
router.put("/users/:userID/deletebookmark/:cafeID", middleware.isLoggedIn, (req, res) => {

    Cafe.findById(req.params.cafeID, function (err, foundCafe) {
        if (err) {
            console.log(error);
            req.flash('error', "There was an error, and that cafe could not be found...");
            res.redirect(`/users/${req.params.userID}`);
        } else {
            // middleware has already checked if the user is logged in...
            let newUser = {};

            User.findByIdAndUpdate(req.params.userID, newUser, function (err, updatedUser) {
                let indexToDelete;

                for (let i = 0; i < updatedUser.bookmarks.length; i++) {
                    if (updatedUser.bookmarks[i]._id.toString() === req.params.cafeID.toString()) {
                        indexToDelete = i;
                        break;
                    }
                };

                updatedUser.bookmarks.splice(indexToDelete, 1);
                updatedUser.save();
                if (err) {
                    console.log(error);
                    req.flash('error', "That user could not be found.");
                    res.redirect(`/users/ ${req.params.userID}`);
                } else {
                    req.flash('success', "That bookmark has been deleted.");
                    res.redirect(`/users/${req.params.userID}`);
                }
            });
        }
    });
});

// UPDATE User - deletes a bookmarks from the user model from the cafe show page...
// Q: first, before deleting the bookmark, is user logged in? Use middleware...
router.put("/users/:userID/cafebookmarkdelete/:cafeID", middleware.isLoggedIn, (req, res) => {

    Cafe.findById(req.params.cafeID, function (err, foundCafe) {
        if (err) {
            console.log(error);
            req.flash('error', "There was an error, and that cafe could not be found...");
            res.redirect(`/users/${req.params.userID}`);
        } else {
            // middleware has already checked if the user is logged in...
            let newUser = {};

            User.findByIdAndUpdate(req.params.userID, newUser, function (err, updatedUser) {
                let indexToDelete;

                for (let i = 0; i < updatedUser.bookmarks.length; i++) {
                    if (updatedUser.bookmarks[i]._id.toString() === req.params.cafeID.toString()) {
                        indexToDelete = i;
                        break;
                    }
                };

                updatedUser.bookmarks.splice(indexToDelete, 1);
                updatedUser.save();
                if (err) {
                    console.log(error);
                    req.flash('error', "That user could not be found.");
                    res.redirect(`/users/ ${req.params.userID}`);
                } else {
                    req.flash('success', "Your bookmark has been deleted.");
                    res.redirect(`/cafes/${req.params.cafeID}`);
                }
            });
        }
    });
});


// SHOW Route - shows one user
router.get("/users/:id", (req, res) => {
    User.findById(req.params.id).populate("bookmarks").exec(function (err, foundUser) {
        if (err) {
            console.log(err);
            req.flash('error', "There was an error, and that user could not be found...");
            res.redirect("/cafes");
        } else {
            // renders the show page view with the one user from the DB
            res.render("users/show.ejs", { user: foundUser });
        }
    });
});

module.exports = router;
