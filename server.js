'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

// Environment variables
require('dotenv').config();

// Database set up
const client = new pg.Client(process.env.DATABASE_URL)
client.connect();
client.on('err', err => console.error(err));

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

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes:

app.get('/', getToken, renderHomepage);
app.get('/search', getToken, renderSearchPage);
app.get('/favorites', getToken, renderFavoritesPage);
app.get('/details', renderDetailsPage);
app.get('/aboutUs', renderAboutUsPage);
app.post('/favorites', saveFavorite);

// Helper Functions:


function renderHomepage(request, response) {
  response.render('pages/index');
}


function renderSearchPage(request, response) {
  let URL = 'https://api.petfinder.com/v2/animals'

  let queryType = request.query.type;
  let querySearch = request.query.city;
  let queryDistance = request.query.travelDistance;
  let queryName = request.query.firstName;

  console.log(queryType)

  // console.log(queryName)
  return superagent.get(URL)
    .set('Authorization', `Bearer ${request.token}`)
    .then(apiResponse => {
      const petInstances = apiResponse.body.animals
        .filter(petObject => petObject.type === queryType)
        .map(cat => new Pet (cat))
      console.log('!!!!!! petInstances: ',petInstances);
      response.render('pages/search', { petResultAPI: petInstances });
      // response.send(petInstances);
    })
    .catch(error => handleError(error));
}

function Pet(query){
  // this.search_query = query;
  this.type = query.type;
  this.name = query.name;
  this.age = query.age;
  this.gender = query.gender;
  this.size = query.size;
  this.city = query.contact.address.city;
  this.state = query.contact.address.state;
  this.description = query.description;
  this.type = query.type;
  this.photo = query.photos.length ? query.photos[0].large : 'http://www.placecage.com/200/200';
  console.log(this.photo);
}

function saveFavorite(request, response){

  let { type, name, age, gender, size, city, state, description, photo } = request.body;

  const SQL = `INSERT INTO favorites (type, name, age, gender, size, city, state, description, photo) VALUES('${type}','${name}', '${age}', '${gender}', '${size}','${city}', '${state}', '${description}', '${photo}') RETURNING id;`;

  // let values = [type, name, age, gender, size, city, state, description, photo];

  console.log(SQL);
  return client.query(SQL)
    .then(sqlResults => { console.log('hello')
    // TODO: change redirect to response.render so that user stays on the search page and sees another pet option. 
      response.redirect(`/favorites/${sqlResults.rows[0].id}`)
    })
    .catch(error => handleError(error, response));

  // response.send(request.body);

}

function renderFavoritesPage(request, response) {
  let URL = 'https://api.petfinder.com/v2/animals'
  // console.log('query type', queryType)
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

// function getSearchSelectors(request, response){

//   console.log('request', request.body)
//   let queryType = request.body.type;
//   let querySearch = request.body.city;
//   let queryDistance = request.body.travelDistance;
//   let queryName = request.body.firstName;

//   console.log(queryType)

//   return queryType;


// }

// Button Event Handler

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
