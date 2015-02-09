var uniq = require("uniq")
var hasSplitedCity = function(data){
  return hasMultivalue(data, "city")
  /*var cities = data.map(function(l){
    return l.city
  })
  if(uniq(cities).length > 1){
    return true
  }
  return false*/
}
var dataMap = function(data, column){
  return data.map(function(l){
    return l[column]
  })
  
}
var hasMultivalue = function(data, column){
  var cols = dataMap(data, column)
  if(uniq(cols).length > 1){
    return true
  }
  return false
}



module.exports = function(data){
  Object.keys(data).forEach(function(zipcode){
    var addressLines = data[zipcode]
    // only one line
    if(addressLines.length == 1){
      return addressLines
    }
    // cityが違うなら何もせず返す
    //  cityが違い、かつ列を結合しないパターンは見受けられない
    if(hasSplitedCity(addressLines)){
      // console.log(dataMap(addressLines, "city"))
      return addressLines
    }
    
    var areas = addressLines.map(function(l){
      return l.area
    })
    
    // 結合必要対象
    var firstLineArea = areas[0]
    if(firstLineArea.match("（") && !firstLineArea.match("）")){
      var base = addressLines[0]
      base.area = areas.join("")
      return base
    }
    
    return addressLines
  })
}
module.exports.concatArea = function(areas){
  var targets = []
  return targets.join("")
}