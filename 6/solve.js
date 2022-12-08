let fs = require("fs");

let isAllUnique = function(str){
	let obj = {};
	for(let c of str){
		if(c in obj){
			return false;
		}
		obj[c] = c;
	}
	return true;
}

let data = (fs.readFileSync("./data.txt")+"").trim();
//let data = "bvwbjplbgvbhsrlpgdmjqwftvncz";
for(let i = 4; i <= data.length; i++){
	if(isAllUnique(data.slice(i-4,i))){
		console.log(i);
		break;
	}
}


for(let i = 14; i <= data.length; i++){
	if(isAllUnique(data.slice(i-14,i))){
		console.log(i);
		break;
	}
}

