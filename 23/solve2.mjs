import * as fs from "fs";
//import {nullobj} from "../ds-js/objutil.mjs";
//import {dijkstra} from "./dijkstra.mjs"; 
//import {mapFromObj} from "../ds-js/maputil.mjs";
import {newarr} from "../ds-js/arrutil.mjs";
import {MultiMap} from "../ds-js/multimap.mjs";


//let str = (fs.readFileSync("./test.txt")+"").trim();
let str = (fs.readFileSync("./data.txt")+"").trim();
/*let str = `.....
..##.
..#..
.....
..##.
.....`;*/


let getElfString = function(mm,mini,minj,maxi,maxj){
	let lines = [];
	for(let i = mini; i <= maxi; i++){
		let line = "";
		for(let j = minj; j <= maxj; j++){
			line += mm.has(i,j)?"#":".";
		}
		lines.push(line);
	}
	return lines.join("\n");
};

let displayElves = function(mm,mini,minj,maxi,maxj){
	console.log("===");
	console.log(getElfString(mm,mini,minj,maxi,maxj));
	console.log("===");
};

let getElfBoundString = function(mm){
	let points = [];
	let mini = Infinity;
	let maxi = -Infinity;
	let minj = Infinity;
	let maxj = -Infinity;
	for(let [i,j] of mm){
		if(i < mini)mini = i;
		if(i > maxi)maxi = i;
		if(j < minj)minj = j;
		if(j > maxj)maxj = j;
	}
	return getElfString(mm,mini,minj,maxi,maxj);
}

let displayBound = function(mm){
	console.log("===");
	console.log(getElfBoundString(mm));
	console.log("===");
};



let mm = new MultiMap;

let rows = str.split("\n");
for(let i = 0; i < rows.length; i++){
	let row = rows[i].trim();
	for(let j = 0; j < row.length; j++){
		let c = row[j];
		if(c === "#"){
			mm.set(i,j,true);
		}
	}
}

let adjacents = [
	[-1,-1],
	[-1,0],
	[-1,1],
	[0,-1],
	[0,1],
	[1,-1],
	[1,0],
	[1,1]
];

let directions = [
	[-1,0],
	[1,0],
	[0,-1],
	[0,1]
];

let checklist = [
	[[-1,-1],[-1,0],[-1,1]],
	[[1,-1],[1,0],[1,1]],
	[[-1,-1],[0,-1],[1,-1]],
	[[-1,1],[0,1],[1,1]]
];

let rotateDirection = function(){
	let [a,b,c,d] = directions;
	directions = [b,c,d,a];
	[a,b,c,d] = checklist;
	checklist = [b,c,d,a];
};


//displayElves(mm,0,0,5,4);
displayBound(mm);

let stateStr = getElfBoundString(mm);

let cnt = 0;
while(true){
	cnt++;
	let propositions = new MultiMap;
	for(let [i,j] of mm){
		let adjFlag = false;
		for(let [di,dj] of adjacents){
			if(mm.has(i+di,j+dj)){
				adjFlag = true;
				break;
			}
		}
		//don't move if no adjacent
		if(!adjFlag)continue;
		for(let jj = 0; jj < directions.length; jj++){
			let [di,dj] = directions[jj];
			let checks = checklist[jj];
			let checkFlag = false;
			for(let [ddi,ddj] of checks){
				if(mm.has(i+ddi,j+ddj)){
					checkFlag = true;
					break;
				}
			}
			if(checkFlag)continue;
			//no one else in that direction, propose a move there
			if(propositions.has(i+di,j+dj)){
				propositions.set(i+di,j+dj,false);
			}else{
				//console.log(mm.has(i,j));
				propositions.set(i+di,j+dj,[i,j]);
			}
			break;
		}
	}
	//finally loop through the propositions
	for(let [i,j,origin] of propositions){
		//console.log(origin,i,j);
		if(!origin)continue;
		let [i0,j0] = origin;
		mm.delete(i0,j0);
		mm.set(i,j,true);
	}
	//displayElves(mm,0,0,5,4);
	displayBound(mm);
	rotateDirection();
	let stateStr1 = getElfBoundString(mm);
	if(stateStr1 === stateStr){
		console.log(cnt);
		break;
	}
	stateStr = stateStr1;
}





