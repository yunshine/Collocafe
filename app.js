var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))
// app.set('view engine', 'ejs');

//  ***** ROUTES *****
app.get('/', function (req, res) {
  res.send('This is the root route...');
});

app.get('*', function (req, res) {
  res.send('Are you lost?');
});

app.listen(3000, function () {
  console.log('The server has started...');
});
