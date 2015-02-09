var fs = require('fs.extra')
var path =require('path')
var csv = require('fast-csv')
var Iconv = require('iconv').Iconv
var yaml = require("js-yaml")
var request = require("request")
var unzip = require("unzip")
var extend = require("extend")
var iconv = new Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE');
 
 
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
 
// 無駄データのそぎ落としを行う
var extractAddressData = function(csvRow){
  var zipcode = csvRow[2].toString()
  var pref = csvRow[6]
  var addr1 = csvRow[7]
  var addr2 = csvRow[8]
  if(addr2 == "以下に掲載がない場合"){
    return null
  }
  //（その他）や（４９３〜５９２番地、戸玉）などの表記を除去
  addr2 = addr2.replace(/（.*）/, '')
  var addr = {
    pref : pref,
    addr1 : addr1,
    addr2 : addr2
  }
  return {
    zipcode : zipcode,
    addr : addr
  }
}
 
var extractMap = function(stream, cb){
  var dataSet = {}
  var csvStream = csv()
  .on("data", function(data){
    if(data.length == 0){
      return
    }
    var address = extractAddressData(data)
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
 
var outputChunk = function(dir, name, dataObj, format){
  switch(format){
    case "json":
      fs.writeFile(path.join(dir, name + ".json"), JSON.stringify(dataObj))
      break
    case "yml":
      fs.writeFile(path.join(dir, name + ".yml"), yaml.dump(dataObj))
      break
  }
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
        outputChunk(opts.outputDir, idx, zips, opts.format)
      })
    })
  }, opts.japanPostUrl, opts.csvFile, opts.tmpDir)
}
