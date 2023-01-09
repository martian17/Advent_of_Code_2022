import * as fs from "fs";
import {MultiMapAlpha} from "../ds-js/multimap.mjs";
const MultiMap = MultiMapAlpha;
import {mapFromEntries} from "../ds-js/maputil.mjs";
import {range} from "../ds-js/arrutil.mjs";
import {vecadd,vecaddi,vecsubi,vecsub,vecLarger,vecLargerEqual} from "../ds-js/vecutil.mjs";

let test = false;

let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"");

let [map,headings] = str.split("\n\n");
console.log(map);
map = map.split("\n").map(m=>m.split(""));
let maxlen = 0;
for(let m of map){
    if(m.length < 3){
        console.log("asdfasdf",m);
    }
    if(m.length > maxlen){
        maxlen = m.length;
    }
}

for(let m of map){
    for(let i = 0; i < maxlen; i++){
        m[i] = m[i] || " ";
    }
}




headings = headings.match(/([0-9]+)|([LR])/g);
console.log(headings);


let directions = [
    [0,1],
    [1,0],
    [0,-1],
    [-1,0]
];

let findNextTile = function(map,r,c,heading){
    let w = map[0].length;
    let h = map.length;
    let [dr,dc] = directions[heading];
    while(true){
        r += dr;
        c += dc;
        if(r === -1){
            r = h-1;
        }else if(r === h){
            r = 0;
        }
        if(c === -1){
            c = w-1;
        }else if(c === w){
            c = 0;
        }
        if(map[r][c] !== " "){
            return [r,c];
        }
    }
};


let heading = 0;
let [r,c] = findNextTile(map,0,0,heading);

console.log(r,c);

for(let ins of headings/*.slice(0,6)*/){
    if(ins === "L"){
        heading = (heading+4-1)%4;
        continue;
    }else if(ins === "R"){
        heading = (heading+1)%4;
        continue;
    }
    let n = parseInt(ins);
    for(let i = 0; i < n; i++){
        let [r1,c1] = findNextTile(map,r,c,heading);
        if(map[r1][c1] === "#")break;
        [r,c] = [r1,c1]; 
    }
}

console.log(r,c,heading);
//map[r][c] = "\x1b[1;31m*\x1b[0m";
map[r][c] = "\x1b[1;31m*";
console.log(map.map(r=>r.join("")).join("\n"));

console.log(1000*(r+1)+4*(c+1)+heading);


