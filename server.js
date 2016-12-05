const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// stores environment vars
// with default to 3000
const port = process.env.PORT || 3000;

var app = express();

// Adding support for partials for code re-use
hbs.registerPartials(__dirname + '/views/partials');
// to watch the partials as well
// nodemon server.js -e js,hbs
// adding handlebars viewer for templating
app.set('view engine','hbs');

// register middle where with app.use
// next exists to let express know when function is done
// next will let it know to finish and move on to the rest of the code
// creating new functionality for express middleware
app.use((req, res, next) => {
  // timestamp
  var now = new Date().toString();

  // prints timestamp, method of the request, and path
  //console.log(`${now}: ${req.method} ${req.url}`);
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log',log + '\n', (err) => {
    // Must handle err with callback for Node 7 or greater
    if (err)
    {
      console.log('Unable to append to server log.');
    }
  });
  // must have this otherwise we will just hang on success
  next();
});

// this middleware stops everything after it
// help.html will still render since the order of app.use matters
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

// setting up middleware to tell it to use the library in this way
// __dirname provides "this" directory
// sets up directory to use for all pages
// will use maintenance middleware now since they are in correct order
app.use(express.static(__dirname+'/public'));

// adding registration for partials, functions
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

// adding registration for partials, functions
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});
// Setup root route
app.get('/', (req, res) => {
  // response when someone calls this api
  //res.send('<h1>Hello Express!<h1>');

  // Sending JSON data back
  // res.send({
  //   name: 'Veronika',
  //   likes: [
  //     'Hiking',
  //     'Tea',
  //   ]
  // });

  // using handlebars instead for dynamic template pages
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'Welcome to my website',
    // remove the data for each call since we have registered Helper partials function
    //currentYear: new Date().getFullYear(),
  });
});

app.get('/about', (req, res) => {

  //res.send('About page.');

  // using handlebars instead for dynamic template pages
  res.render('about.hbs', {
    pageTitle: 'About page',
    // remove the data for each call since we have registered Helper partials function
    // currentYear: new Date().getFullYear(),
  });
});

app.get('/projects', (req, res) => {
  // using handlebars instead for dynamic template pages
  res.render('projects.hbs', {
    pageTitle: 'Projects page',
  });
});

// send back errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request',
  });
});

// listens for things on port 3000
// express provides auto content type
// app.listen(3000, () => {
//   console.log('Server is up on port 3000.');
// });

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
