let fs = require("fs");

let data = fs.readFileSync("data.txt")+"";
let V = false;
//let data = fs.readFileSync("test.txt")+"";
//let V = true;

let lines = data.trim().split("\n");

let score = 0;
let judge = function(ccnt,x){
	if((ccnt+20)%40 === 0){
		score += ccnt*x;
		if(V)console.log(">>>",ccnt,x,ccnt*x,score);
	}else{
		if(V)console.log(ccnt,x,ccnt*x,score);
	}
};


let ccnt = 0;
let x = 1;
for(let line of lines){
	line = line.trim();
	if(V)console.log(line);
	if(line === "noop"){
		//judge(ccnt,x);
		ccnt++;
		judge(ccnt,x);
	}else{
		let n = parseInt(line.split(" ")[1]);
		//console.log(n);
		//judge(ccnt,x);
		ccnt++;
		judge(ccnt,x);
		ccnt++;
		judge(ccnt,x);
		x += n;
	}
}

//console.log(ccnt*x);
//console.log(ccnt,x);
console.log(score);

