const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

const apps = require('./apps-data');
const genres = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];
const sorts = ['rating', 'app'];

app.get('/apps', (req, res) => {
    const { genre, sort } = req.query;
    let results = apps;
    if (genre) {
        const lowerGenre = genre.toLowerCase();
        if (!genres.includes(lowerGenre)) {
            return res.status(400).send(`Genre must be one of ${genres.join(', ')}`);
        }
        results = results.filter(a => a.Genres.toLowerCase().split(';').includes(lowerGenre));
    }
    if (sort) {
        const lowerSort = sort.toLowerCase();
        if(!sorts.includes(lowerSort)){
            return res.status(400).send(`Sort must be one of ${sorts.join(', ')}`);
        }
        const upperSort = sort.charAt(0).toUpperCase() + sort.slice(1);
        results.sort((a, b) => {
            return a[upperSort] > b[upperSort] ? 1 : a[upperSort] < b[upperSort] ? -1 : 0;
        });
    }
    return res.send(results);
});

module.exports = app;
