import * as fs from "fs";
import {MultiMapAlpha} from "../ds-js/multimap.mjs";
const MultiMap = MultiMapAlpha;
import {mapFromEntries} from "../ds-js/maputil.mjs";
import {range} from "../ds-js/arrutil.mjs";
import {vecadd,vecaddi,vecsubi,vecsub,vecLarger,vecLargerEqual} from "../ds-js/vecutil.mjs";

let test = false;

let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"").trim();

let nums = str.split("\n").map(v=>parseInt(v));

console.log(nums);

[5,3,4,2,1,0]


let moveAll_faithful = function(arr){
    //console.log(`${arr.join(", ")}`);
    let size = arr.length;
    let numloc = range(size);
    let locnum = range(size);
    for(let i = 0; i < size; i++){
        let idx = numloc[i];
        let num = arr[idx];
        //console.log(`Round ${i}, moving ${num} at idx ${idx}`);
        //console.log(numloc);
        //console.log(locnum);
        //console.log(arr);
        if(num < 0){
            for(let j = 0; j < -num; j++){
                let nextIdx = (idx-1+size)%size;
                arr[idx] = arr[nextIdx];
                locnum[idx] = locnum[nextIdx];
                numloc[locnum[idx]] = idx;
                idx = nextIdx;
            }
        }else{
            for(let j = 0; j < num; j++){
                let nextIdx = (idx+1+size)%size;
                arr[idx] = arr[nextIdx];
                locnum[idx] = locnum[nextIdx];
                numloc[locnum[idx]] = idx;
                idx = nextIdx;
            }
        }
        arr[idx] = num;
        locnum[idx] = i;
        numloc[i] = idx;
        //console.log(`after round ${i}: ${arr.join(", ")}`);
    }
    return arr;
};



let moveAll = function(arr){
    //console.log(`${arr.join(", ")}`);
    let size = arr.length;
    let numloc = range(size);
    let locnum = range(size);
    for(let i = 0; i < size; i++){
        let idx = numloc[i];
        let num = arr[idx];
        //console.log(`Round ${i}, moving ${num} at idx ${idx}`);
        //console.log(numloc);
        //console.log(locnum);
        //console.log(arr);
        let destination = ((idx+num+(size-1))%(size-1)+(size-1))%(size-1);
        if(destination === 0) destination = size-1;
        if(destination < idx){
            let margin = idx-destination;
            for(let j = 0; j < margin; j++){
                let nextIdx = idx-1;
                arr[idx] = arr[nextIdx];
                locnum[idx] = locnum[nextIdx];
                numloc[locnum[idx]] = idx;
                idx = nextIdx;
            }
        }else{
            let margin = destination-idx;
            for(let j = 0; j < margin; j++){
                let nextIdx = idx+1;
                arr[idx] = arr[nextIdx];
                locnum[idx] = locnum[nextIdx];
                numloc[locnum[idx]] = idx;
                idx = nextIdx;
            }
        }
        arr[idx] = num;
        locnum[idx] = i;
        numloc[i] = idx;
        //console.log(`after round ${i}: ${arr.join(", ")}`);
    }
    return arr;
};




//let res = moveAll(nums);

let res = moveAll_faithful(nums);
let zeroidx = 0;
for(let i = 0; i < res.length; i++){
    if(res[i] === 0){
        zeroidx = i;
    }
}
console.log(res);
console.log(nums[(zeroidx+1000)%nums.length]+nums[(zeroidx+2000)%nums.length]+nums[(zeroidx+3000)%nums.length])

/*
this gives wrong result
res = moveAll(nums);
for(let i = 0; i < res.length; i++){
    if(res[i] === 0){
        zeroidx = i;
    }
}
console.log(res);
console.log(nums[(zeroidx+1000)%nums.length]+nums[(zeroidx+2000)%nums.length]+nums[(zeroidx+3000)%nums.length])*/

//console.log(moveAll_faithful(nums));




