const fs = require("fs");
//let lines = (fs.readFileSync("./testdata.txt")+"").trim().split("\n");
let lines = (fs.readFileSync("./data.txt")+"").trim().split("\n");
let cnt = 0;
let data = lines.map(l=>{
	//doesn't give the right answer
	let [a1,a2,b1,b2] = l.split(/\-|\,/g).map(v=>parseInt(v));
	if(b1<a1){
		[b1,b2,a1,a2] = [a1,a2,b1,b2];
	}
	if(b2<=a2){
		console.log([a1,a2,b1,b2]);
		cnt++;
	}
	return [a1,a2,b1,b2];
});

console.log(data);
console.log(data.slice(-10));
console.log(cnt);
console.log(data.length);



