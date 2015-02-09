var Transform = require('stream').Transform
var util = require('util')


var downloader = require("./download")

util.inherits(ZipTransform, Transform)

function ZipTransform(){
  Transform.call(this, { 
    objectMode : true
  })
  return this
}

ZipTransform.prototype._transform = function(chunk, encoding, callback){
  console.log("trans", chunk.zipcode, chunk.area.length, chunk.area)
  this.push(chunk)
  callback()
}
ZipTransform.prototype._flush = function(chunk, encoding, callback){
  console.log("flush", chunk)
}

module.exports = ZipTransform