import * as fs from "fs";
import {mapcpy} from "../ds-js/maputil.mjs"


let test = false;

let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"").trim();

let lines = str.split("\n").map(line=>{
	let [a,b] = line.split(/\;\ tunnels?\ leads?\ to\ valves?\ /);
	let [c,d] = a.split(" has flow rate=");
	let e = c.split("alve ")[1];
	return [e.trim(),parseInt(d),b.trim().split(",").map(v=>v.trim())];
});

console.log(lines);

let graph = new Map;
let weights = new Map;

for(let [id,weight,ids] of lines){
	weights.set(id,weight);
}

for(let [id,weight,ids] of lines){
	let connections = new Map;
	for(let id2 of ids){
		connections.set(id2,weights.get(id2));
	}
	graph.set(id,connections);
}

let newState = function(graph){
    let states = new Map;
    for(let [id] of graph){
        states.set(id,[]);
    }
    return states;
};

let stateSize = function(state){
    let cnt = 0;
    for(let [id,bucket] of state){
        cnt += bucket.length;
    }
    return cnt;
};

let intersectComparison = function(m1,m2){
    let m1only = [];
    for(let [key] of m1){
        if(!m2.has(key)){
            m1only.push(key);
        }
    }
    if(m1only.length === 0){
        if(m1.size === m2.size){
            return 0;
        }else{
            return -1;
        }
    }else{
        if(m1.size-m1only.length === m2.size){
            return 1;
        }else{
            return -2;
        }
    }
};

let compareStates = function(state1,state2){
    //1=>greater, 0=>equal, -1=>less than -2=>unknown
    let intersectComp = intersectComparison(state1.opened,state2.opened);
    if(intersectComp === -2){
        return -2;
    }else if(intersectComp === -1){
        if(state1.score <= state2.score){
            return -1;
        }else{
            return -2;
        }
    }else if(intersectComp === 1){
        if(state1.score >= state2.score){
            return 1;
        }else{
            return -2;
        }
    }else if(intersectComp === 0){
        if(state1.score < state2.score){
            return -1;
        }else if(state1.score > state2.score){
            return 1;
        }else{
            return 0;
        }
    }
};

let pruneStates = function(states){
    for(let [id,bucket] of states){
        let bucket1 = [];
        for(let state of bucket){
            let novel = true;
            for(let i = 0; i < bucket1.length; i++){
                let state0 = bucket1[i];
                let diff = compareStates(state,state0);
                if(diff === -1 || diff === 0){
                    novel = false;
                    break;
                }else if(diff === 1){//superset
                    bucket1[i] = state;
                    novel = false;
                    break;
                }else{//diff -2, continue
                    continue;
                }
            }
            if(novel){
                bucket1.push(state);
            }
        }
        states.set(id,bucket1);
    }
};

let solve = function(graph,weights){
    let states = newState(graph);
    //diffusion -> garbage collection
    let maxt = 30;
    states.get("AA").push({
        opened: new Map,
        modifier: 0,
        score: 0,
        id: "AA",
        prev: null,
        t: 0
    });
    for(let t = 1; t <= maxt; t++){
        let states0 = states;
        states = newState(graph);
        for(let [id,bucket] of states0){
            let connections = graph.get(id);
            for(let state of bucket){
                //move the state to connections
                for(let [id2,weight2] of connections){
                    states.get(id2).push({
                        opened: state.opened,
                        modifier: state.modifier,
                        score: state.score+state.modifier,
                        id: id2,
                        prev: state,t
                    });
                }
                //increment the state
                let weight = weights.get(id);
                if(!state.opened.has(id) && weight !== 0){
                    let opened = mapcpy(state.opened);
                    opened.set(id,true);
                    states.get(id).push({
                        opened,
                        modifier: state.modifier+weight,
                        score: state.score+state.modifier,
                        id,
                        prev: state,t
                    });
                }
            }
        }
        pruneStates(states);
        console.log(`t: ${t}, size: ${stateSize(states)}`);
    }
    
    //get the resutl
    let maxstate;
    let maxscore = -Infinity;
    for(let [id,bucket] of states){
        for(let state of bucket){
            if(state.score > maxscore){
                maxscore = state.score;
                maxstate = state;
            }
        }
    }
    console.log(maxstate);
    
    let res = [];
    for(let state = maxstate; state !== null; state = state.prev){
        res.push([state.t,state.id,state.modifier,state.score]);
    }
    return res.reverse();
}

console.log(solve(graph,weights));