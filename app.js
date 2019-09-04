const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));

const appData = require('./playstore.js');

// WORKSPACE BELOWWWW 

app.get('/apps', (req, res) => {
  const { genres = "", sort} = req.query;

// Sort needs to be by rating or app
  if(sort) {
    if(!['Rating', 'App'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be by rating or app');
    } 
  }

// Genre needs to be within requirements otherwise errors
if(genres) {
    if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
      return res
        .status(400)
        .send('Genre must be Action, Puzzle, Strategy, Casual, Arcade, Card.');
    }
} 

let results = appData
.filter(appName => 
  appName
    .Genres
        .toLowerCase()
        .includes(genres.toLowerCase()));

// sorts rating highest to lowest
if(sort) {
    results
        .sort((a, b) => {
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0; }); }  

if(genres) {
    results
        .sort((a, b) => {
        return b-a });
} 

    res.json(results);
});

module.exports = app;