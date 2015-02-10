var fs = require('fs.extra')
var path =require('path')
var csv = require('fast-csv')
var Iconv = require('iconv').Iconv
var iconv = new Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE'); 
var request = require("request")
var unzip = require("unzip")
var extend = require("extend")
var parser = require("./lib/parser") 
var output = require("./lib/output")
// params
var defaults = {
  tmpDir : "tmp",
  outputDir : "zipdata",
  japanPostUrl : "http://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip",
  csvFile : "KEN_ALL.CSV",
  format : "yml" // or yml
}
var cleanup = function(tmpdir){
  fs.rmrfSync(tmpdir)
  fs.mkdirpSync(tmpdir)
}
 
var donwloader = function(cb, url, csvFile, tmpdir){
  request(url).on('end', function(){
    var csvPath = path.join(tmpdir , csvFile)
    cb(null, fs.createReadStream(csvPath))
  }).pipe(unzip.Extract({path : tmpdir}))
}
 
 
var extractMap = function(stream, cb){
  var dataSet = {}
  var csvStream = csv()
  .on("data", function(data){
    if(data.length == 0){
      return
    }
    var address = parser(data)
    if(!address){
      return
    }
    var zipcode = address.zipcode
    var indexer = zipcode.substr(0, 3)
    dataSet[indexer] = dataSet[indexer] || {}
    dataSet[indexer][zipcode] = address.addr
  })
  .on("end", function(){
    cb(null, dataSet)
  })
  .on("error", function(e){
    cb(e)
  })
  stream.pipe(iconv).pipe(csvStream)
}
 
module.exports = jpZipcode = function(options){
  var opts = extend(options, defaults)
  cleanup(opts.outputDir)
  cleanup(opts.tmpDir)
 
  donwloader(function(err, stream){
    extractMap(stream, function(err, data){
      if(err){
        console.log(err)
        return
      }
      Object.keys(data).forEach(function(idx){
        var zips = data[idx]
        output.chunk(opts.outputDir, idx, zips, opts.format)
      })
    })
  }, opts.japanPostUrl, opts.csvFile, opts.tmpDir)
}
jpZipcode({
  japanPostUrl : "http://127.0.0.1:8080/all_ken.zip"
})