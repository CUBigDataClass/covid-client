//console.log('hi');
let obj = require('./countries.json');
let stringData = JSON.stringify(obj);
//stringData = stringData.substring(1, stringData.length-1)
//console.log("og console.log(stringData);

//console.log('start')
let test_obj = Object();
let stringData2 = JSON.parse(stringData);
for (let key in stringData2){
    console.log(stringData2[key]);
}

var country = [];

for (var key in stringData2) {
    country.push(stringData2[key])
}
console.log('arr: ')
console.log(typeof arr)

console.log( stringData2)

let data = {
    country,
    minLat: -6.1751,
    maxLat: 55.7558,
    minLong: 37.6173,
    maxLong: 139.6917

}






export default data