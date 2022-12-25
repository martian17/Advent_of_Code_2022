let fs = require("fs");

let data = fs.readFileSync("data.txt")+"";
//let data = fs.readFileSync("test.txt")+"";

let lines = data.trim().split("\n");

let newarr = function(n){
	let arr = [];
	for(let i = 0; i < n; i++){
		arr.push(0);
	}
	return arr;
};

let knots = newarr(10).map(v=>[0,0]);
let positions = {"0,0":1};

let getNextPosition = function(x,y,xt,yt){
	let dx = x-xt;
	let dy = y-yt;
	if(-1 <= dx && dx <= 1 &&
	   -1 <= dy && dy <= 1 ){
		//don't move
	}else if(dx === 0){//frin here on move down
		if(dy < 0){
			yt -= 1;
		}else{
			yt += 1;
		}
	}else if(dy === 0){
		if(dx < 0){
			xt -= 1;
		}else{
			xt += 1;
		}
	}else{
		//rectify the location
		xt += dx<0?-1:1;
		yt += dy<0?-1:1;
	}
	return [xt,yt];
};



for(let line of lines){
	let [d,n] = line.trim().split(" ");
	n = parseInt(n);
	for(let i = 0; i < n; i++){
		if(d === "U"){
			knots[0][1] += 1;
		}else if(d === "D"){
			knots[0][1] -= 1;
		}else if(d === "L"){
			knots[0][0] -= 1;
		}else if(d === "R"){
			knots[0][0] += 1;
		}else{
			console.log("invalid line",d,n);
		}

		for(let j = 1; j < knots.length; j++){
			let [x1,y1] = getNextPosition(...knots[j-1],...knots[j]);
			knots[j][0] = x1;
			knots[j][1] = y1;
		}

		let [xt,yt] = knots[knots.length-1];

		let idx = `${xt},${yt}`;
		if(!(idx in positions)){
			positions[idx] = 0;
		}
		positions[idx]++;
	}
}

let cnt = 0;
for(let key in positions){
	cnt++;
}
console.log(cnt);




