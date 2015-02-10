var cheerio = require("cheerio")
var request = require("request")

var zipcloud = "http://zipcloud.ibsnet.co.jp"
// get x-ken-all.csv url
module.exports = crawl = function(cb){
  request(zipcloud, function(err, req, body){
    var $ = cheerio.load(body)
    var $entries = $(".dlEntry")
    $entries.each(function(){
      var title = $(this).find(".dlTitle").text()      
      if(title != "全国一括データ （加工済バージョン）"){
        return
      }
      cb(zipcloud + $(this).find(".dlButton a").attr("href"))
    })
  })
}
