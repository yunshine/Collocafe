const express = require('express');
const router = express.Router(); // change all app.-something-  to  router.-something-

// add in the correct models...
const Cafe = require('../models/cafe');

// add in the middlewareObj...
const middleware = require('../middleware/index.js');

// Cloudinary stuff...
const multer = require('multer');
const { storage } = require('../cloudinary/index.js');
const upload = multer({ storage });

//  Mapbox stuff...
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { json } = require('body-parser');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// CAFES Routes
// =======================================================================
// INDEX Route
router.get('/cafes', async (req, res) => {
    // *** Get all cafes from DB ***
    Cafe.find(function (err, allCafes) {
        // const allCafes = await Cafe.find({});
        if (err) {
            console.log(err);
            req.flash('error', "Cafes could not be found...");
            res.redirect("/cafes");
        } else {
            // the req.user below is needed to check if the user is logged in or not...

            console.log('Cafes From Index Route: ', allCafes[0]);
            res.render('cafes/index.ejs', { cafes: allCafes, stringCafes: JSON.stringify(allCafes) });
        }
    });
});
// router.get('/cafes', function (req, res) {
//   res.render('index.ejs', { cafes: cafes });
// });

// NEW Route - goes to new cafe form
router.get("/cafes/new", middleware.isLoggedIn, (req, res) => {
    res.render("cafes/new.ejs");
});

// CREATE Route - makes and saves a new cafe to the DB
router.post("/cafes", middleware.isLoggedIn, upload.array('image'), async (req, res) => {

    // *** gets SANITIZED data from new cafe form and adds to Cafe DB ***
    let name = req.sanitize(req.body.name);
    let area = req.sanitize(req.body.area);
    // let image = req.sanitize(req.body.image);

    const geoData = await geocoder.forwardGeocode({
        query: name,
        countries: ['jp'],
        limit: 1,
    }).send();

    let newCafe = {
        name: name,
        area: area,
        geometry: geoData.body.features[0].geometry,
        images: req.files.map(f => ({ url: f.path, filename: f.filename })),
        author: {
            id: req.user._id,
            username: req.user.username,
        }
    };
    console.log("New Mapbox Data: ", geoData.body.features[0].geometry.coordinates);

    // req.body.cafe.body = req.sanitize(req.body.cafe.body);
    // *** Makes and saves a new cafe to the Cafe DB ***

    Cafe.create(newCafe, (err, cafe) => {
        if (err) {
            console.log(err);
            req.flash('error', "There was an error, and that cafe could not be created...");
            res.redirect("/cafes");
            // or...   res.render("new.ejs");
        } else {
            console.log("New Cafe: ", cafe);
            req.flash('success', "Your cafe has been added.");
            console.log(newCafe)
            res.redirect("/cafes");
        }
    });

    cafes.push(newCafe);
    res.redirect("/cafes");
});

// CREATE Route using CLOUDINARY...
// ?????

// SHOW Route - shows one cafe
router.get("/cafes/:id", (req, res) => {
    // *** Finds a cafe in the DB by its id & passes that cafe to the show page***
    // Cafe.findById(req.params.id, function (err, foundCafe) {

    // *** Finds a cafe in the DB by its id & passes that cafe to the edit page with associated comments using .populate("comments").exec ***
    Cafe.findById(req.params.id).populate("comments").exec(function (err, foundCafe) {
        if (err) {
            console.log(err);
            req.flash('error', "There was an error, and that cafe could not be found...");
            res.redirect("/cafes");
        } else {
            // renders the show page view with the one cafe from the DB
            res.render("cafes/show.ejs", { cafe: foundCafe });
        }
    });
});

// EDIT Route - goes to edit cafe form
// this version, unlike the one below, does not use middleware....
// router.get("/cafes/:id/edit", function (req, res) {
//   // Q: first, before editing, is the user logged in?
//   if (req.isAuthenticated()) {
//     // *** Finds a cafe in the DB by its id & passes that cafe to the edit page***
//     Cafe.findById(req.params.id, function (err, foundCafe) {
//       if (err) {
//         console.log(error);
//         res.redirect("/cafes");
//       } else {
//         // Q: second, if logged in, did the current user author the cafe?
//         // if (foundCafe.author.id === req.params.id) => doesn't work because req.params.id is an object, not a string... so we need...
//         if (foundCafe.author.id.equals(req.user._id)) {
//           res.render('cafes/edit.ejs', { cafe: foundCafe });
//         } else {
//           res.send("Sorry. You don't have permission to do that.");
//         }
//       }
//     });
//   } else {
//     res.send("Sorry. You need to be logged in to do that.");
//   }
// });

