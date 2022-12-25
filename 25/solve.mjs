import * as fs from "fs";
//import {nullobj} from "../ds-js/objutil.mjs";
//import {dijkstra} from "./dijkstra.mjs"; 
//import {mapFromObj} from "../ds-js/maputil.mjs";
import {newarr} from "../ds-js/arrutil.mjs";


//let str = (fs.readFileSync("./test.txt")+"").trim();
let str = (fs.readFileSync("./data.txt")+"").trim();


let numTable = {
	"2":2,
	"1":1,
	"0":0,
	"-":-1,
	"=":-2
};

/*
000 0  000
001 1  001
002 2  002
01= 3  003
01- 4  004
010 5  010
011 6  011
012 7  012
02= 8  013
02- 9  014
020 10 020
021 11 021
022 12 022
1== 13 023
1=- 14 024
1=0 15 030
1=1 16 031
1=2 17 032
1-= 18 033
1-- 19 034
1-0 20 040
1-1 21 041
1-2 22 042
10= 23 043
10- 24 044
100 25 100
101 26 101
102 27 102
11= 28 103
11- 29 104
110 30 110
111 31 111
112 32 112
12= 33 113
12- 34 114
120 35 120
121 36 121
122 37 122
*/


let fromSnafu = function(str){
	let digits = str.split("").reverse();
	let res = 0;
	let pow = 1;
	for(let d of digits){
		res += numTable[d]*pow;
		pow *= 5;
	}
	return res;
}

let toSnafu = function(n){
	//first to base 5
	let digits = n.toString(5).split("").reverse().map(d=>parseInt(d));
	let carry = 0;
	let res = [];
	for(let d of digits){
		d += carry;
		if(d > 2){
			res.push(d-5);
			carry = 1;
		}else{
			res.push(d);
			carry = 0;
		}
	}
	if(carry !== 0)res.push(carry);
	return res.reverse().map(v=>{
		if(v === -2){
			return "=";
		}else if(v === -1){
			return "-";
		}else{
			return v+"";
		}
	}).join("");
};


let lines = str.split("\n").map(s=>fromSnafu(s));

console.log(lines);

let sum = lines.reduce((a,b)=>a+b);

console.log(sum);

console.log(toSnafu(sum));
