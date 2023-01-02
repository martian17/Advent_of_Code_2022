import * as fs from "fs";
import {MultiMap} from "../ds-js/multimap.mjs";

let test = false;

let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"").trim();

/*
001 1
110 6

010 2
101 5

100 4
011 3
*/

/*
XP,
YP xp ym,XP ym,YM
YM xp yp,XP yp,YP
ZP xp zm,XP zm,ZM
ZM xp zp,XP zp,ZP


*/

let dirmap = new Map;
for(let i = 1; i <= 6; i++){
    let bits = 0;
    for(let j = 0; j < 3; j++){
        if((i>>>j)&1 === 1)bits++;
    }
    let direction = 1;
    let rectified = i;
    if(bits === 2){
        direction = -1;
        rectified = (~rectified)&7;
    }
    let dimcnt;
    for(let j = 0; j < 3; j++){
        if((rectified>>>j)&1 === 1){
            dimcnt = j;
            break;
        }
    }
    dirmap.set(i,[dimcnt,direction]);
}

console.log(dirmap);


//flood fill the surface area with recursion
let area = 0;

let floodFill = function(x,y,z,face){
    if(visited.has(x,y,z,face))return;
    visited.set(x,y,z,face,1);
    area++;
    
    //spread to 4 directions
    let [dimcnt,dir] = dirmap.get(face);
    for(let i = 1; i <= 6; i++){
        if(i === face || (~i)&7 === face)continue;
        let [dimcnt1,dir1] = dirmap.get(i);
        let fcenter = [x,y,z];
        fcenter[dimcnt] += dir;
        fcenter[dimcnt1] -= dir1;
        if(mmap.has(...fcenter)){
            floodFill(...fcenter,i);
            continue;
        }
        fcenter[dimcnt] -= dir;
        if(mmap.has(...fcenter)){
            floodFill(...fcenter,face);
            continue;
        }
        floodFill(x,y,z,(~i)&7);
    }
}


let cubes = str.trim().split("\n").map(l=>l.split(",").map(v=>parseInt(v)));

//console.log(cubes);

let mmap = new MultiMap;

let xmax = -Infinity;
let edge;

for(let [x,y,z] of cubes){
    mmap.set(x,y,z,1);
    if(x > xmax){
        xmax = x;
        edge = [x,y,z];
    }
}

let visited = new MultiMap;

console.log(edge);

floodFill(...edge,1);

console.log(area);

