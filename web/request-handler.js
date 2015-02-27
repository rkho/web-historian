var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var httpHelpers = require('./http-helpers');

var actions = {
  'GET' : function(req, res){
    // Obtain the pathname for a link
    // If the requested URL is the root directory, just set it to index.html
    var link = url.parse(req.url);
    var linkName = link.pathname === '/' ? '/index.html' : link.pathname;
    httpHelpers.serveAssets(res, linkName, function(){
      archive.isUrlInList(linkName.slice(1), function(found){
        if (found){
          httpHelpers.directLink(res, '/loading.html');
        } else {
          httpHelpers.sendResponse(res, '404: Not Found', 404);
        }
      })
    })
  },
  'POST' : function(req, res){
    var link;
    var encoding = {encoding: 'utf-8'};
    req.on('data', function(data){
     link = data.toString().split('=')[1];
    });

    console.log(req.__p);
    archive.isUrlInList(link, function(bool){
      if (bool){
        archive.isURLArchived(link, function(bool){
          if (bool){
            httpHelpers.directLink(res, '/' + link);
          } else {
            httpHelpers.directLink(res, '/loading.html');
          }
        })
      } else {
        archive.addUrlToList(link, function(){
          httpHelpers.directLink(res, '/loading.html');
        })
      }
    })
  }
}


exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action){
    action(req, res);
  } else {
    httpHelpers.sendResponse(res, '404: Not Found', 404);
  }
};
