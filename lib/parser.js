var util = require("util")
module.exports = function(array) {
  if(!util.isArray(array)) return null
  if(array.length == 0) return null
  var zipcode = array[2].toString()
  var pref = array[6]
  var city = array[7]
  var area = array[8]
  
  var prefKana = array[3]
  var cityKana = array[4]
  var areaKana = array[5]
  
  /*if (area == "以下に掲載がない場合") {
    return null
  }
  //（その他）や（４９３〜５９２番地、戸玉）などの表記を除去
  area = area.replace(/（.+）/, '')
  */
  return {
    zipcode: zipcode,
    prefecture: pref,
    city: city,
    area: area,
    prefectureKana : prefKana,
    cityKana : cityKana,
    areaKana : areaKana
  }
}