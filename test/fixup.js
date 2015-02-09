var fixup = require("../lib/fixup")
var assert = require("assert")
describe("fixup", function(){
  it("xxx fixture", function(){
    var data = require("../fixture/eleagal.json")
    fixup(data)
  })
  it("（）までを一つにする", function(){
    var data = [ '槌屋町（柳馬場通三条下る、柳馬場通六角上る、六角通柳馬場西入、六角通柳', '馬場東入）' ]
    var result = fixup.concatArea(data)
    var expect = '槌屋町（柳馬場通三条下る、柳馬場通六角上る、六角通柳馬場西入、六角通柳馬場東入）' 
    assert.equal(result, expect)
  })
})