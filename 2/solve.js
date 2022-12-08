let fs = require("fs");
let lines = (fs.readFileSync("./data.txt")+"").trim().split("\n");

let data = lines.map(l=>{
	let [a,b] = l.trim().split(/\s+/);
	return [a,b]
});
console.log(data);

let handTable = {
	X:"A",
	Y:"B",
	Z:"C"
};

let scoreTable = {
	A:1,
	B:2,
	C:3
};

let winTable = {
	A:"C",
	B:"A",
	C:"B"
};



let score = data.map(([o,m])=>{
	//decrypt
	m = handTable[m];
	//calculate the result
	let score = 0;
	if(o === m){
		score += 3;
	}else if(o === winTable[m]){
		score += 6;
	}else{
		score += 0;
	}
	score += scoreTable[m];
	console.log(score);
	return score;
}).reduce((a,b)=>a+b);

console.log(score);


