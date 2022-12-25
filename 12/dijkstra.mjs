import {UpdatableMinHeap} from "../ds-js/heap.mjs";

//graph here is represented as Map(index=>Map(connectionsIndex=>weight)) map
let graphToNodes = function(graph){
	let nodes = new Map;
	for(let [id] of graph){
		let node = {id};
		nodes.set(id,node);
	}
	for(let [id,connections0] of graph){
		let node = nodes.get(id);
		node.connections = new Map;
		for(let [id1,weight] of connections0){
			node.connections.set(nodes.get(id1),weight);
		}
	}
	return nodes;
};


export const dijkstra = function(graph,stidx,edidx){
	//convert the graph into nodes
	let nodes = graphToNodes(graph);
	let st = nodes.get(stidx);
	let ed = nodes.get(edidx);

	for(let [id,node] of nodes){
		node.dist = Infinity;
		node.prev = null;
	}

	let queue = new UpdatableMinHeap();
	queue.set(st,0);
	st.dist = 0;
	while(!queue.isEmpty()){
		let node = queue.pop();
		if(node === ed){
			break;
		}
		for(let [node1,weight] of node.connections){
			let dist1 = node.dist+weight;
			if(dist1 < node1.dist){
				node1.dist = dist1;
				node1.prev = node;
				queue.set(node1,node1.dist);
			}
		}
	}
	//traverse from ed to st
	let route = [];
	let node = ed;
	while(node !== null){
		route.push(node);
		node = node.prev;
	}
	return route.reverse().map(node=>node.id);
};


