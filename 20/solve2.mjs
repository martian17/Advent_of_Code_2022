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


let moveAll_faithful = function(arr,n){
    //console.log(`${arr.join(", ")}`);
    let size = arr.length;
    let numloc = range(size);
    let locnum = range(size);
    for(let ii = 0; ii < size*n; ii++){
        let i = ii%size;
        let idx = numloc[i];
        let num = arr[idx];
        //console.log(`Round ${i}, moving ${num} at idx ${idx}`);
        //console.log(numloc);
        //console.log(locnum);
        //console.log(arr);
        if(num < 0){
            for(let j = 0; j < (-num)%(size-1); j++){
                let nextIdx = (idx-1+size)%size;
                arr[idx] = arr[nextIdx];
                locnum[idx] = locnum[nextIdx];
                numloc[locnum[idx]] = idx;
                idx = nextIdx;
            }
        }else{
            for(let j = 0; j < num%(size-1); j++){
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



let decrypt = function(arr){
    arr = arr.map(v=>v*811589153);
    moveAll_faithful(arr,10);
    let zeroidx = 0;
    for(let i = 0; i < arr.length; i++){
        if(arr[i] === 0){
            zeroidx = i;
        }
    }
    //console.log(arr[zeroidx],arr[(zeroidx+1000)%arr.length]);
    return arr[(zeroidx+1000)%arr.length]+arr[(zeroidx+2000)%arr.length]+arr[(zeroidx+3000)%arr.length];
};

console.log(decrypt(nums));

