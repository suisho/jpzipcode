var yaml = require("js-yaml")
var path = require("path")
var fs = require("fs")
var outputChunk = function(dir, name, dataObj, format) {
  switch (format) {
    case "json":
      fs.writeFile(path.join(dir, name + ".json"), JSON.stringify(dataObj))
      break
    case "yml":
      fs.writeFile(path.join(dir, name + ".yml"), yaml.dump(dataObj))
      break
  }
}

module.exports.chunk = outputChunk