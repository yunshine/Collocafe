if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
// console.log(process.env.KEY);

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const Cafe = require('./models/cafe');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

// require all routes...
const cafeRoutes = require('./routes/cafes');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');


// Seed the database...
// seedDB();

// where the database lives... on my computer or in a cloud...
// mongoose.connect('mongodb://localhost:27017/collocafe', {
// mongoose.connect('mongodb+srv://yunshine:ilJC8239@cluster0.c4sfn.mongodb.net/collocafe?retryWrites=true&w=majority', {
// this will select the database url based on the environment that runs it...
const url = process.env.DATABASEURL || 'mongodb://localhost:27017/collocafe';
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to database!'))
  .catch(error => console.log(error.message));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(flash());
// app.set('view engine', 'ejs');

// PASSPORT CONFIGURATIONS =============================================
// set up express session...
app.use(require('express-session')({
  secret: 'Rusty is the cutest dog!',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passes currentUser to EVERY route, which we need for our navbar links
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  // flash-connect will now be available on every page...
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
// =======================================================================


//  ***** USE THE ROUTES *****
// =======================================================================

app.use(cafeRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
// =======================================================================

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("The server has started...");
});
