var uniq = require("uniq")
module.exports = function(data){
  Object.keys(data).forEach(function(zipcode){
    var addressLines = data[zipcode]
    // only one line
    if(addressLines.length == 1){
      return addressLines
    }
    
    var cities = addressLines.map(function(l){
      return l.city
    })
    if(uniq(cities).length > 1){
      console.log(zipcode, cities, addressLines)
    }
    
    // concat mode
    var firstLineArea = addressLines[0].area
    if(firstLineArea.match("（") && !firstLineArea.match("）")){
      
    }
    /*
    if(addressLines[0].area.match("（")){
      var areas = addressLines.map(function(l){
        return l.area
      })  
    }
    */
  })
}
module.exports.concatArea = function(areas){
  return areas.join("")
}