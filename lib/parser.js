
// 無駄データのそぎ落としを行う
module.exports = function(csvRow){
 var zipcode = csvRow[2].toString()
 var pref = csvRow[6]
 var addr1 = csvRow[7]
 var addr2 = csvRow[8]
 if(addr2 == "以下に掲載がない場合"){
   return null
 }
 //（その他）や（４９３〜５９２番地、戸玉）などの表記を除去
 addr2 = addr2.replace(/（.*）/, '')
 var addr = {
   pref : pref,
   addr1 : addr1,
   addr2 : addr2
 }
 return {
   zipcode : zipcode,
   addr : addr
 }
}