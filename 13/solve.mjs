import * as fs from "fs";
//import {nullobj} from "../ds-js/objutil.mjs";
//import {dijkstra} from "./dijkstra.mjs"; 
//import {mapFromObj} from "../ds-js/maputil.mjs";

//let str = (fs.readFileSync("./test.txt")+"").trim();
let str = (fs.readFileSync("./data.txt")+"").trim();

let compare = function(left,right){
	if(typeof left === "number" && typeof right === "number"){
		if(left < right){
			return 1;
		}else if(right < left){
			return -1;
		}else{
			return 0;
		}
	}
	if(typeof left === "number"){
		left = [left];
	}else if(typeof right === "number"){
		right = [right];
	}
	
	for(let i = 0; i < left.length; i++){
		if(i >= right.length)return -1;
		let res = compare(left[i],right[i]);
		if(res === 0){
			continue;
		}else{
			return res;
		}
	}
	if(left.length < right.length){
		return 1;
	}
	return 0;
}

let solution = 0;

str.split("\n\n").map((p,i)=>{
	let idx = i+1;
	let [left,right] = p.trim().split("\n").map(v=>JSON.parse(v));
	//compare
	let res = compare(left,right);
	if(res === 0){
		console.log("error same inputs",left,right);
	}else if(res === 1){
		solution += idx;
	}
});

console.log(solution);



//part 2
let packets = (`[[2]]
[[6]]
`+str).split("\n").map(v=>v.trim()).filter(v=>v!=="").map(l=>JSON.parse(l)).sort((a,b)=>-compare(a,b)).map(p=>JSON.stringify(p));

console.log(packets);
console.log((packets.indexOf("[[2]]")+1)*(packets.indexOf("[[6]]")+1));



