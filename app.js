var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
const Cafe = require('./models/cafe');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

// Seed the database...
seedDB();

mongoose.connect('mongodb://localhost:27017/collocafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to database!'))
  .catch(error => console.log(error.message));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
// app.set('view engine', 'ejs');

// PASSPORT CONFIGURATIONS ========================================
// set up express session...
app.use(require('express-session')({
  secret: 'Rusty is the cutest dog!',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ==================================================================


// Mongoose/SCHEMA SETUP
// const cafeSchema = new mongoose.Schema({
//   name: String,
//   area: String,
//   // how to set a default value in the schema...
//   // created:  {type: Date, default: Date.now},
// });

// // Creates the model from the schema that we've designated
// const Cafe = mongoose.model('Cafe', cafeSchema);

// Cafe.create({ name: "Cafe Kitsune", area: "Aoyama" }, function (err, cafe) {
//   if (err) {
//     console.log(error);
//   } else {
//     console.log("New Cafe: ");
//     console.log(cafe);
//   }
// });

// let cafes = [
//   {
//     name: "Blue Bottle",
//     area: "Apgujeong"
//   },
//   {
//     name: "Trichromatic Coffee",
//     area: "Nakano-Shimbashi Station"
//   },
// ];


//  ***** ROUTES *****
// ==================================================================
// Root Route
app.get('/', function (req, res) {
  res.render('landing.ejs');
});

// INDEX Route
app.get('/cafes', function (req, res) {
  // *** Get all cafes from DB ***
  Cafe.find(function (err, allCafes) {
    if (err) {
      console.log(err);
    } else {
      res.render('cafes/index.ejs', { cafes: allCafes });
    }
  });
});
// app.get('/cafes', function (req, res) {
//   res.render('index.ejs', { cafes: cafes });
// });

// NEW Route - goes to new cafe form
app.get("/cafes/new", function (req, res) {
  res.render("cafes/new.ejs");
});

// CREATE Route - makes and saves a new cafe to the DB
app.post("/cafes", function (req, res) {
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
app.get("/cafes/:id", function (req, res) {
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
app.get("/cafes/:id/edit", function (req, res) {
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
app.put("/cafes/:id", function (req, res) {
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
app.delete("/cafes/:id", function (req, res) {
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

// COMMENTS Routes (NESTED...)
// ======================================================================
// NEW Route - nested route that goes to new comment form
app.get("/cafes/:id/comments/new", function (req, res) {
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

// CREATE Route - nested route that makes and saves a new nested comment to the DB
app.post("/cafes/:id/comments", function (req, res) {
  // finds the cafe that the comment is associated with
  Cafe.findById(req.params.id, function (err, cafe) {
    if (err) {
      console.log(err);
    } else {
      // *** gets SANITIZED data from nested new comment form & adds to DB ***
      // the information passed from the nested new comment form...
      let author = req.sanitize(req.body.author);
      let text = req.sanitize(req.body.text);
      let newComment = { author: author, text: text };

      Comment.create(newComment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          // associates the nested new comment with the new cafe and redirects
          cafe.comments.push(comment);
          cafe.save();
          res.redirect(`/cafes/${cafe._id}`);
        }
      });
    }
  });
});
// ======================================================================


// /AUTHENTICATION Routes (nested...)
// ======================================================================
// NEW Route - goes to new user form (AKA register...)
app.get('/register', function (req, res) {
  res.render('register.ejs');
});

// CREATE Route - creates a new user (AKA register...) and handles  sign-up logic...
app.post('/register', function (req, res) {
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
      res.redirect('/cafes');
    });
  });
});

// SHOW Route - shows the login form...
app.get('/login', function (req, res) {
  res.render('login.ejs');

});

// ======================================================================

// Default Route
app.get('*', function (req, res) {
  res.send('Are you lost?');
});


app.listen(3000, function () {
  console.log('The server has started...');
});
