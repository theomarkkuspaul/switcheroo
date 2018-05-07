const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const Promise = require('bluebird');

// Configs
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// GET route for the main page
app.get('/switcheroo', (req, res) => res.render('switcheroo'));

// POST route for sending image urls from the client
app.post('/api/image', (req, res) => {
  const FetchImage = require('./services/fetch-image');
  const SaveImage = require('./services/save-image');

  var imageUrl = req.body.imageUrl;
  var filename = path.basename(imageUrl);

  // get image from url
  new FetchImage(imageUrl).call()
  .then(function(imageData){
    var filepath = ['uploads', filename].join('/');
    return new SaveImage(imageData, filepath).call();
  })
  .then(function(msg){
    res.send(msg);
  })


  // chunk image into 3 columns and 3 rows

  // respond back list of image 'parts' or 'segments'
});

// Run the app
app.listen(3000, () => console.log('App is listening on localhost:3000'));