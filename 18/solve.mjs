import * as fs from "fs";
import {MultiMap} from "../ds-js/multimap.mjs";

let test = false;

let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"").trim();

let cubes = str.trim().split("\n").map(l=>l.split(",").map(v=>parseInt(v)));

//console.log(cubes);

let mmap = new MultiMap;

for(let cube of cubes){
    mmap.set(...cube,1);
}

let area = 0;
for(let [x,y,z] of cubes){
    //check the sides
    if(!mmap.has(x-1,y,z))area++;
    if(!mmap.has(x+1,y,z))area++;
    if(!mmap.has(x,y-1,z))area++;
    if(!mmap.has(x,y+1,z))area++;
    if(!mmap.has(x,y,z-1))area++;
    if(!mmap.has(x,y,z+1))area++;
}

console.log(area);

