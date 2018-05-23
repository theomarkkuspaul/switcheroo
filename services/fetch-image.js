'use strict';

const Promise = require('bluebird');
const request = require('request');

function FetchImage (imageUrl) {
  this.imageUrl = imageUrl;

  this.call = function () {
    var that = this;
    return new Promise(function(resolve, reject) {
      var url = that.imageUrl;
      console.log("Requesting image from this url:", url);

      var requestSettings = {
        method: 'GET',
        url: url,
        encoding: null
      };

      request(requestSettings, function(err, resp, body){
        if (err)
          reject(err);
        else
          resolve(body);
      });
    })
  }
}

module.exports = FetchImage;