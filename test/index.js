var fs = require("fs")
var csv = require("fast-csv")
var Iconv = require('iconv').Iconv
var iconv = new Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE');
var parser = require("../lib/parser")
var download = require("../lib/download")
var fixup = require("../lib/fixup")
// describe("downloadStream", function(){
//   this.timeout(100000)
//   it("add", function(done){
//     download(function(err, data){
//       console.log(data)
//       done()
//     })
//   })
// })
// 
describe("a", function(){
  this.timeout(100000)
  it("b", function(done){
    var read = fs.createReadStream("tmp/KEN_ALL.CSV")
    var buffer = {}
    
    var csvStream = csv().transform(parser)
      .on('data', function(data){
        buffer[data.zipcode] = buffer[data.zipcode] || []
        buffer[data.zipcode].push(data)
      }).on('end', function(){
        var invals = {}
        Object.keys(buffer).filter(function(zipcode){
          var data = buffer[zipcode]
          if(data.length > 1){
            invals[zipcode] = data
          }
        })
        fs.writeFileSync("fixture/inval.json", JSON.stringify(invals, null, 2))
        var zipdata = fixup(buffer)
        done()
      })

    // var zipStream = new ZipTranform()
    // 
    // .on("data", function(data){
    //   if(data.hasBlockNumber){
    //     console.log(data.zipcode, data.area)
    //   }
    // })
    read
      .pipe(iconv)
      .pipe(csvStream)
      //.pipe(zipStream)
  })
})