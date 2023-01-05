import * as fs from "fs";
import {MultiMapAlpha} from "../ds-js/multimap.mjs";
const MultiMap = MultiMapAlpha;
import {mapFromEntries} from "../ds-js/maputil.mjs";
import {range} from "../ds-js/arrutil.mjs";
import {vecadd,vecaddi,vecsubi,vecsub,vecLarger,vecLargerEqual} from "../ds-js/vecutil.mjs";

let test = false;

let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"").trim();

let lines = str.split("\n").map(l=>l.split(": "));
let map = new Map;
for(let [name,op] of lines){
    op = op.trim().split(" ");
    if(op.length === 1){
        if(name === "humn"){
            map.set(name,[0,1]);//normal number, human multiple
        }else{
            map.set(name,[parseInt(op[0]),0]);
        }
    }else if(op.length === 3){
        if(name === "root"){
            op[1] = "-";
        }
        map.set(name,[op[0],op[2],op[1]]);
    }else{
        console.log("abomination found: "+op.join(" "));
    }
}


let getVal = function(map,id){
    let v = map.get(id);
    if(v.length === 2){
        return v;
    }
    //fetch further
    let v1 = getVal(map,v[0]);
    let v2 = getVal(map,v[1]);
    let op = v[2];
    
    let val = 0;
    let hum = 0;
    if(op === "+"){
        val = v1[0]+v2[0];
        hum = v1[1]+v2[1];
    }else if(op === "-"){
        val = v1[0]-v2[0];
        hum = v1[1]-v2[1];
    }else if(op === "*"){
        val = v1[0]*v2[0];
        hum = v1[1]*v2[0];
        hum += v1[0]*v2[1];
        let hum2 = v1[1]*v2[1];
        if(hum2 > 0){
            throw new Error("human square detected");
        }
    }else if(op === "/"){
        if(v2[1] === 0){
            val = v1[0]/v2[0];
            hum = v1[1]/v2[0];
        }else if(v1[0] === 0 && v2[0] === 0){
            val = v1[1]/v2[1];
            hum = 0;
        }else{
            throw new Error("human in the denominator",v1,v2);
        }
    }else{
        throw new Error("unknown operator "+op);
    }
    return [val,hum];
};

let res = getVal(map,"root");

console.log(res);
console.log(-res[0]/res[1]);


