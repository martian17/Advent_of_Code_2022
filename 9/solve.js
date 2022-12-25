let fs = require("fs");

let data = fs.readFileSync("data.txt")+"";
//let data = fs.readFileSync("test.txt")+"";

let lines = data.trim().split("\n");

let [x,y] = [0,0];
let [xt,yt] = [0,0];
let positions = {"0,0":1};

for(let line of lines){
	let [d,n] = line.trim().split(" ");
	n = parseInt(n);
	for(let i = 0; i < n; i++){
		if(d === "U"){
			y += 1;
		}else if(d === "D"){
			y -= 1;
		}else if(d === "L"){
			x -= 1;
		}else if(d === "R"){
			x += 1;
		}else{
			console.log("invalid line",d,n);
		}

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




