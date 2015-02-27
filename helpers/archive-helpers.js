var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  // Read the sites.txt file, return it as an array.
  fs.readFile(exports.paths.list, function(err, data){
    var list = data.toString().split('\n');
    if (callback){
      callback(list);
    }
  })
};

exports.isUrlInList = function(link, callback){
  // Read the list of URLs and return true or false on the callback based on whether it's there or not.
  exports.readListOfUrls(function(list){
    callback(_.contains(list, link));
  });
};

exports.addUrlToList = function(link, callback){
  fs.appendFile(exports.paths.list, link +'\n', function(err, data){
    callback();
  })
};

exports.isURLArchived = function(link, callback){
  var fullLink = path.join(exports.paths.archivedSites, link);
  fs.exists(fullLink, function(exists){
    callback(exists);
  })
};

exports.downloadUrls = function(urls){
  _.each(urls, function(url) {
    if(!url){ return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + "/" + url));
  });
  return true;
};