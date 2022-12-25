import * as fs from "fs";
//import {nullobj} from "../ds-js/objutil.mjs";
//import {dijkstra} from "./dijkstra.mjs"; 
//import {mapFromObj} from "../ds-js/maputil.mjs";
import {newarr} from "../ds-js/arrutil.mjs";


//let str = (fs.readFileSync("./test.txt")+"").trim();
let str = (fs.readFileSync("./data.txt")+"").trim();

let lines = str.split("\n");

//find max and min
let xmin = Infinity;
let ymin = Infinity;
let xmax = -Infinity;
let ymax = -Infinity;
let scans = [];
for(let line of lines){
	let coords = line.trim().split("->").map(v=>{
		let [x,y] = v.trim().split(",").map(n=>parseInt(n));
		if(x < xmin){
			xmin = x;
		}else if(x > xmax){
			xmax = x;
		}
		if(y < ymin){
			ymin = y;
		}else if(y > ymax){
			ymax = y;
		}
		return [x,y];
	});
	scans.push(coords);
}
console.log([xmin,ymin],[xmax,ymax]);
//create 2d array size with xmax+1, ymax+1
let initGrid = function(w,h,scans){
	let grid = newarr(h).map(_=>newarr(w));
	for(let coords of scans){
		for(let i = 1; i < coords.length; i++){
			let c0 = coords[i-1];
			let c1 = coords[i];
			//console.log(`from ${c0} to ${c1}`);
			if(c0[0] === c1[0]){
				let st = c0[1];
				let ed = c1[1];
				if(st > ed)[st,ed] = [ed,st];
				for(let j = st; j <= ed; j++){
					//console.log(c0[0],j);
					grid[j][c0[0]] = 1;
				}
			}else if(c0[1] === c1[1]){
				let st = c0[0];
				let ed = c1[0];
				if(st > ed)[st,ed] = [ed,st];
				for(let j = st; j <= ed; j++){
					//console.log(j,c0[1]);
					grid[c0[1]][j] = 1;
				}
			}else{
				throw new Error("diagonal line");
			}
		}
	}
	return grid;
};



console.log(scans);

//part 1
{
	let w = xmax+2;
	let h = ymax+2;
	console.log(w,h);
	let grid = initGrid(w,h,scans);
	
	//grid prepared, simulation commenses
	let sx = 500;
	let sy = 0;
	
	let cnt = 0;
	
	outer:
	while(true){
		//add sand
		let x = sx;
		let y = sy;
		while(y+1 < h){
			//console.log(x,y);
			if(grid[y+1][x] === 0){
				y++;
			}else if(grid[y+1][x-1] === 0){
				y++;
				x--;
			}else if(grid[y+1][x+1] === 0){
				y++;
				x++;
			}else{
				grid[y][x] = 2;
				cnt++;
				continue outer;
			}
		}
		//sand dropped below the grid
		break;
	}
	
	console.log(cnt);
}

//part 2
{
	let h = ymax+10;
	let w = xmax+2+h;
	console.log(w,h);
	scans.push([[0,ymax+2],[w,ymax+2]]);
	let grid = initGrid(w,h,scans);
	
	//grid prepared, simulation commenses
	let sx = 500;
	let sy = 0;
	
	let cnt = 0;
	
	outer:
	while(true){
		//add sand
		let x = sx;
		let y = sy;
		if(grid[y][x] !== 0)break;
		while(y+1 < h){
			//console.log(x,y);
			if(grid[y+1][x] === 0){
				y++;
			}else if(grid[y+1][x-1] === 0){
				y++;
				x--;
			}else if(grid[y+1][x+1] === 0){
				y++;
				x++;
			}else{
				grid[y][x] = 2;
				cnt++;
				continue outer;
			}
		}
		//sand dropped below the grid
		break;
	}
	
	console.log(cnt);
}


