var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var app = express();

const mongoose = require('mongoose');
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


// Mongoose/SCHEMA SETUP
const cafeSchema = new mongoose.Schema({
  name: String,
  area: String,
  // how to set a default value in the schema...
  // created:  {type: Date, default: Date.now},
});

const Cafe = mongoose.model('Cafe', cafeSchema);

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
      res.render('index.ejs', { cafes: allCafes });
    }
  });
});
// app.get('/cafes', function (req, res) {
//   res.render('index.ejs', { cafes: cafes });
// });

// NEW Route - goes to new cafe form
app.get("/cafes/new", function (req, res) {
  res.render("new.ejs");
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
  Cafe.findById(req.params.id, function (err, foundCafe) {
    if (err) {
      console.log(err);
    } else {
      // renders the show page view with the one cafe from the DB
      res.render("show.ejs", { cafe: foundCafe });
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
      res.render('edit.ejs', { cafe: foundCafe });
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

// Default Route
app.get('*', function (req, res) {
  res.send('Are you lost?');
});


app.listen(3000, function () {
  console.log('The server has started...');
});
