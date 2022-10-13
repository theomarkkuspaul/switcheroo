const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const Promise = require('bluebird');

const FetchImage = require('./services/fetch-image');
const SaveImage = require('./services/save-image');
const ResizeImage = require('./services/resize-image');
const ChunkImage = require('./services/chunk-image');

const fs = require('fs');

// Configs
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/chunks', express.static(path.join(__dirname, 'chunks')));
app.use(bodyParser.json());

// GET route for the main page
app.get('/switcheroo', (req, res) => res.render('switcheroo'));

// POST route for sending image urls from the client
app.post('/api/image', (req, res) => {
  var imageUrl = req.body.imageUrl;
  var filename = path.basename(imageUrl.split("?")[0]);
  var filepath = ['uploads', filename].join('/');

  // get image from url
  new FetchImage(imageUrl).call()
  .then(function(imageData){
    // save imaeg to disk
    return new SaveImage(imageData, filepath).call();
  })
  .catch(function(err){
    const errMsg = 'An error has occurred fetching image from this address: ' + imageUrl;
    res.status(404).send(errMsg);
  })
  .then(function(msg){
    // resize image to fit 600px x 600px dimensions
    return new ResizeImage(filepath).call();
  })
  .then(function(resizedImagePath){
    // chunk image into 3 columns and 3 rows
    return new ChunkImage(resizedImagePath, filename).call();
  })
  .then(function(){
    // we set a timeout to delay the client
    // fetching the chunked images.
    // allow the filesystem to register the new images
    // before trying to read them
    // THIS IS A HACK
    // (perhaps we can write a service to confirm the images' presence???)
    setTimeout(function(){
      // respond back image file name
      // for further GET requests to retrieve image
      res.json(path.parse(filename).name);
    }, 100);
  });
});

app.get('/image', function(req, res){
  // set image header
  res.setHeader('content-type', 'image/jpg');

  // url node module to assist getting url query
  // parameter data from url
  const url = require('url');

  const query = url.parse(req.url, true).query;

  const id = query.id + '.jpg';
  const filename = path.parse(query.filename).name;

  // generate absolute path of image chunk
  var chunksPath = ['chunks', filename, id].join('/');

  // read image from disk
  var image = fs.readFileSync(chunksPath);

  // send image back
  res.end(image, 'binary');
});

// Run the app
app.listen(3000, () => console.log('App is listening on localhost:3000'));