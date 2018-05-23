'use strict';

const sharp = require('sharp');
const Promise = require('bluebird');
const path = require('path');

function ResizeImage (imagepath) {
  this.imagepath = imagepath;

  this.call = function () {
    var that = this;
    var imageBaseName = path.basename(that.imagepath, '.jpg');

    var resizedImagePath = ['uploads/resized/', imageBaseName, '_resized.jpg'].join('');

    return new Promise(function(resolve, reject){
      var image = sharp(that.imagepath);
      const width = 600;
      const height = 600;

      var savedImage = image
      .resize(width, height)
      .toFile(resizedImagePath)
      .then(function(){
        resolve(resizedImagePath);
      });
    });
  }
}

module.exports = ResizeImage;