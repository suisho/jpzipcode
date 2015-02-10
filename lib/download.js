var Iconv = require('iconv').Iconv
var request = require("request")
var unzip = require("unzip")
var iconv = new Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE');
var csv = require('fast-csv')
var uniq = require("uniq")
var parser = require("./parser") 
var fixup = require("./fixup")
var defaultUrl = "http://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip"

var createDonwloadStream = function(url){
  return request(url).pipe(unzip.Parse())
}


module.exports = function(cb, url){
  var buffer = {}
  if(!url){
    url = defaultUrl
  }
  var downloadStream = createDonwloadStream(url)
  var csvStream = csv().transform(parser)
  
  return downloadStream.on('entry', function(entry){
    entry.pipe(iconv).pipe(csvStream).on('data', function(data){
      buffer[data.zipcode] = buffer[data.zipcode] || []
      buffer[data.zipcode].push(data)
    }).on('end', function(){
      var zipdata = fixup(buffer)
      
      cb(null, zipdata)
    }).on('error', function(error){
      cb(error)
    })
  })
}
