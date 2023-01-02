import * as fs from "fs";
import {MultiMap} from "../ds-js/multimap.mjs";

let test = false;

let str = (fs.readFileSync(test?"./test.txt":"./data.txt")+"").trim();


let rocks = `
####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`.trim().split("\n\n").map(v=>v.trim());


let newRock = function(str,pos){
    let rock = [];
    let rows = str.split("\n");
    for(let i = 0; i < rows.length; i++){
        let row = rows[i];
        for(let j = 0; j < row.length; j++){
            let c = row[j];
            if(c === "#")rock.push([rows.length-i-1+pos,j+2]);
        }
    }
    return rock;
};

let moveLeft = function(rock){
    for(let c of rock){
        c[1]--;
    }
};

let moveRight = function(rock){
    for(let c of rock){
        c[1]++;
    }
};

let moveDown = function(rock){
    for(let c of rock){
        c[0]--;
    }
};

let moveUp = function(rock){
    for(let c of rock){
        c[0]++;
    }
};

let checkCollision = function(rock,field){
    for(let c of rock){
        if(c[0] < 0){
            return true;
        }else if(c[1] < 0){
            return true;
        }else if(c[1] > 6){
            return true;
        }else if(field.has(c[0],c[1])){
            return true;
        }
    }
    return false;
};

let burnRock = function(rock,field){
    let top = 0;
    for(let c of rock){
        if(c[0] > top)top = c[0];
        field.set(c[0],c[1],1);
    }
    return top;
};


let moves = str.split("").filter(v=>v==="<"||v===">");

console.log(moves.length);


let field = new MultiMap();

let gtop = 0;
let rockcnt = 0;
let rock = newRock(rocks[rockcnt%rocks.length],gtop+3);
rockcnt++;
let movecnt = 0;
while(rockcnt <= 2022){
    let move = moves[movecnt%moves.length];
    movecnt++;
    if(move === "<"){
        moveLeft(rock);
    }else{
        moveRight(rock);
    }
    if(checkCollision(rock,field)){
        if(move === "<"){
            moveRight(rock);
        }else{
            moveLeft(rock);
        }
    }
    //shift down
    moveDown(rock);
    if(checkCollision(rock,field)){
        moveUp(rock);
        let top = burnRock(rock,field)+1;
        if(top > gtop)gtop = top;
        rock = newRock(rocks[rockcnt%rocks.length],gtop+3);
        rockcnt++;
    }
}

console.log(gtop);





