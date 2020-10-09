const express = require('express');
const router = express.Router(); // change all app.-something-  to  router.-something-
const passport = require('passport');

// add in the correct models...
const Cafe = require('../models/cafe');
const User = require('../models/user');

// AUTHENTICATION Routes (nested...)
// =======================================================================
// Root Route
router.get('/', function (req, res) {
  // res.render('landing.ejs');
  // });
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

// NEW User Route - goes to new user registration form (AKA register...)
router.get('/register', function (req, res) {
  res.render('register.ejs');
});

// CREATE User Route - creates/registers a new user AND handles  sign-up logic...
router.post('/register', function (req, res) {
  // from passport local mongoose package...
  const newUser = new User({ username: req.body.username });
  // the password as the second parameter, will be scrambled in the DB...
  // also, Passport does things ike checks to see if the usename is already taken
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register.ejs');
    }
    // again, this below is from passport local mongoose package...
    passport.authenticate('local')(req, res, function () {
      console.log("New User: ", user);
      req.flash('success', "Welcome! Your account has been created.");
      res.redirect('/cafes');
    });
  });
});

// LOGIN Route 1 - shows the login form...
router.get('/login', function (req, res) {
  // handle incoming flash-connect messages in the render...
  res.render('login.ejs');
});

// LOGIN Route 2 - handles login logic...
// middleware needed to run login authentication logic prior to rendering the next view....
// router.post('/login, middlware, callback);
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/cafes',
    failureRedirect: '/login',
  }),
  function (req, res) {
  });
// =======================================================================


// LOG OUT Route and Logic
// // =======================================================================
router.get('/logout', function (req, res) {
  // again, this below is from passport local mongoose package...
  req.logout();
  // from flash-connect...
  req.flash('success', "You have been logged out.");
  res.redirect('/cafes');
});
// =======================================================================

// Lots of actions and routes need to check if a user is looged in or not. So, use middleware (like this below...) & use it wherever needed (ie. creating comments)...
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // If the user is logged in, then go whatever's next...
    return next();
  }
  // If the user is not logged in, then go to login form...
  res.redirect('/login');
}


// Default Route
router.get('*', function (req, res) {
  req.flash('error', "Are you lost?");
  res.redirect('/cafes');
});

module.exports = router;
