var fs = require("fs")
var parser = require("./lib/parser")
var _ = require("lodash")
var output = require("./lib/output")
var download = require("./lib/download")
var crawler = require("./lib/crawler")

var stream = fs.createReadStream("./mock/x-ken-all.csv")
var maps = {}

var read = function(cb){
  crawler(function(url){
    download(function(data){
      cb(null, data)
    }, url)
  })
}

var objectMap = function(obj, func){
  Object.keys(obj).forEach(function(key){
    func(key, obj[key])
  })
}
var chunk = function(maps){
  var chunks = {}
  objectMap(maps, function(key, data){
    var k = key.substr(0,3)
    chunks[k] = chunks[k] || {}
    chunks[k][key] = data
  })
  return chunks
}
var write = function(err, maps){
  var chunked = chunk(maps)
  objectMap(chunked, function(key, data){
    output.chunk("mock/zlc", key, data, "json")
  })
}
read(write)