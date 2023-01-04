import * as fs from "fs";
import {MultiMap} from "../ds-js/multimap.mjs";
import {mapFromEntries} from "../ds-js/maputil.mjs";
import {newarr,arrcpy} from "../ds-js/arrutil.mjs";
import {vecadd,vecaddi,vecsubi,vecsub,vecLarger,vecLargerEqual} from "../ds-js/vecutil.mjs";

let ORE = 0;
let CLAY = 1;
let OBSIDIAN = 2;
let GEODE = 3;

let stateAtLeast = function(schemas,state,remtime){
    let [robots,rss] = state;
    let schema = schemas[GEODE];
    //run a little greedy simulation
    let rss1 = arrcpy(rss);
    let robots1 = arrcpy(robots);
    console.log("schema:",schema);
    console.log(robots,rss);
    for(let t = 0; t < remtime; t++){
        console.log(t);
        vecaddi(rss1,robots1);
        console.log("*",robots1,rss1);
        if(!vecLargerEqual(rss1,schema))continue;
        robots1[GEODE]++;
        vecsubi(rss1,schema);
        console.log(">",robots1,rss1);
    }
    console.log(robots1,rss1);
    return rss1[GEODE];
};

let stateAtMost = function(schemas,state,remtime){
    let [robots,rss] = state;
    robots = arrcpy(robots);
    let schema = schemas[GEODE];
    let gcnt = rss[GEODE];
    //gcnt += robots[GEODE];
    //if(t >= 1 && vecLargerEqual(rss,schema))robots[GEODE]++;
    for(let t = 0; t < remtime; t++){
        gcnt += robots[GEODE];
        robots[GEODE]++;
    }
    return gcnt;
};

console.log(stateAtLeast(
    [ [ 4, 0, 0, 0 ], [ 2, 0, 0, 0 ], [ 3, 14, 0, 0 ], [ 2, 0, 7, 0 ] ],
    [[ 2, 7, 4, 1 ],[ 2, 7, 6, 1 ]],
    4
));

console.log(stateAtMost(
    [ [ 4, 0, 0, 0 ], [ 2, 0, 0, 0 ], [ 3, 14, 0, 0 ], [ 2, 0, 7, 0 ] ],
    [[ 2, 7, 4, 1 ],[ 2, 7, 6, 1 ]],
    4
));



