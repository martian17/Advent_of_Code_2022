let fs = require("fs");

let sacks = (fs.readFileSync("./data.txt")+"").trim().split("\n");

let toTable = function(str){
	let t = {};
	for(let i = 0; i < str.length; i++){
		t[str[i]] = i;
	}
	return t;
}

let priority = toTable("-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

let score = sacks.map(s=>{
	let a = s.slice(0,s.length/2);
	let b = s.slice(s.length/2,s.length);
	let at = toTable(a);
	let dd = null;
	for(let bc of b){
		if(bc in at){
			dd = bc;
			break;
		}
	}
	if(dd === null){
		throw new Error("no duplicates");
	}
	let score = priority[dd];
	return score;
}).reduce((a,b)=>a+b);

console.log(score);

//part 2
let strIntersection = function(){
	let table = toTable(arguments[0]);
	for(let i = 1; i < arguments.length; i++){
		let str = arguments[i];
		let t2 = {};
		for(let c of str){
			if(c in table){
				t2[c] = table[c];
			}
		}
		table = t2;
	}
	return Object.keys(table);
}


let score2 = 0;
for(let i = 0; i < sacks.length; i+=3){
	let group = sacks.slice(i,i+3);
	let intersection = strIntersection(...group)[0];
	score2 += priority[intersection];
}


console.log(score2);


