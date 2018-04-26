const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');

// Configs
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));


// GET route for the main page
app.get('/switcheroo', (req, res) => res.render('switcheroo'));

// Run the app
app.listen(3000, () => console.log('App is listening on localhost:3000'));