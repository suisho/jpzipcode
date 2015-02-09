var util = require("util")
var extend = require("extend")
module.exports = function(array, withKana, withFlags) {
  if(!util.isArray(array)) return null
  if(array.length == 0) return null
  //var _ = array[0].toString()
  var zipcode = array[2].toString()
  var pref = array[6]
  var city = array[7]
  var area = array[8]
  
  var prefKana = array[3]
  var cityKana = array[4]
  var areaKana = array[5]
  var hasMultiCode = (array[9]) ? true : false
  var hasBlockNumber = (array[10]) ? true : false
  var hasMultiArea = (array[11]) ? true : false
  
  if (area == "以下に掲載がない場合") {
    return null
  }
  //（その他）や（４９３〜５９２番地、戸玉）などの表記を除去
  //area = area.replace(/（.+）/, '')
  
  var data = {
    zipcode: zipcode,
    prefecture: pref,
    city: city,
    area: area
  }
  if(withKana){
    data = extend(data, {
      prefectureKana : prefKana,
      cityKana : cityKana,
      areaKana : areaKana,
    })
  }
  if(withFlags){
    data = extend(data, {
      hasMultiCode : hasMultiCode,
      hasBlockNumber : hasBlockNumber,
      hasMultiArea : hasMultiArea
    })
  }
  return data
}