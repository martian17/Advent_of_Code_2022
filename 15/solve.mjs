import * as fs from "fs";
//import {nullobj} from "../ds-js/objutil.mjs";
//import {dijkstra} from "./dijkstra.mjs"; 
//import {mapFromObj} from "../ds-js/maputil.mjs";
import {newarr} from "../ds-js/arrutil.mjs";
import {MultiMap} from "../ds-js/multimap.mjs";


//let str = (fs.readFileSync("./test.txt")+"").trim();
let str = (fs.readFileSync("./data.txt")+"").trim();


let calcmdist = function([a,b],[c,d]){
	return Math.abs(c-a)+Math.abs(d-b);
};

let lines = str.split("\n");

let sensors = [];
let maxdist = 0;
let minx = Infinity;
let maxx = -Infinity;
for(let line of lines){
	let [left,rc] = line.split(": closest beacon is at ");
	let lc = left.split("ensor at ")[1];
	[lc,rc] = [lc,rc].map(c=>c.split(",").map(v=>parseInt(v.split("=")[1])));
	console.log(lc,rc);
	sensors.push([lc,rc]);
	let dist = calcmdist(lc,rc);
	if(dist > maxdist){
		maxdist = dist;
	}
	if(lc[0] < minx){
		minx = lc[0];
	}
	if(lc[0] > maxx){
		maxx = lc[0];
	}
}

let cnt = 0;
//let lll = "";
for(let x = minx-maxdist-1; x <= maxx+maxdist+1; x++){
	//let y = 10;
	let y = 2000000;
	let overlap = false;
	let isBeacon = false;
	for(let [sensor,beacon] of sensors){
		if(calcmdist(sensor,beacon) >= calcmdist(sensor,[x,y])){
			overlap = true;
		}
		if(calcmdist([x,y],beacon) === 0){
			isBeacon = true;
		}
	}
	if(overlap && !isBeacon){
		cnt++;
		//lll += "#";
	}else{
		//lll += ".";
	}
}
//console.log(lll);
console.log(cnt);






