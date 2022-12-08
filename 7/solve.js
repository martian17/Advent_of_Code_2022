let fs = require("fs");

let data = fs.readFileSync("data.txt")+"";
//let data = fs.readFileSync("test.txt")+"";


class File{
	type = "file";
	size = 0;
	constructor(name,parent){
		this.name = name;
		this.parent = parent;
	}
};

class Dir extends File{
	type = "dir";
	children = {};
	addChild(sub){
		this.children[sub.name] = sub;
	}
};

let root = new Dir("root",null);
let dir = root;

let lines = data.trim().split("\n");

for(let i = 0; i < lines.length; i++){
	let line = lines[i];
	if(line[0] !== "$"){
		console.log("shouldn't happen");
		continue;
	}
	let cmdname = line.slice(2,4);
	let cmdbody = line.slice(5).trim();
	//console.log(line,`"${cmdname}"`,`"${cmdbody}"`);
	if(cmdname === "cd"){
		if(cmdbody === ".."){
			dir = dir.parent;
		}else if(cmdbody === "/"){
			dir = root;
		}else{
			dir = dir.children[cmdbody]
		}
	}else if(cmdname === "ls"){
		i++;
		for(; i < lines.length; i++){
			let sub = lines[i];
			if(sub[0] === "$"){
				i--;
				break;
			}
			//console.log(sub);
			if(sub.slice(0,4) === "dir "){
				//console.log("dir",sub);
				let dirname = sub.slice(4).trim();
				let subdir = new Dir(dirname,dir);
				dir.addChild(subdir);
			}else{
				//console.log("file",sub);
				//file with size
				let [size,name] = sub.split(" ");
				let file = new File(name.trim(),dir);
				file.size = parseInt(size);
				dir.addChild(file);
				//console.log(dir);
			}
		}
	}else{
		console.log("shouldn't happen");
	}
}


//console.log(data,lines);


let getSize = function(file){
	if(file.type === "file"){
		return file.size;
	}
	//type is dir
	let size = 0;
	for(let cname in file.children){
		let child = file.children[cname];
		size += getSize(child);
	}
	return size;
}

let traverse = function(file,cb){
	cb(file);
	if(file.type !== "dir"){
		return;
	}
	//type dir
	for(let cname in file.children){
		let child = file.children[cname];
		traverse(child,cb);
	}
}


let total = 0;
traverse(root,(file)=>{
	if(file.type !== "dir")return;
	let size = getSize(file);
	if(size < 100000){
		total += size;
	}
});

console.log(root);
console.log(`root size: ${getSize(root)}`);
console.log(`answer: ${total}`);

//console.log(Object.keys(root.children));

//part 2

let dirsizes = [];
traverse(root,(file)=>{
	if(file.type !== "dir")return;
	dirsizes.push([getSize(file),file.name]);
});

dirsizes.sort(([a],[b])=>{
	return a-b;
});


let exceed = getSize(root)-40000000;

console.log(JSON.stringify(dirsizes));
//console.log(exceed);
console.log(`need to clear ${exceed} more`);

for(let [size,name] of dirsizes){
	if(size >= exceed){
		console.log(`${name} is the smallest acceptable dir with size ${size}`);
		break;
	}
}


