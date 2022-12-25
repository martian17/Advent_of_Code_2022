let fs = require("fs");

let data = fs.readFileSync("data.txt")+"";
//let V = false;
//let data = fs.readFileSync("test.txt")+"";
let V = false;
let BI = process.argv[2] === "BI"?true:false;
console.log(BI?"Bigint":"Normal int");
let parseNumber = function(str){
	if(BI){
		return BigInt(str);
	}else{
		return parseInt(str);
	}
};

let lines = data.trim().split("\n");
let monkeys = [];
let peek = function(arr){
	return arr[arr.length-1];
}

for(let line of lines){
	if(line[0] === "M"){
		//new monkey
		monkeys.push({
			id:line.trim().split(" ")[1].slice(0,-1),
			lines:[]
		});
	}else{
		peek(monkeys).lines.push(line);
	}
}


let monkmap = Object.create(null);
let lcd = BI?1n:1;

for(let monkey of monkeys){
	let {lines} = monkey;
	monkey.items = lines[0].split(":")[1].split(",").map(v=>parseNumber(v.trim()));
	let [left,op,right] = lines[1].split(":")[1].trim().split(/\s+/g).slice(-3);
	monkey.operation = {};
	monkey.operation.op = op;
	[monkey.operation.left,monkey.operation.right]
	 = [left,right].map(v=>v==="old"?v:parseNumber(v));
	monkey.test = parseNumber(lines[2].split(":")[1].trim().split(/\s+/g).pop());
	monkey.true = lines[3].split(":")[1].trim().split(/\s+/g).pop();
	monkey.false = lines[4].split(":")[1].trim().split(/\s+/g).pop();
	monkey.inscnt = 0;

	delete monkey.lines;

	monkmap[monkey.id] = monkey;
	
	lcd *= monkey.test;
};

console.log(`lcd is ${lcd}`);


console.log(monkeys);

let evalOperation = function({op,left,right},old){
	if(left === "old")
		left = old;
	if(right === "old")
		right = old;
	if(op === "*"){
		return left*right;
	}else if(op === "+"){
		return left+right;
	}else{
		console.log(`unknown operator ${op}`);
	}
}

let roundcnt = 0;

let round = function(){
	roundcnt++;
	//mutate monkeys
	for(let monkey of monkeys){
		for(let item of monkey.items){
			monkey.inscnt++;
			item = evalOperation(monkey.operation,item);
			item = item%lcd;
			/*if(BI){
				//item = item-(item%3n);
				//item = item/3n;
				item = item%96577n;
			}else{
				//item = Math.floor(item/3);
				item = item%96577;
			}*/
			if(item % monkey.test === (BI?0n:0)){
				monkmap[monkey.true].items.push(item);
			}else{
				monkmap[monkey.false].items.push(item);
			}
		}
		monkey.items = [];
	}
}

let displayState = function(){
	console.log(`After round ${roundcnt}`);
	for(let monkey of monkeys){
		console.log(`Monkey ${monkey.id}: ${monkey.items.map(v=>v+"").join(", ")}`);
	}
	console.log("");
}

displayState();
for(let i = 0; i < 10000; i++){
	round();
	if(V)displayState();
}



for(let monkey of monkeys){
	console.log(`Monkey ${monkey.id} instected items ${monkey.inscnt} times.`);
}

let [i1,i2] = monkeys.map(m=>m.inscnt).sort((a,b)=>b-a);

console.log(`monkey business is ${i1*i2}`);






