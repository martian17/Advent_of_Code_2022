import * as fs from "fs";
import {MultiMap} from "../ds-js/multimap.mjs";
import {arrLoopBack} from "../ds-js/arrutil.mjs";


class MultiCache extends MultiMap{
    add(...lst){
        let val = lst.pop();
        //console.log(lst,val);
        let bucket = this.get(...lst);
        if(!bucket){
            bucket = [];
            this.set(...lst,bucket);
        }
        bucket.push(val);
    }
    get(...lst){
        let res = super.get(...lst);
        //console.log(lst,res);
        return res;
    }
    *loop(...lst){
        let bucket = this.get(...lst);
        if(bucket){
            for(let i = bucket.length-1; i >= 0; i--){
                yield bucket[i];
            }
        }
    }
};


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

let stateCache = new MultiCache();
let prevRocks = [];

let targetCnt = 1000000000000;

//step 1, find the stop point
outermost:
while(true){
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
        let i3 = rockcnt-1;
        //               rock type        , move                , horizontal position
        let signature = [(i3)%rocks.length, movecnt%moves.length, rock[0][1]];
        let bucket = stateCache.get(...signature)||[];
        if(bucket.length >= 3)console.log(bucket);
        let bset = new Set(bucket);
        //[4,5,8,10,13] 15
        outer:
        for(let i2 of arrLoopBack(bucket)){
            let diff = i3-i2;
            let i1 = i2-diff;
            if(!bset.has(i1))continue;
            //verify i1->i2 === i2-> i3 section
            //heights at each points
            let h01 = prevRocks[i1][3];
            let h02 = prevRocks[i2][3];
            let h03 = rock[0][0];
            if(h03-h02 !== h02-h01)continue;
            for(let i = i1; i < i2; i++){
                let s1 = prevRocks[i];
                let s2 = prevRocks[i+diff];
                //idx==0 not considered since rock type is guaranteed to be the same
                if(s1[1] !== s2[1] || s1[2] !== s2[2] || s1[3]-h01 !== s2[3]-h02){
                    //different rock found
                    continue outer;
                }
            }
            //repeating section found!
            let repeats = Math.floor((targetCnt-i1)/diff);
            let offset = (targetCnt-i1)%diff;
            console.log(`answer: ${h01+(h02-h01)*repeats+(prevRocks[i1+offset][3]-h01)}`);
            break outermost;
        }
        stateCache.add(...signature,i3);
        if(i3%1000 === 0)console.log(i3,gtop);
        signature.push(rock[0][0]);//vertical position
        prevRocks.push(signature);
        rock = newRock(rocks[rockcnt%rocks.length],gtop+3);
        rockcnt++;
    }
}

console.log(gtop);





