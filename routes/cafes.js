const express = require('express');
const router = express.Router(); // change all app.-something-  to  router.-something-

// add in the correct models...
const Cafe = require('../models/cafe');

// CAFES Routes
// =======================================================================
// INDEX Route
router.get('/cafes', function (req, res) {
  // *** Get all cafes from DB ***
  Cafe.find(function (err, allCafes) {
    if (err) {
      console.log(err);
    } else {
      // the req.user below is needed to check if the user is logged in or not...
      res.render('cafes/index.ejs', { cafes: allCafes });
    }
  });
});
// router.get('/cafes', function (req, res) {
//   res.render('index.ejs', { cafes: cafes });
// });

// NEW Route - goes to new cafe form
router.get("/cafes/new", function (req, res) {
  res.render("cafes/new.ejs");
});

// CREATE Route - makes and saves a new cafe to the DB
router.post("/cafes", function (req, res) {
  // *** gets SANITIZED data from new cafe form and adds to Cafe DB ***
  let name = req.sanitize(req.body.name);
  let area = req.sanitize(req.body.area);
  var newCafe = { name: name, area: area };
  // req.body.cafe.body = req.sanitize(req.body.cafe.body);
  // *** Makes and saves a new cafe to the Cafe DB ***
  Cafe.create(newCafe, function (err, cafe) {
    if (err) {
      console.log(error);
      // or...   res.render("new.ejs");
    } else {
      console.log("New Cafe: ", cafe);
      res.redirect("/cafes");
    }
  });
  // cafes.push(newCafe);
  // res.redirect("/cafes");
});

// SHOW Route - shows one cafe
router.get("/cafes/:id", function (req, res) {
  // *** Finds a cafe in the DB by its id & passes that cafe to the show page***
  // Cafe.findById(req.params.id, function (err, foundCafe) {

  // *** Finds a cafe in the DB by its id & passes that cafe to the edit page with associated comments using .populate("comments").exec ***
  Cafe.findById(req.params.id).populate("comments").exec(function (err, foundCafe) {
    if (err) {
      console.log(err);
    } else {
      // renders the show page view with the one cafe from the DB
      res.render("cafes/show.ejs", { cafe: foundCafe });
    }
  });
})

// EDIT Route - goes to edit cafe form
router.get("/cafes/:id/edit", function (req, res) {
  // *** Finds a cafe in the DB by its id & passes that cafe to the edit page***
  Cafe.findById(req.params.id, function (err, foundCafe) {
    if (err) {
      console.log(error);
      res.redirect("/cafes");
    } else {
      res.render('cafes/edit.ejs', { cafe: foundCafe });
    }
  });
})

// UPDATE Route - saves the updated info about one cafe into the DB
router.put("/cafes/:id", function (req, res) {
  // *** gets SANITIZED data from edit cafe form and updates the Cafe DB ***
  let name = req.sanitize(req.body.name);
  let area = req.sanitize(req.body.area);
  let newCafe = { name: name, area: area }
  Cafe.findByIdAndUpdate(req.params.id, newCafe, function (err, updatedCafe) {
    if (err) {
      console.log(error);
      res.redirect("/cafes");
    } else {
      res.redirect(`/cafes/${req.params.id}`);
    }
  });
});

// DELETE Route
router.delete("/cafes/:id", function (req, res) {
  //destroy blog
  Cafe.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(error);
      res.redirect("/cafes");
    } else {
      res.redirect("/cafes");
    }
  })
  //redirect somewhere
});

module.exports = router;
