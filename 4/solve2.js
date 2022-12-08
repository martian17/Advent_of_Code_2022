const fs = require("fs");
//let lines = (fs.readFileSync("./testdata.txt")+"").trim().split("\n");
let lines = (fs.readFileSync("./data.txt")+"").trim().split("\n");
let cnt = 0;
let data = lines.map(l=>{
	let [a1,a2,b1,b2] = l.split(/\-|\,/g).map(v=>parseInt(v));
	if((a1<=b1 && b1<=a2) || (b1<=a1 && a1<=b2)){
		cnt++;
	}
	return [a1,a2,b1,b2];
});

console.log(data);
console.log(data.slice(-10));
console.log(cnt);
console.log(data.length);



