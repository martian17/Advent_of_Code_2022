let fs = require("fs");

let data = fs.readFileSync("data.txt")+"";

let lines = data.trim().split("\n");

let grid = lines.map(line=>{
    return line.trim().split("").map(v=>parseInt(v));
});
console.log(grid);


let w = grid[0].length;
let h = grid.length;

let getViewDistance = function(x,y){
    
    let v = grid[y][x];
    let res = 1;
    
    //to the right
    {
        let cnt = 0;
        for(let i = x+1; i < w; i++){
            cnt++;
            if(grid[y][i] >= v){
                break;
            }
        }
        res *= cnt;
    }
    //to the left
    {
        let cnt = 0;
        for(let i = x-1; i >= 0; i--){
            cnt++;
            if(grid[y][i] >= v){
                break;
            }
        }
        res *= cnt;
    }
    //to the bottom
    {
        let cnt = 0;
        for(let i = y+1; i < h; i++){
            cnt++;
            if(grid[i][x] >= v){
                break;
            }
        }
        res *= cnt;
    }
    //to the top
    {
        let cnt = 0;
        for(let i = y-1; i >= 0; i--){
            cnt++;
            if(grid[i][x] >= v){
                break;
            }
        }
        res *= cnt;
    }
    return res;
}


let gamma = [];
for(let i = 0; i < h; i++){
    gamma.push([]);
    for(let j = 0; j < w; j++){
        gamma[i].push(getViewDistance(j,i));
    }
}
console.log(gamma.map(g=>g.map(v=>{
    return (v+"     ").slice(0,5);
}).join("")).join("\n"));



//find the top gamma
let top = 0;
let cnt = 0;
for(let i = 0; i < h; i++){
    for(let j = 0; j < w; j++){
        if(gamma[i][j] > top){
            top = gamma[i][j];
        }
    }
}


console.log(`top score ${top}`);


