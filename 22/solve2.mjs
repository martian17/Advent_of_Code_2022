import * as fs from "fs";
import {MultiMapAlpha} from "../ds-js/multimap.mjs";
const MultiMap = MultiMapAlpha;
import {mapFromEntries} from "../ds-js/maputil.mjs";
import {range,arrcpyDepth} from "../ds-js/arrutil.mjs";
import {vecadd,vecaddi,vecsubi,vecsub,vecLarger,vecLargerEqual} from "../ds-js/vecutil.mjs";


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

let advanceDirection = function(r,c,d){
    d = (d+4)%4;
    let [dr,dc] = directions[d];
    r += dr;
    c += dc;
    return [r,c];
};

let hasNextTile = function(map,r,c,heading){
    heading = (heading+4)%4;
    let [dr,dc] = directions[heading];
    r += dr;
    c += dc;
    if(r === -1){
        return false;
    }else if(r === h){
        return false;
    }
    if(c === -1){
        return false;
    }else if(c === w){
        return false;
    }
    return map[r][c] !== " ";
};

let hasTile = function(map,r,c){
    if(!map[r]){
        return false;
    }
    let val = map[r][c];
    if(val === "." || val === "#")return true;
    return false;
};

let logToMap = function(map,r,c){
    //let v = map[r][c].slice(7,8);
    //map[r][c] = `\u001b[41;1m${v.match(/[0-9]+/)?1:parseInt(v)+1}\u001b[0m`;
    if(map[r][c] === `\u001b[41;1m+\u001b[0m`){
        map[r][c] = `\u001b[41;1m2\u001b[0m`;
    }else{
        map[r][c] = `\u001b[41;1m+\u001b[0m`;
    }
}

let findEdgePairs = function(map){
    let maxlen = 0;
    for(let m of map){
        if(m.length < 3){
            console.log("asdfasdf",m);
        }
        if(m.length > maxlen){
            maxlen = m.length;
        }
    }
    let fcnt = 0;
    for(let m of map){
        for(let i = 0; i < maxlen; i++){
            m[i] = m[i] || " ";
            if(m[i] === "#" || m[i] === ".")fcnt++;
        }
    }
    
    console.log(fcnt,fcnt/6,Math.sqrt(fcnt/6));
    
    let faceWidth = Math.sqrt(fcnt/6);
    
    
    let logmap = arrcpyDepth(map,2);
    let [tlr,tlc] = findNextTile(map,0,0,0);
    let [r,c] = [tlr,tlc];
    let d = 0;
    let stack = [];
    let pairs = [];
    while(true){
        let edge = [];
        edge.push([r,c]);
        logToMap(logmap,r,c);
        for(let i = 0; i < faceWidth-1; i++){
            [r,c] = findNextTile(map,r,c,d);
            edge.push([r,c]);
            logToMap(logmap,r,c);
        }
        let normal = ((d-1)+4)%4;
        let inner = advanceDirection(r,c,d);
        let outer = advanceDirection(...inner,d-1);
        let adj;
        if(hasTile(map,...outer)){
            [r,c] = outer;
            d -= 1;
            adj = 3;
        }else if(hasTile(map,...inner)){
            [r,c] = inner;
            adj = 2;
        }else{
            d += 1;
            adj = 1;//rc doesn't change
        }
        d = (d+4)%4;
        
        console.log(adj);
        
        if(stack.length < 2){
            stack.push([edge,adj,normal]);
            console.log(stack.map(v=>v[1]));
            continue;
        }
        let t2 = stack.pop();
        let t1 = stack.pop();
        if(t2[1] === 3){
            pairs.push([t2,[edge,adj,normal]]);
            t1[1] += adj
            stack.push(t1);
        }else{
            stack.push(t1);
            stack.push(t2);
            stack.push([edge,adj,normal]);
        }
        console.log(stack.map(v=>v[1]));
        if(r === tlr && c === tlc)break;
    }
    console.log(stack.map(v=>v[1]));
    //console.log(logmap.map(r=>r.join("")).join("\n"));
    if(stack.length !== 2)throw new Error("something went wrong");
    pairs.push(stack);
    return pairs;
};

let getEdgeMapping = function(map){
    let edgemap = new MultiMap;//[r,c,d] => [r2,c2,d2]
    let pairs = findEdgePairs(map);
    console.log(pairs);
    for(let [[edge1,_,normal1],[edge2,__,normal2]] of pairs){
        for(let i = 0; i < edge1.length; i++){
            let e1 = edge1[i];
            let e2 = edge2[edge2.length-i-1];
            edgemap.set(...e1,normal1,[...e2,(normal2+2)%4]);
            edgemap.set(...e2,normal2,[...e1,(normal1+2)%4]);
        }
    }
    return edgemap;
}

let solve2 = function(map,headings,r,c,d){
    let edgemap = getEdgeMapping(map);
    for(let ins of headings){//.slice(0,6)
        if(ins === "L"){
            d = (d+4-1)%4;
            continue;
        }else if(ins === "R"){
            d = (d+1)%4;
            continue;
        }
        let n = parseInt(ins);
        for(let i = 0; i < n; i++){
            let nextState = edgemap.get(r,c,d);
            let r1,c1,d1;
            if(nextState){
                [r1,c1,d1] = nextState;
            }else{
                [r1,c1] = advanceDirection(r,c,d);
                d1 = d;
            }
            if(map[r1][c1] === "#")break;
            [r,c,d] = [r1,c1,d1]; 
        }
    }
    
    console.log(r,c,d);
    //map[r][c] = "\x1b[1;31m*\x1b[0m";
    map[r][c] = "\x1b[1;31m*";
    console.log(map.map(r=>r.join("")).join("\n"));

    console.log(1000*(r+1)+4*(c+1)+d);
}




/*let cubeT = [
    [1,2,3,4],
    [0,4,5,2],
    [0,1,5,3],
    [0,2,5,4],
    [0,3,5,1],
    [1,4,3,2]
];*/

{
     
    let test = false;
    
    let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"");
    
    let [map,headings] = str.split("\n\n");
    console.log(map);
    map = map.split("\n").map(m=>m.split(""));
    
    headings = headings.match(/([0-9]+)|([LR])/g);
    console.log(headings);
    
    
    let d = 0;
    let [r,c] = findNextTile(map,0,0,d);
    
    solve2(map,headings,r,c,d);
    
}