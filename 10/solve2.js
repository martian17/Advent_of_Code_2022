let fs = require("fs");

let data = fs.readFileSync("data.txt")+"";
let V = false;
//let data = fs.readFileSync("test.txt")+"";
//let V = true;

let lines = data.trim().split("\n");


let newarr = function(n){
	let arr = [];
	for(let i = 0; i < n; i++){
		arr.push(0);
	}
	return arr;
}
let grid = newarr(6).map(_=>newarr(40).map(_=>"."));

let showGrid = function(){
	console.log(grid.map(g=>g.join("")).join("\n"));
}
showGrid();


let score = 0;
let judge = function(ccnt,x){
	let xx = ccnt%40;
	let yy = Math.floor(ccnt/40);
	if(x-1 === xx || x === xx || x+1 === xx)grid[yy][xx] = "#";
	if(V)console.log(ccnt,x,ccnt*x,score);
	if(V)showGrid();
};


let ccnt = 0;
let x = 1;
for(let line of lines){
	line = line.trim();
	if(V)console.log(line);
	if(line === "noop"){
		judge(ccnt,x);
		ccnt++;
	}else{
		let n = parseInt(line.split(" ")[1]);
		//console.log(n);
		judge(ccnt,x);
		ccnt++;
		judge(ccnt,x);
		ccnt++;
		//judge(ccnt,x);
		x += n;
	}
}

//console.log(ccnt*x);
//console.log(ccnt,x);
console.log(score);
showGrid();


