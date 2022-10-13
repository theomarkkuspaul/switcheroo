'use strict';

const Promise = require('bluebird');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

function ChunkImage (imagePath, filename) {
  this.imagePath = imagePath;
  this.filename = filename;

  this.call = function () {
    const chunkLength = 200;

    const chunksStoreDir = 'chunks';
    const imageChunksDir = [chunksStoreDir, path.basename(this.filename, '.jpg')].join('/');

    if (!fs.existsSync(imageChunksDir))
        fs.mkdirSync(imageChunksDir); // create directory

    var dimensionPromises = [];
    var index = 0;

    for (var i = 0; i <= 400; i += 200) {
      for (var j = 0; j <= 400; j += 200) {
        const image = sharp(imagePath);

        var dimensions = {
          top: i,
          left: j,
          width: chunkLength,
          height: chunkLength
        }

        // create destination of chunk
        var filepath = [imageChunksDir, '/', index, '.jpg'].join('');

        // save image chunk and return promise object
        var saveFilePromise = image
        .extract(dimensions)
        .toFile(filepath, function(err){
          if (err)
            throw err;
        });

        // add promise object to container of promises
        dimensionPromises.push(saveFilePromise);

        // increment index counter
        index += 1;
      }
    }

    return Promise.all(dimensionPromises);
  }
}

module.exports = ChunkImage;