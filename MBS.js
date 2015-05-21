var express = require("express"),
    exphbs  = require('express-handlebars'),
    logger = require('express-logger'),
    bodyParser = require("body-parser")
    fs = require('fs');

var app = express(), hbs;

var conf = {
  "app": {
    port: 3100,
    repoFolder: "mnv"
  },
  "generator": {
    "bundles": {
      "publicFolder": "/bundles"
    },
    "templates": {
      "folder": "dist/tpl"
    }
  }
};

var availableViews = fs.readdirSync('views');
// Serve static bundles
app.use('/bundles', express.static(__dirname + '/bundles'));
// TODO Implements useful log management
app.use(logger({path: "logs/logs.txt"}));
// Body parser fot post/get requests.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
hbs =  exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// To evaluate URL
// component/spare/mnv-cmp-footer/0.0.1
// component/allinone/mnv-cmp-footer/0.0.1
// view/
// /bundle/mnv-cmp-footer/0.0.1
// Create a init.min.js with the data an publish on a public folder

// TODO Accept request only from specific IP
// This part expect to receive a data object,
// wrap it on an handlerbasr template and send a response back with the compiled HTML fragments
app.post('/component/:view/:repoName/:version', function (req, res) {
  var repo = req.params.repoName, view = req.params.view, data = JSON.parse(req.body.data);
  // TODO add checks for data consistency.
  console.log('Request received');
  if(availableViews.indexOf(view + '.handlebars') === -1){
    res.status(400).send('View ' + view + ' doesn\'t exist.');
    res.end();
    return false;
  }
  hbs.partialsDir = [ conf.app.repoFolder + '/' + repo + '/' + conf.generator.templates.folder + '/'];
  // TODO Add checks on existing views
  res.render(view, data);
  // hbs.renderView(view, { data: data }, function(){
  //   console.log(arguments);
  //   res.json({
  //     "js": [],
  //     "css": [],
  //     "html": ''
  //   });
  // });
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