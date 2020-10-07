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

// require all routes...
const cafeRoutes = require('./routes/cafes');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');


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

// PASSPORT CONFIGURATIONS =================+++++=======================
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

// passes currentUser to EVERY route, which we need for our navbar links
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
// =======================================================================


//  ***** USE THE ROUTES *****
// =======================================================================

app.use(cafeRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
// =======================================================================


app.listen(3000, function () {
  console.log('The server has started...');
});
