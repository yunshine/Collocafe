const express = require('express');
const router = express.Router();
// const passport = require('passport');

// add in the correct models...
const User = require('../models/user');
const Cafe = require('../models/cafe');

// add in the middlewareObj...
const middleware = require('../middleware/index.js');
const { request } = require('express');

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

            let newUser = {};

            User.findByIdAndUpdate(req.params.userID, newUser, function (err, updatedUser) {
                console.log("updatedUser1: ", updatedUser);

                updatedUser.bookmarks.push(foundCafe);
                updatedUser.save();
                if (err) {
                    console.log(error);
                    req.flash('error', "That user could not be found.");
                    res.redirect(`/ users / ${req.params.userID}`);
                } else {
                    console.log("updatedUser2: ", updatedUser);
                    // newCafe.images.push(req.files.map(f => ({ url: f.path, filename: f.filename })));
                    req.flash('success', "This cafe has been bookmarked.");
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

    Cafe.findById(req.params.cafeID, function (err, foundCafe) {
        if (err) {
            console.log(error);
            req.flash('error', "There was an error, and that cafe could not be found...");
            res.redirect(`/users/${req.params.userID}`);
        } else {
            console.log("test from deletebookmark route: typeof foundCafe._id.toString(): ", typeof foundCafe._id.toString());
            console.log("test from deletebookmark route: typeof :cafeID.toString(): ", typeof req.params.cafeID.toString());

            //         // middleware has already checked if the user is logged in...
            //         console.log("Found Cafe: ", foundCafe);
            //         console.log("User: ", req.params.userID);
            //         // console.log("req.body: ", req.body);
            //         // res.render('cafes/edit.ejs', { cafe: foundCafe });

            let newUser = {};

            User.findByIdAndUpdate(req.params.userID, newUser, function (err, updatedUser) {

                let indexToDelete;
                console.log("bookmarks.length: ", updatedUser.bookmarks.length)
                for (let i = 0; i < updatedUser.bookmarks.length; i++) {
                    if (updatedUser.bookmarks[i]._id.toString() === req.params.cafeID.toString()) {
                        console.log("the thing to delete: ", updatedUser.bookmarks[i], i);
                        indexToDelete = i;
                        break;
                    }
                };
                // console.log("comparison should be true...: ", updatedUser.bookmarks[0].toString() === req.params.cafeID.toString());
                updatedUser.bookmarks.splice(indexToDelete, 1);
                updatedUser.save();

                if (err) {
                    console.log(error);
                    req.flash('error', "That cafe could not be found.");
                    res.redirect(`/ cafes / ${req.params.cafeID}`);
                } else {
                    console.log("updatedUser2: ", updatedUser);
                    //                 // newCafe.images.push(req.files.map(f => ({ url: f.path, filename: f.filename })));
                    req.flash('success', "That bookmark has been deleted.");
                    // res.redirect(`/ cafes / ${req.params.id}`);
                }
            });
        }
    });
    res.send("here is the bookmark delete route......");
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