// EDIT Route - goes to edit cafe form
router.get("/cafes/:id/edit", middleware.checkCafeOwnership, (req, res) => {
    // Q: first, before editing, is the user logged in? Use middleware, then...
    // *** ...find a cafe in the DB by its id & pass that cafe to the edit page***
    Cafe.findById(req.params.id, function (err, foundCafe) {
        if (err) {
            console.log(error);
            req.flash('error', "There was an error, and that cafe could not be found...");
            res.redirect("/cafes");
        } else {
            // middleware has already checked if the user is the cafe's author...
            console.log("Found Cafe: ", foundCafe);
            console.log("req.body: ", req.body);
            res.render('cafes/edit.ejs', { cafe: foundCafe });
        }
    });
});

// UPDATE Route - saves the updated info about one cafe into the DB
// Q: first, before editing, is the user logged in? Use middleware...
router.put("/cafes/:id", middleware.checkCafeOwnership, upload.array('image'), (req, res) => {

    let name = req.sanitize(req.body.name);
    let area = req.sanitize(req.body.area);
    let newCafe = {
        name: name,
        area: area,
        // images: [...req.files.map(f => ({ url: f.path, filename: f.filename }))],
    };
    Cafe.findByIdAndUpdate(req.params.id, newCafe, function (err, updatedCafe) {
        let imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        updatedCafe.images.push(...imgs);
        updatedCafe.save();
        if (err) {
            console.log(error);
            req.flash('error', "That cafe could not be found.");
            res.redirect(`/cafes/${req.params.id}`);
        } else {
            // newCafe.images.push(req.files.map(f => ({ url: f.path, filename: f.filename })));
            req.flash('success', "This cafe has been updated.");
            res.redirect(`/cafes/${req.params.id}`);
        }
    });
});


//     Cafe.findById(req.params.id, function (err, foundCafe) {
//         if (err) {
//             console.log(error);
//             req.flash('error', "There was an error, and that cafe could not be found...");
//             res.redirect("/cafes");
//         } else {
//             // middleware has already checked if the user is the cafe's author...
//             let name = req.sanitize(req.body.name);
//             let area = req.sanitize(req.body.area);
//             let foundCafe = { name: name, area: area }
//             let imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
//             foundCafe.images.push(...imgs);
//             // the logic to update the info...
//             Cafe.findByIdAndUpdate(req.params.id, newCafe, function (err, newCafe) {
//                 if (err) {
//                     console.log(error);
//                     req.flash('error', "That cafe could not be found.");
//                     res.redirect(`/cafes/${req.params.id}`);
//                 } else {
//                     // newCafe.images.push(req.files.map(f => ({ url: f.path, filename: f.filename })));
//                     req.flash('success', "This cafe has been updated.");
//                     res.redirect(`/cafes/${req.params.id}`);
//                 }
//             });
//         }
//     });
// });


// // *** gets SANITIZED data from edit cafe form and updates the Cafe DB ***
// let name = req.sanitize(req.body.name);
// let area = req.sanitize(req.body.area);
// // let image = req.sanitize(req.body.image);
// // let images = req.files.map(f => ({ url: f.path, filename: f.filename }));
// let newCafe = { name: name, area: area }

// // the logic to update the info...
// Cafe.findByIdAndUpdate(req.params.id, newCafe, function (err, updatedCafe) {
//     if (err) {
//         console.log(error);
//         req.flash('error', "That cafe could not be found.");
//         res.redirect(`/cafes/${req.params.id}`);
//     } else {
//         // newCafe.images.push(req.files.map(f => ({ url: f.path, filename: f.filename })));
//         req.flash('success', "This cafe has been updated.");
//         res.redirect(`/cafes/${req.params.id}`);
//     }
// });


// DELETE Route
// Q: first, before editing, is the user logged in? Use middleware...
router.delete("/cafes/:id", middleware.checkCafeOwnership, (req, res) => {
    //destroy blog
    Cafe.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(error);
            req.flash('error', "That cafe could not be found.");
            res.redirect(`/cafes/${req.params.id}`);
        } else {
            req.flash('success', "Your cafe has been deleted.");
            res.redirect("/cafes");
        }
    })
    //redirect somewhere
});

// // Lots of actions and routes need to check if a user is looged in or not. So, use middleware (like this below...) & use it wherever needed (ie. creating comments)...
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     // If the user is logged in, then go whatever's next...
//     return next();
//   }
//   // If the user is not logged in, then go to login form...
//   res.redirect('/login');
// }

// // more middleware...
// function checkCafeOwnership(req, res, next) {
//   // Q: first, before editing, is the user logged in?
//   if (req.isAuthenticated()) {
//     // *** Finds a cafe in the DB by its id & passes that cafe to the edit page***
//     Cafe.findById(req.params.id, function (err, foundCafe) {
//       if (err) {
//         console.log(err);
//         res.send("Sorry. Error. Unable to find that cafe.");
//       } else {
//         // Q: if logged in, did the current user author the cafe?
//         // if (foundCafe.author.id === req.params.id) => doesn't work because req.params.id is an object, not a string... so we need...
//         if (foundCafe.author.id.equals(req.user._id)) {
//           next();
//         } else {
//           res.send("Sorry. You do not have permission to do that.");
//         }
//       }
//     });
//   } else {
//     res.redirect('/login');
//   }
// }

module.exports = router;
