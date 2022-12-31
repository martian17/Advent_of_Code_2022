import * as fs from "fs";
import {mapcpy} from "../ds-js/maputil.mjs"


let test = true;

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


//verify the graph
let verified = true;
for(let [id,connections] of graph){
	for(let [id2,weight] of connections){
		if(!graph.has(id2) || !graph.get(id2).has(id)){
			console.log(`${id} to ${id2} connection is directed`);
			verified = false;
		}
	}
}
if(verified){
	console.log("graph verified");
}else{
	console.log("graph has directed connections");
}

const CLOSED = false;
const OPENED = true;
const MOVE = "MOVE";//1;
const OPEN = "OPEN";//2;
const STAY = "STAY";//3;


let findMaxPath = function(graph,weights){
	let states = new Map();
	states.set("AA",{
		prev:     null,
		action:   MOVE,
		score:    0,
		modifier: 0,
		position: "AA",
		opened:   new Map,
		t:0,
	});
	let maxtime = 30;
	for(let t = 1; t <= maxtime; t++){
		console.log(t);
		let states0 = states;
		states = new Map();
		for(let [id,connections] of graph){
			//console.log(id,connections);
			//search the all possible states,
			//pick out the one that would accumulate maximum score by the end of the period
			let remtime = maxtime-t+1;
			let maxEarning = -1;
			let maxState = null;
			for(let [id2,weight] of connections){
				let state2 = states0.get(id2);
				if(!state2)continue;
				let earning = state2.score+state2.modifier*remtime;
				if(earning > maxEarning){
					maxState = state2;
					maxEarning = earning;
				}
			}
			let state = states0.get(id);
			let weight = weights.get(id);
			let earning = -1;
			let pendingAction = STAY;
			if(state){
				if(state.action === MOVE){
					pendingAction = OPEN;
				}
				earning = state.score+state.modifier*remtime+((pendingAction===OPEN&&remtime!==0)?(weight*(remtime-1)):0);
			}
			if(maxState === null && !state){
				continue;
			}else if(state && !state.opened.has(id) && maxEarning < earning){
				let opened = mapcpy(state.opened);
				opened.set(id,true);
				states.set(id,{
					prev:     state,
					action:   pendingAction,
					score:    state.score+state.modifier,
					modifier: state.modifier + (pendingAction===OPEN?weights.get(id):0),
					position: id,t,
					opened,
					earning
				});
			}else{
				states.set(id,{
					prev:     maxState,
					action:   MOVE,
					score:    maxState.score+maxState.modifier,
					modifier: maxState.modifier,
					position: id,t,
					opened:   maxState.opened,
					earning:  maxEarning
				});
			}
		}
		console.log(states);
	}
	let maxState = null;
	let maxScore = -Infinity;
	for(let [id,state] of states){
		if(state.score > maxScore){
			maxScore = state.score;
			maxState = state;
		}
	}
	
	let ss = [];
	console.log(maxState.score);
	while(maxState){
		ss.push([maxState.t,maxState.position,maxState.modifier,maxState.score,maxState.action,maxState.earning]);
		maxState = maxState.prev;
	}
	return ss//.reverse();
}

console.log(findMaxPath(graph,weights));

