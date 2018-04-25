const express = require('express');
const ejs = require('ejs');
const app = express();

app.set('view engine', 'ejs');

app.get('/switcheroo', (req, res) => res.render('switcheroo'));

app.listen(3000, () => console.log('App is listening on localhost:3000'));