const fs = require("fs");
let elves = (fs.readFileSync("./data.txt")+"").trim().split("\n\n");
console.log(elves.length);
let ls = elves.map(e=>e.trim().split("\n").map(f=>parseInt(f)).reduce((a,b)=>a+b));
console.log(ls);
let sl = ls.sort((a,b)=>b-a);
console.log(sl);
console.log(sl[0]);
console.log(sl[sl.length-1]);


