var express = require("express"),
    exphbs  = require('express-handlebars'),
    logger = require('express-logger'),
    bodyParser = require("body-parser")
    fs = require('fs');

var app = express(), hbs;

var conf = {
  "app": {
    port: 3100
  },
  "generator": {
    "bundles": {
      "publicFolder": "/bundles"
    }
  }
};
// Serve static bundles
app.use('/bundles', express.static(__dirname + '/bundles'));
// TODO Implements useful log management
app.use(logger({path: "logs/logs.txt"}));
// Body parser fot post/get requests.
app.use(bodyParser.urlencoded({ extended: false }));
hbs =  exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// TODO Accept request only from specific IP
// This part expect to receive a data object,
// wrap it on an handlerbasr template and send a response back with the compiled HTML fragments
app.post('/html/footer/0.0.1', function (req, res) {
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

// This part expect to receive the data, wrap it in a template
// and create a minified version of this code that is exposed to external requests
app.post('/bundle/footer/0.0.1', function (req, res) {
  console.log('Request received');
  // TODO Write logic here for Routing and remove this hardcoded part.
  hbs.partialsDir = ['views/partials/footer/'];
  //var template = req.body.template;
  // TODO Provides the capability to ask for views.
  var template = "single-component";
  console.log(req.body.data);
  var data = JSON.parse(req.body.data);
  // Replace the data on the project
  // Run Grunt production to create the bundle
  // Move the bundle in the public folder
  // Save the file
  res.render(template, data, function(err, html) {
    var msg = '';
    // Save the file
    fs.writeFile( conf.generator.bundles.publicFolder + "/footer/0.0.1/init.min.js", html, function(err) {
      if(err) {
        msg = err;
      } else {
        msg = 'Give information about implementation to the user here';
      }
      res.send(msg);
    });
  });
});

app.listen(conf.app.port);

console.log("Minerva Bundle Service is running on port:" + conf.app.port );