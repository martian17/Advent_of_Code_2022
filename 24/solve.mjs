import * as fs from "fs";
//import {nullobj} from "../ds-js/objutil.mjs";
//import {dijkstra} from "./dijkstra.mjs"; 
//import {mapFromObj} from "../ds-js/maputil.mjs";
import {newarr} from "../ds-js/arrutil.mjs";


//let str = (fs.readFileSync("./test.txt")+"").trim();
let str = (fs.readFileSync("./data.txt")+"").trim();

let initialGrid = str.split("\n").map(l=>l.trim().split("").map(c=>{
	if(c === "#"){
		return ["#"];
	}else if(c === "."){
		return [];
	}else{
		return [c];
	}
}));

let w = initialGrid[0].length-2;
let h = initialGrid.length-2;
let imin = 1;
let imax = h;
let jmin = 1;
let jmax = w;
let edi = imax+1;
let edj = jmax;
let sti = 0;
let stj = 1;

let placeIfAvailable = function(grid,i,j){
	if(i < 0 || j < 0 || i > imax+1 || j > jmax+1){
		return false;
	}
	if(grid[i][j].length > 0){
		return false;
	}
	grid[i][j].push("E");
}

let step = function(grid0){
	let grid = grid0.map(l=>l.map(v=>{
		if(v[0] === "#")return ["#"];
		return [];
	}));
	for(let i = 0; i < grid0.length; i++){
		for(let j = 0; j < grid0[i].length; j++){
			let bucket = grid0[i][j];
			if(bucket[0] === "#")continue;
			if(bucket[0] === "E")continue;
			for(let c of bucket){
				if(c === "v"){
					grid[i===imax?imin:i+1][j].push("v");
				}else if(c === "^"){
					grid[i===imin?imax:i-1][j].push("^");
				}else if(c === ">"){
					grid[i][j===jmax?jmin:j+1].push(">");
				}else if(c === "<"){
					grid[i][j===jmin?jmax:j-1].push("<");
				}
			}
		}
	}
	for(let i = 0; i < grid0.length; i++){
		for(let j = 0; j < grid0[i].length; j++){
			let bucket = grid0[i][j];
			if(bucket[0] !== "E")continue;
			placeIfAvailable(grid,i,j);
			placeIfAvailable(grid,i-1,j);
			placeIfAvailable(grid,i+1,j);
			placeIfAvailable(grid,i,j-1);
			placeIfAvailable(grid,i,j+1);
		}
	}
	return grid;
};

let displayGrid = function(grid){
	console.log(grid.map(l=>l.map(b=>b.length===0?".":b.length>1?(b.length+""):b[0]).join("")).join("\n"));
};

let wipeE = function(grid){
	for(let row of grid){
		for(let bucket of row){
			if(bucket[0] === "E"){
				bucket.pop();
			}
		}
	}
};

let solvePart1 = function(){
	let grid = initialGrid;
	wipeE(grid);
	grid[sti][stj].push("E");
	
	let cnt = 0;
	while(true){
		displayGrid(grid);
		console.log(cnt);
		cnt++;
		grid = step(grid);
		if(grid[edi][edj][0] === "E"){
			console.log("solution:",cnt);
			displayGrid(grid);
			break;
		}
		if(cnt === 30000)break;
	}
}

solvePart1();

//part 2
let solvePart2 = function(){
	let grid = initialGrid;
	wipeE(grid);
	grid[sti][stj].push("E");
	let cnt = 0;
	while(true){
		cnt++;
		grid = step(grid);
		if(grid[edi][edj][0] === "E"){
			console.log("1: ",cnt);
			break;
		}
	}
	wipeE(grid);
	grid[edi][edj].push("E");
	while(true){
		cnt++;
		grid = step(grid);
		if(grid[sti][stj][0] === "E"){
			console.log("2: ",cnt);
			break;
		}
	}
	wipeE(grid);
	grid[sti][stj].push("E");
	while(true){
		cnt++;
		grid = step(grid);
		if(grid[edi][edj][0] === "E"){
			console.log("3: ",cnt);
			break;
		}
	}
};

solvePart2();



