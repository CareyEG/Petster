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
const PORT = process.env.PORT || 3001;

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

app.get('/', getToken, renderHomepage);
app.get('/search', getToken, renderSearchPage);
app.get('/favorites', getToken, renderFavoritesPage);
app.get('/details', renderDetailsPage);
app.get('/aboutUs', renderAboutUsPage);

// Helper Functions:


function renderHomepage(request, response) {
  response.render('pages/index');
}


function renderSearchPage(request, response) {
  let URL = 'https://api.petfinder.com/v2/animals'
  return superagent.get(URL)
    .set('Authorization', `Bearer ${request.token}`)
    .then(apiResponse => {
      const petInstances = apiResponse.body.animals
        .filter(petObject => petObject.type === 'Cat')
        .map(cat => new Pet (cat))
      response.render('pages/search', { petResultAPI: petInstances });
      // response.send(petInstances);
    })
    .catch(error => handleError(error));
}

function Pet(query){
  this.name = query.name;
  // console.log('query name', query.name)
  this.description = query.description;
  // console.log('query description', query.description)
  this.type = query.type;
  this.photo = query.photos.length ? query.photos[0].large : 'placecage.com/200/200';
  // console.log(this.photo);
}


function renderFavoritesPage(request, response) {
  let URL = 'https://api.petfinder.com/v2/animals'
  return superagent.get(URL)
    .set('Authorization', `Bearer ${request.token}`)
    .then(apiResponse => {
      const petInstances = apiResponse.body.animals
        .filter(petObject => petObject.type === 'Cat')
        .map(cat => new Pet (cat))
      response.render('pages/favorites', { petResultAPI: petInstances });
      // response.send(petInstances);
    })
    .catch(error => handleError(error));
}

function renderDetailsPage(request, response) {
  response.render('pages/details');
}

function renderAboutUsPage(request, response) {
  response.render('pages/aboutUs');
}

// Error Handling Function
function handleError(error, response) {
  console.error(error);
  response.status(500).send('Sorry, something went wrong')
}

function getToken(request, response, next) {
  const URL = `https://api.petfinder.com/v2/oauth2/token?grant_type=client_credentials&client_id=${process.env.PET_FINDER_API_KEY}&client_secret=${process.env.PET_FINDER_SECRET}`
  superagent.post(URL)
    .send({'grant_type': 'client_credentials', 'client_id' : `${process.env.PET_FINDER_API_KEY}`, 'client_secret' : `${process.env.PET_FINDER_SECRET}`})
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .then(data => {
      // console.log(data)
      request.token = data.body.access_token
      next();
      return data
    })
    .catch(error => handleError(error));
}

// Button Event Handler

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
