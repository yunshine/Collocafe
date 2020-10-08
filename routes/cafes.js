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
      res.send("Sorry. That cafe could not be found.");
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
router.get("/cafes/new", isLoggedIn, function (req, res) {
  res.render("cafes/new.ejs");
});

// CREATE Route - makes and saves a new cafe to the DB
router.post("/cafes", isLoggedIn, function (req, res) {
  // *** gets SANITIZED data from new cafe form and adds to Cafe DB ***
  let name = req.sanitize(req.body.name);
  let area = req.sanitize(req.body.area);
  var newCafe = {
    name: name,
    area: area,
    author: {
      id: req.user._id,
      username: req.user.username,
    }
  };
  // req.body.cafe.body = req.sanitize(req.body.cafe.body);
  // *** Makes and saves a new cafe to the Cafe DB ***
  Cafe.create(newCafe, function (err, cafe) {
    if (err) {
      console.log(err);
      res.send("Sorry. That cafecould not be created.");
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
      res.send("Sorry. That cafe could not be found.");
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

router.get("/cafes/:id/edit", checkCafeOwnership, function (req, res) {
  // Q: first, before editing, is the user logged in? Use middleware, then...
  // *** ...find a cafe in the DB by its id & pass that cafe to the edit page***
  Cafe.findById(req.params.id, function (err, foundCafe) {
    if (err) {
      console.log(error);
      res.send("Sorry. Error. Unable to find that cafe.");
    } else {
      // middleware has already checked if the user is the cafe's author...
      res.render('cafes/edit.ejs', { cafe: foundCafe });
    }
  });
});

// UPDATE Route - saves the updated info about one cafe into the DB
// Q: first, before editing, is the user logged in? Use middleware...
router.put("/cafes/:id", checkCafeOwnership, function (req, res) {
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
// Q: first, before editing, is the user logged in? Use middleware...
router.delete("/cafes/:id", checkCafeOwnership, function (req, res) {
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

// Lots of actions and routes need to check if a user is looged in or not. So, use middleware (like this below...) & use it wherever needed (ie. creating comments)...
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // If the user is logged in, then go whatever's next...
    return next();
  }
  // If the user is not logged in, then go to login form...
  res.redirect('/login');
}

// more middleware...
function checkCafeOwnership(req, res, next) {
  // Q: first, before editing, is the user logged in?
  if (req.isAuthenticated()) {
    // *** Finds a cafe in the DB by its id & passes that cafe to the edit page***
    Cafe.findById(req.params.id, function (err, foundCafe) {
      if (err) {
        console.log(err);
        res.send("Sorry. Error. Unable to find that cafe.");
      } else {
        // Q: if logged in, did the current user author the cafe?
        // if (foundCafe.author.id === req.params.id) => doesn't work because req.params.id is an object, not a string... so we need...
        if (foundCafe.author.id.equals(req.user._id)) {
          next();
        } else {
          res.send("Sorry. You do not have permission to do that.");
        }
      }
    });
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
