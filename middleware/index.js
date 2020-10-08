// All middleware used in the routes...
const Cafe = require('../models/cafe');
const Comment = require('../models/comment');

const middlewareObj = {};

// Lots of actions and routes need to check if a user is looged in or not. So, use middleware (like this below...) & use it wherever needed (ie. creating comments)...
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    // If the user is logged in, then go whatever's next...
    return next();
  }
  // If the user is not logged in, then go to login form...
  res.redirect('/login');
}

middlewareObj.checkCafeOwnership = function (req, res, next) {
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

middlewareObj.checkCommentOwnership = function (req, res, next) {
  // Q: first, before editing, is the user logged in?
  if (req.isAuthenticated()) {
    // *** Finds a comment in the DB by its id & passes that comment to the edit page***
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        console.log(err);
        res.send("Sorry. Error. Unable to find that comment.");
      } else {
        // Q: if logged in, did the current user author the comment?
        // if (foundComment.author.id === req.params.id) => doesn't work because req.params.id is an object, not a string... so we need...
        if (foundComment.author.id.equals(req.user._id)) {
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

module.exports = middlewareObj;
