var ZipTranform = require("./lib/stream")
var fs = require("fs")
var csv = require("fast-csv")
var Iconv = require('iconv').Iconv
var iconv = new Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE');
var parser = require("./lib/parser")
describe("a", function(){
  this.timeout(100000)
  it("b", function(done){
    var zipStream = new ZipTranform()
    var read = fs.createReadStream("tmp2/KEN_ALL.CSV")
    var csvStream = csv().transform(parser)
    .on("data", function(data){
    })
    read
      .pipe(iconv)
      .pipe(csvStream)
      //.pipe(zipStream)
      .on("end", function(){
        done()
      })
  })
})