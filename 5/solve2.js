const fs = require("fs");

let [head,body] = (fs.readFileSync("./data.txt")+"").trim().split("\n\n");
console.log(head);
console.log(1);
console.log(body);

let newarr = function(n){
	let arr = [];
	for(let i = 0; i < n; i++){
		arr.push(0);
	}
	return arr;
}

//parsing the states
let state;
{
	let lines = head.trim().split("\n");
	let labels = lines.pop();
	let n = parseInt(labels.trim().split(/\s+/).pop());
	console.log(n);
	state = newarr(n).map(_=>[]);
	for(let i = 0; i < lines.length; i++){
		for(let j = 0; j < n; j++){
			let c = lines[i][j*4+1];
			if(c === " "){
				continue;
			}else{
				state[j].push(c);
			}
		}
	}
	for(let s of state){
		s.reverse();
	}
	console.log(state);
}

//parsse moves
let moves = body.trim().split("\n").map(str=>{
	return str.match(/[0-9]+/g).map(v=>parseInt(v));
});

for(let move of moves){
	let stack = [];
	for(let i = 0; i < move[0]; i++){
		stack.push(state[move[1]-1].pop());
	}
	for(let i = 0; i < move[0]; i++){
		state[move[2]-1].push(stack.pop());
	}
}

console.log(state);

console.log(state.map(s=>s[s.length-1]).join(""));


