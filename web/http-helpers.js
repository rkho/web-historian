var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

var extensions = {
  '.html' : 'text/html',
  '.css'  : 'text/css',
}

exports.directLink = function(res, link, statusCode){
  statusCode = statusCode || 302;
  res.writeHead(statusCode, {location: link});
  res.end();
}
exports.sendResponse = function(res, data, statusCode){
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(data);
}
exports.serveAssets = function(res, asset, callback) {
  // Display the page if it is within Public:
  var encoding = {encoding: 'utf-8'};

  // Check public folder
  fs.readFile(archive.paths.siteAssets + asset, encoding, function(err, data){
    // If the file is not there, check the archived sites folder
    if (err){
      fs.readFile(archive.paths.archivedSites + asset, encoding, function(err, data){
        if (err){
          // If not there, run the callback if it exists. Otherwise, 404.
          callback ? callback() : exports.sendResponse(res, '404: Not Found', 404);
        } else {
          // If it does exist, serve it.
          exports.sendResponse(res, data);
        }
      })
    } else {
      // If it does exist, serve it.
      exports.sendResponse(res, data);
    }
  })
};



// As you progress, keep thinking about what helper functions you can put here!
