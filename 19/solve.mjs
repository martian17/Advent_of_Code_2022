import * as fs from "fs";
import {MultiMap} from "../ds-js/multimap.mjs";
import {mapFromEntries} from "../ds-js/maputil.mjs";
import {newarr,arrcpy} from "../ds-js/arrutil.mjs";
import {vecadd,vecaddi,vecsubi,vecsub,vecLarger,vecLargerEqual} from "../ds-js/vecutil.mjs";

let test = true;

let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"").trim();

//let kinds = "ore clay obsidian geode".split(" ");

let ORE = 0;
let CLAY = 1;
let OBSIDIAN = 2;
let GEODE = 3;

let rssmap = mapFromEntries("ore clay obsidian geode".split(" ").map((v,i)=>[v,i]))

let blueprints = str.split("\n").map(l=>{
    let kinds = l.split(/[\.\:]/).slice(1,-1).map(kind=>{
        let [a,b] = kind.split("robot costs");
        let material = a.split("ach ")[1].trim();
        let res = newarr(4);
        let sources = b.split("and");
        for(let v of sources){
            let [cnt,name] = v.trim().split(" ");
            res[rssmap.get(name)] = parseInt(cnt);
        }
        return res;
    });
    return kinds;
});

//console.log(JSON.stringify(blueprints,0,4));


let stateAtLeast = function(schemas,state,remtime){
    let [robots,rss] = state;
    let schema = schemas[GEODE];
    //run a little greedy simulation
    let rss1 = arrcpy(rss);
    let robots1 = arrcpy(robots);
    for(let t = 0; t < remtime; t++){
        vecaddi(rss1,robots1);
        if(!vecLargerEqual(rss1,schema))continue;
        robots1[GEODE]++;
        vecsubi(rss1,schema);
    }
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


let pruneStates = function(schemas,states,remtime){
    //delete duplicate states
    let scache = new MultiMap;
    let gmin = -1;
    let ss;
    let s1 = [];
    for(let state of states){
        let [robots,rss] = state;
        if(scache.has(...robots,...rss))continue;
        s1.push(state);
        scache.set(...robots,...rss,1);
        let gval = stateAtLeast(schemas,state,remtime);
        if(gmin < gval){
            gmin = gval;//minimum threshold
            ss = state;
        }
    }
    states = s1;
    
    if(remtime === 4){
        displayState(ss);
    }
    
    stateAtMost(schemas,ss,remtime)
    console.log(`gmin: ${gmin}`);
    console.log(`rem: ${remtime}`);
    console.log("least",stateAtLeast(schemas,ss,remtime));
    console.log("most",stateAtMost(schemas,ss,remtime));
    console.log("ss",ss);
    
    s1 = [];
    for(let state of states){
        let gval = stateAtMost(schemas,state,remtime);
        if(gval >= gmin){
            s1.push(state);
        }
    }
    states = s1;
    
    //delete objectively worse states
    /*outer:
    for(let state of states){
        for(let state1 of states){
            if(state1 === state)continue;
            if(vecLarger(state1[0],state[0]) &&
               vecLarger(state1[1],state[1])
            ){
                continue outer;
            }
        }
        s1.push(state);
    }*/
    return states;
};

let displayState = function(state){
    let result = [];
    for(let s = state; s; s = s[2]){
        result.push(s);
    }
    result.reverse();
    console.log("");
    console.log("**************************");
    for(let i = 0; i < result.length; i++){
        let s = result[i];
        console.log(i,s.slice(0,2));
    }
    console.log("**************************");
    console.log("");
};

let calculateOptimalMove = function(schemas,robots){
    console.log(schemas);
    let stateCache = new MultiMap;
    let states = [];
    states.push([robots,newarr(4)]);//robots, resources
    let tmax = 24;
    for(let t = 1; t <= tmax; t++){
        console.log(t,states.length);
        let states1 = [];
        for(let state of states){
            let [robots,rss] = state;
            let rss1 = vecadd(rss,robots);
            //console.log(rss,robots,rss1);
            states1.push([robots,rss1,state]);
            for(let rssid = 0; rssid <= GEODE; rssid++){
                let schema = schemas[rssid];
                if(!vecLargerEqual(rss,schema))continue;
                let robots1 = arrcpy(robots);
                robots1[rssid]++;
                //console.log("robots",robots,robots1);
                states1.push([robots1,vecsub(rss1,schema),state]);
            }
        }
        states = pruneStates(schemas,states1,tmax-t);
        //console.log(`states at ${t}:`,states);
        //if(t === 23){
        //    console.log(states.filter(s=>s[0][OBSIDIAN] > 0));
        //    return;
        //}
    }
    let maxstate;
    let maxscore = -1;
    for(let state of states){
        let [robots,rss] = state;
        if(rss[GEODE] > maxscore){
            maxscore = rss[GEODE];
            maxstate = state;
        }
    }
    console.log("max:",maxscore,maxstate);
    displayState(maxstate);
};

let rmap = newarr(4);
rmap[ORE] = 1;
calculateOptimalMove(blueprints[0],rmap);
