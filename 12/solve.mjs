import * as fs from "fs";
import {nullobj} from "../ds-js/objutil.mjs";
import {dijkstra} from "./dijkstra.mjs"; 
import {mapFromObj} from "../ds-js/maputil.mjs";

//let lines = (fs.readFileSync("./test.txt")+"").split("\n").map(l=>l.trim()).filter(l=>l !== "");
let lines = (fs.readFileSync("./data.txt")+"").split("\n").map(l=>l.trim()).filter(l=>l !== "");

console.log(lines);


let scoremap = nullobj();

for(let i = 0; i < 26; i++){
	scoremap[String.fromCharCode(i+97)] = i;
}
scoremap["E"] = 25;
scoremap["S"] = 0;


let registerIndex = function(grid,node,v1,i,j){
	let v2 = scoremap[grid[i][j]];
	if(v2 <= v1+1){
		node[`${i},${j}`] = 1;
	}
};


let toGraph = function(grid){
	let sp;
	let ep;
	let graph = nullobj();
	for(let i = 0; i < grid.length; i++){
		let row = grid[i];
		for(let j = 0; j < row.length; j++){
			let idx = `${i},${j}`;
			let v1 = scoremap[grid[i][j]];
			let node = {};
			if(j-1 >= 0){
				registerIndex(grid,node,v1,i,j-1);
			}
			if(j+1 < row.length){
				registerIndex(grid,node,v1,i,j+1);
			}
			if(i-1 >= 0){
				registerIndex(grid,node,v1,i-1,j);
			}
			if(i+1 < grid.length){
				registerIndex(grid,node,v1,i+1,j);
			}
			graph[idx] = mapFromObj(node);

			let v = row[j];
			if(v === "S"){
				sp = idx;
			}else if(v === "E"){
				ep = idx;
			}
		}
	}
	//console.log(graph);
	//sp is starting point
	//ep is ending point
	return [mapFromObj(graph),sp,ep];
};


let [graph,sp,ep] = toGraph(lines);

console.log(graph,sp,ep);

let solution = dijkstra(graph,sp,ep);

console.log(solution);

console.log(solution.length-1);


//part 2
let results = [];
for(let i = 0; i < lines.length; i++){
	let row = lines[i];
	for(let j = 0; j < row.length; j++){
		let c = row[j];
		if(c === "a"){
			let result = dijkstra(graph,`${i},${j}`,ep);
			if(result.length === 1)continue;
			console.log(`${i},${j}`,c,/*result,*/result.length-1);
			results.push(result.length-1);
		}
	}
}

console.log(results.sort()[0]);




