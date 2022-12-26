import * as fs from "fs";
//import {nullobj} from "../ds-js/objutil.mjs";
//import {dijkstra} from "./dijkstra.mjs"; 
//import {mapFromObj} from "../ds-js/maputil.mjs";
import {newarr} from "../ds-js/arrutil.mjs";
import {MultiMap} from "../ds-js/multimap.mjs";


let test = false;

let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"").trim();


let calcmdist = function([a,b],[c,d]){
	return Math.abs(c-a)+Math.abs(d-b);
};

let lines = str.split("\n");

let beacons = new MultiMap();
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
	beacons.set(...rc,lc);
}


//search just outside the occupied shape
let searchPerimeter = function(cx,cy,d){
	/*
    ne
  nw  ne
nw  d=1 se
  sw  se
	sw
	*/
	let goodPoints = [];
	for(let i = 0; i < d; i++){
		//north west
		if(!isIntersecting(cx-d-1+i,cy-i)){
			goodPoints.push([cx-d-1+i,cy-i]);
		}
		//ne
		if(!isIntersecting(cx+i,cy-d-1+i)){
			goodPoints.push([cx+i,cy-d-1+i]);
		}
		//se
		if(!isIntersecting(cx+d+1-i,cy+i)){
			goodPoints.push([cx+d+1-i,cy+i]);
		}
		//sw
		if(!isIntersecting(cx-i,cy+d+1-i)){
			goodPoints.push([cx-i,cy+d+1-i]);
		}
	}
	return goodPoints;
};

let isIntersecting = function(x,y){
	for(let [sensor,beacon] of sensors){
		if(calcmdist(sensor,beacon) >= calcmdist(sensor,[x,y])){
			return true;
		}
	}
	return false;
};


//part 1

let cnt = 0;
//let lll = "";
for(let x = minx-maxdist-1; x <= maxx+maxdist+1; x++){
	let y = test?10:2000000;
	if(!beacons.has(x,y) && isIntersecting(x,y)){
		cnt++;
		//lll += "#";
	}else{
		//lll += ".";
	}
}
//console.log(lll);
console.log(cnt);

//part 2


for(let [sensor,beacon] of sensors){
	let res = searchPerimeter(...sensor,calcmdist(sensor,beacon)).filter(([x,y])=>{
		if(test){
			return x >= 0 && y >= 0 && x <= 20 && y <= 20;
		}else{
			return x >= 0 && y >= 0 && x <= 4000000 && y <= 4000000;
		}
	});
	if(res.length > 0){
		console.log("solution2: ",res,res.map(([x,y])=>x*4000000+y));
	}
}



