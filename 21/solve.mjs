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
        map.set(name,parseInt(op[0]));
    }else if(op.length === 3){
        map.set(name,[op[0],op[2],op[1]]);
    }else{
        console.log("abomination found: "+op.join(" "));
    }
}


let getVal = function(map,id){
    let v = map.get(id);
    if(typeof v === "number"){
        return v;
    }
    //fetch further
    let v1 = getVal(map,v[0]);
    let v2 = getVal(map,v[1]);
    let op = v[2];
    if(op === "+"){
        return v1+v2;
    }else if(op === "-"){
        return v1-v2;
    }else if(op === "*"){
        return v1*v2;
    }else if(op === "/"){
        return v1/v2;
    }else{
        throw new Error("unknown operator "+op);
    }
};

console.log(getVal(map,"root"))


