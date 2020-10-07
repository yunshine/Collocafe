const express = require('express');
const router = express.Router(); // change all app.-something-  to  router.-something-
// const router = express.Router({ mergeParams: true });  => allows params/ids to be passed through if params aren't being passed correctly due to refactoring...

// add in the correct models...
const Cafe = require('../models/cafe');
const Comment = require('../models/comment');

// COMMENTS Routes (NESTED...)
// =======================================================================
// NEW Comment Route - nested route that goes to new comment form
// "isLoggedIn" is a mddleware function that's at the bottom of this page...
router.get("/cafes/:id/comments/new", isLoggedIn, function (req, res) {
  // finds the cafe that the comment is associated with
  Cafe.findById(req.params.id, function (err, cafe) {
    if (err) {
      console.log(err);
    } else {
      // passes the cafe found above & passes it to new comment form to associate comments to a cafe
      res.render("comments/new.ejs", { cafe: cafe });
    }
  });
});

// CREATE Comment Route - nested route that makes and saves a new nested comment to the DB
// "isLoggedIn" is a mddleware function that's at the bottom of this page...
router.post("/cafes/:id/comments", isLoggedIn, function (req, res) {
  // finds the cafe that the comment is associated with
  Cafe.findById(req.params.id, function (err, cafe) {
    if (err) {
      console.log(err);
    } else {
      // *** gets SANITIZED data from nested new comment form & adds to DB ***
      // the information passed from the nested new comment form...
      // let author = req.sanitize(req.body.author); // now comes from  the user that is logged in...
      let text = req.sanitize(req.body.text);
      // let newComment = { author: author, text: text };
      // build the newComment...
      let newComment = {
        text: text,
        // adds a username & id to the comment
        author: {
          id: req.user._id,
          username: req.user.username,
        },
      };
      Comment.create(newComment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          // saves the comment
          comment.save();
          // associates the nested new comment with the cafe and redirects
          cafe.comments.push(comment);
          cafe.save();
          res.redirect(`/cafes/${cafe._id}`);
          console.log("New Comment: ", comment);
        }
      });
    }
  });
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

module.exports = router;
