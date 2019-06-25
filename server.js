'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Application Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

// Method overide
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));

// TODO: Add Database Setup

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes:

app.get('/', renderHomepage);
app.get('/search', renderSearchPage);
app.get('/favorites', renderFavoritesPage);
app.get('/details', renderDetailsPage);

// Helper Functions:

// curl -d "grant_type=client_credentials&client_id={CLIENT-ID}&client_secret={CLIENT-SECRET}" https://api.petfinder.com/v2/oauth2/token


function renderHomepage(request, response) {
//   const URL = `https://api.petfinder.com/v2/oauth2/token?grant_type=client_credentials&client_id=${process.env.PET_FINDER_API_KEY}&client_secret=${process.env.PET_FINDER_SECRET}`
//   superagent.get(URL)
//     .then(data => console.log(data))
//     .catch(error => handleError(error));
  response.render('pages/index');
}

function renderSearchPage(request, response) {
  response.render('pages/search');
}
  
function renderFavoritesPage(request, response) {
  response.render('pages/favorites');
}

function renderDetailsPage(request, response) {
  response.render('pages/details');
}  

// Error Handling Function
function handleError(error, response) {
  console.error(error);
  response.status(500).send('Sorry, something went wrong')
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
