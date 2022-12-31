import * as fs from "fs";
import {mapcpy} from "../ds-js/maputil.mjs";
import * as sorter from "../ds-js/sorter.mjs";


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

let newStateDb = function(graph){
    let states = new Map;
    for(let [id1] of graph){
		for(let [id2] of graph){
			states.set(id1+id2,[]);
		}
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

let getMaxExpectedScore = function(state,weights,remtime){
	let unopenedWeights = [];
	for(let [id,weight] of weights){
		if(state.opened.has(id))continue;
		unopenedWeights.push(weight);
	}
	let score = state.score;
	let modifier = state.modifier;
	unopenedWeights.sort(sorter.IntAscend);
	for(let i = 0; i < remtime; i++){
		score += modifier;
		if(i%2 === 0){
			let w1 = unopenedWeights.pop() || 0;
			let w2 = unopenedWeights.pop() || 0;
			modifier += w1+w2;
		}
	}
	return score;
};

let getMinExpectedScore = function(state,remtime){
	return state.score+state.modifier*remtime;
}

let pruneStates = function(states,weights,remtime){
	//calculate global cutoff
	let globalCutoff = Infinity;
	let finalScoreWillBeAtLeast = -Infinity;
	let maxState;
    for(let [id,bucket] of states){
		for(let state of bucket){
			let expScore = getMinExpectedScore(state,remtime);
			if(expScore > finalScoreWillBeAtLeast){
				finalScoreWillBeAtLeast = expScore;
				maxState = state;
			}
		}
	}
	//if(!test && finalScoreWillBeAtLeast<3015)finalScoreWillBeAtLeast = 3015;
    for(let [id,bucket] of states){
        let bucket1 = [];
        for(let state of bucket){
			//console.log(getMaxExpectedScore(state,weights,remtime),finalScoreWillBeAtLeast);
			if(getMaxExpectedScore(state,weights,remtime) <= finalScoreWillBeAtLeast && state !== maxState)continue;
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
    let states = newStateDb(graph);
    //diffusion -> garbage collection
    let maxt = 26;
    states.get("AAAA").push({
        opened: new Map,
        modifier: 0,
        score: 0,
        id1: "AA",
		id2: "AA",
        prev: null,
        t: 0
    });
    for(let t = 1; t <= maxt; t++){
        let states0 = states;
        states = newStateDb(graph);
        for(let [metaid,bucket] of states0){
			let id1 = metaid.slice(0,2);
			let id2 = metaid.slice(2);
            let connections1 = graph.get(id1);
            let connections2 = graph.get(id2);
            for(let state of bucket){
                //move the state to connections
                for(let [id11] of connections1){
	                for(let [id22] of connections2){
						states.get(id11+id22).push({
							opened: state.opened,
                        	modifier: state.modifier,
                        	score: state.score+state.modifier,
                        	id1: id11,
                        	id2: id22,
                        	prev: state,
							t
                    	});
					}
					//open p2
					let weight2 = weights.get(id2);
					if(!state.opened.has(id2) && weight2 !== 0){
						let opened = mapcpy(state.opened);
						opened.set(id2,true);
	                    states.get(id11+id2).push({
	                        opened,
	                        modifier: state.modifier+weight2,
	                        score: state.score+state.modifier,
	                        id1: id11,
							id2: id2,
	                        prev: state,
							t
	                    });
					}
                }
				//open p1
				let weight1 = weights.get(id1);
				if(!state.opened.has(id1) && weight1 !== 0){
					let opened = mapcpy(state.opened);
					opened.set(id1,true);
					for(let [id22] of connections2){
						states.get(id1+id22).push({
							opened: opened,
                        	modifier: state.modifier+weight1,
                        	score: state.score+state.modifier,
                        	id1: id1,
                        	id2: id22,
                        	prev: state,
							t
                    	});
					}
					//open p2
					let weight2 = weights.get(id2);
					if(!state.opened.has(id2) && weight2 !== 0 && id1 !== id2){
						opened = mapcpy(opened);
						opened.set(id2,true);
	                    states.get(id1+id2).push({
	                        opened,
	                        modifier: state.modifier+weight1+weight2,
	                        score: state.score+state.modifier,
	                        id1: id1,
							id2: id2,
	                        prev: state,
							t
	                    });
					}
				}
            }
        }
		let remtime = maxt-t+1;
        pruneStates(states,weights,remtime);
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
        res.push([state.t,state.id1,state.id2,state.modifier,state.score]);
    }
    return res.reverse();
}

console.log(solve(graph,weights));

/*
Takes around 10 minutes to finish, here is the output
t: 1, size: 25
t: 2, size: 36
t: 3, size: 437
t: 4, size: 898
t: 5, size: 2083
t: 6, size: 6163
t: 7, size: 9504
t: 8, size: 21835
t: 9, size: 41179
t: 10, size: 78178
t: 11, size: 132185
t: 12, size: 229189
t: 13, size: 376451
t: 14, size: 532678
t: 15, size: 557731
t: 16, size: 597154
t: 17, size: 314848
t: 18, size: 223187
t: 19, size: 48587
t: 20, size: 23688
t: 21, size: 5393
t: 22, size: 2893
t: 23, size: 1651
t: 24, size: 1137
t: 25, size: 914
t: 26, size: 1
{
  opened: Map(12) {
    'CO' => true,
    'YJ' => true,
    'WH' => true,
    'UU' => true,
    'OZ' => true,
    'UD' => true,
    'FD' => true,
    'PL' => true,
    'ZM' => true,
    'WJ' => true,
    'ZI' => true,
    'EW' => true
  },
  modifier: 231,
  score: 3015,
  id1: 'EW',
  id2: 'RQ',
  prev: {
    opened: Map(11) {
      'CO' => true,
      'YJ' => true,
      'WH' => true,
      'UU' => true,
      'OZ' => true,
      'UD' => true,
      'FD' => true,
      'PL' => true,
      'ZM' => true,
      'WJ' => true,
      'ZI' => true
    },
    modifier: 215,
    score: 2800,
    id1: 'EW',
    id2: 'ZI',
    prev: {
      opened: [Map],
      modifier: 215,
      score: 2585,
      id1: 'YZ',
      id2: 'RQ',
      prev: [Object],
      t: 24
    },
    t: 25
  },
  t: 26
}
[
  [ 0, 'AA', 'AA', 0, 0 ],
  [ 1, 'ZB', 'GA', 0, 0 ],
  [ 2, 'AC', 'CO', 0, 0 ],
  [ 3, 'YJ', 'CO', 18, 0 ],
  [ 4, 'YJ', 'EZ', 33, 18 ],
  [ 5, 'PE', 'WH', 33, 51 ],
  [ 6, 'LQ', 'WH', 44, 84 ],
  [ 7, 'UU', 'HK', 44, 128 ],
  [ 8, 'UU', 'OZ', 68, 172 ],
  [ 9, 'FW', 'OZ', 85, 240 ],
  [ 10, 'VO', 'ZK', 85, 325 ],
  [ 11, 'UD', 'FD', 85, 410 ],
  [ 12, 'UD', 'FD', 125, 495 ],
  [ 13, 'QX', 'GB', 125, 620 ],
  [ 14, 'PL', 'ZM', 125, 745 ],
  [ 15, 'PL', 'ZM', 170, 870 ],
  [ 16, 'TM', 'GB', 170, 1040 ],
  [ 17, 'XP', 'FD', 170, 1210 ],
  [ 18, 'WJ', 'PM', 170, 1380 ],
  [ 19, 'WJ', 'YF', 195, 1550 ],
  [ 20, 'XP', 'ZI', 195, 1745 ],
  [ 21, 'TM', 'ZI', 215, 1940 ],
  [ 22, 'PL', 'RQ', 215, 2155 ],
  [ 23, 'KC', 'ZI', 215, 2370 ],
  [ 24, 'YZ', 'RQ', 215, 2585 ],
  [ 25, 'EW', 'ZI', 215, 2800 ],
  [ 26, 'EW', 'RQ', 231, 3015 ]
]
*/