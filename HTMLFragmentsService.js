var express = require("express"), exphbs  = require('express-handlebars'), logger = require('express-logger'), bodyParser = require("body-parser");

var app = express(), hbs;

/* Reading project folders */
var path = require("path");

var port = 3000;

// TODO Implements useful log management
app.use(logger({path: "logs/logs.txt"}));
// Body parser fot post/get requests.
app.use(bodyParser.urlencoded({ extended: false }));
hbs =  exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// TODO Accept request only from
app.post('/', function (req, res) {
  console.log('Request received');
  // TODO Write logic here for Routing and remove this hardcoded part.
  hbs.partialsDir = ['views/partials/footer/'];
  //var template = req.body.template;
  // TODO Provides the capability to ask for views.
  var template = "single-component";
  console.log(req.body.data);
  var data = JSON.parse(req.body.data);
  // TODO add checks for data consistency.
  res.render(template, data);
});

app.listen(port);

console.log("Minerva Bundle Service is running on port:" + port );