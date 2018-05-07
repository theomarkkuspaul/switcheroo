'use strict';

const Promise = require('bluebird');
const fs = require('fs');

function SaveImage (imageData, filepath) {
  this.imageData = imageData;
  this.filepath = filepath;

  this.call = function () {
    const that = this;

    return new Promise(function (resolve, reject){
      const filepath = that.filepath;
      const imageData = that.imageData;

      fs.writeFile(filepath, imageData, (err) => {
        if (err) throw reject(err);

        const successMessage = ['File saved:', filepath].join(' ');
        resolve(successMessage);
      });
    });
  }
}

module.exports = SaveImage;