import * as fs from "fs";
import {MultiMapAlpha} from "../ds-js/multimap.mjs";
const MultiMap = MultiMapAlpha;
import {mapFromEntries} from "../ds-js/maputil.mjs";
import {newarr,arrcpy,arreq} from "../ds-js/arrutil.mjs";
import {vecadd,vecaddi,vecsubi,vecsub,vecLarger,vecLargerEqual} from "../ds-js/vecutil.mjs";

let test = false;

let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"").trim();

let ORE = 0;
let CLAY = 1;
let OBSIDIAN = 2;
let GEODE = 3;

let ROBOTS = 0;
let RSS = 1;
let PREV = 2;
let CHG_FLG = 3;

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
//blueprints -> schemas -> schema

let rssEnoughForSchema = function(rss,schema){
    for(let i = 0; i < rss.length; i++){
        if(rss[i] < schema[i])return false;
    }
    return true;
};

let advanceState = function(schemas,state,states1){
    let [robots,rss,prev] = state;
    let stayFlag = false;
    for(let i = 0; i < schemas.length; i++){
        let schema = schemas[i];
        let isEnough = rssEnoughForSchema(rss,schema);
        if(!isEnough && !stayFlag){
            let producable = true;
            for(let j = 0; j < robots.length; j++){
                if(schema[j] && !robots[j]){
                    producable = false;
                    break;//no production capacity even if you wait
                }
            }
            if(producable)stayFlag = true;
        }
        if(
            isEnough &&
            (state[CHG_FLG] || !rssEnoughForSchema(prev[RSS],schema))
        ){
            let robots1 = arrcpy(robots);
            let rss1 = arrcpy(rss);
            vecaddi(rss1,robots1);
            vecsubi(rss1,schema);
            
            robots1[i]++;
            states1.push([robots1,rss1,state,true]);
            if(arreq(robots,[1,3,1,0]) && arreq(rss,[2,4,0,0])){
                console.log("ss",[robots1,rss1,state,true]);
            }
        }
    }
    if(stayFlag){
        let robots1 = arrcpy(robots);
        let rss1 = arrcpy(rss);
        vecaddi(rss1,robots1);
        states1.push([robots1,rss1,state,false]);
    }
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


let pruneStates = function(schemas,states,t,maxt){
    let remtime = maxt-t;
    if(t === 10){
        for(let state of states){
            let [robots,rss] = state;
            if(arreq(robots,[1,3,0,0]) && arreq(rss,[4,15,0,0])){
                console.log(state);
            }
        }
    }else if(t === 11){
        for(let state of states){
            let [robots,rss] = state;
            if(arreq(robots,[1,3,1,0]) && arreq(rss,[2,4,0,0])){
                console.log(state);
            }
        }
    }else if(t === 12){
        for(let state of states){
            let [robots,rss] = state;
            if(arreq(robots,[1,4,1,0]) && arreq(rss,[1,7,1,0])){
            //if(arreq(states[PREV][ROBOTS],[1,3,1,0]) && arreq(states[PREV][RSS],[2,4,0,0])){
                console.log(state);
            }
        }
    }
    
    let scache = new MultiMap;
    let cutoff = -1;
    let maxstate;
    let states1 = [];
    for(let state of states){
        let [robots,rss] = state;
        if(scache.has(...robots,...rss))continue;
        states1.push(state);
        scache.set(...robots,...rss,1);
        let score = stateAtLeast(schemas,state,remtime);
        if(cutoff < score){
            cutoff = score;//minimum threshold
            maxstate = state;
        }
    }
    states = states1;
    
    states1 = [];
    for(let state of states){
        if(stateAtMost(schemas,state,remtime) < cutoff)continue;
        states1.push(state);
    }
    states = states1;
    
    return states;
}


let solve = function(schemas,robots0,rss0,maxt){
    let states = [[robots0,rss0,null,true]];
    console.log(states);
    for(let t = 1; t <= maxt; t++){
        let states1 = [];
        for(let state of states){
            advanceState(schemas,state,states1);
        }
        console.log(t,"Before Prune",states1.length);
        if(t === 24){
            states = states1;
        }else{
            states = pruneStates(schemas,states1,t,maxt);
        }
        console.log(t,"After  Prune",states.length);
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
    return maxscore;
};

//console.log(solve(blueprints[1],[1,0,0,0],[0,0,0,0],24));


let sum = 0;
for(let i = 0; i < blueprints.length; i++){
    console.log(`#${i+1}`);
    let score = solve(blueprints[i],[1,0,0,0],[0,0,0,0],24);
    console.log(score);
    sum += score*(i+1);
}
console.log("answer:",sum);




