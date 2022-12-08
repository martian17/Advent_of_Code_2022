let fs = require("fs");

let data = fs.readFileSync("data.txt")+"";

let lines = data.trim().split("\n");

let grid = lines.map(line=>{
    return line.trim().split("").map(v=>parseInt(v));
});
console.log(grid);


let w = grid[0].length;
let h = grid.length;

let gamma = [];
for(let i = 0; i < h; i++){
    gamma.push([]);
    for(let j = 0; j < w; j++){
        gamma[i].push(0);
    }
}
console.log(gamma);

//fly around from four direction, mark off visible trees

//top
for(let i = 0; i < w; i++){
    let n = -1;
    for(let j = 0; j < h; j++){
        let val = grid[j][i];
        if(val > n){
            gamma[j][i]++;
            n = val;
        }else{
            //continue on
        }
    }
}

//bottom
for(let i = 0; i < w; i++){
    let n = -1;
    for(let j = h-1; j >= 0; j--){
        let val = grid[j][i];
        if(val > n){
            gamma[j][i]++;
            n = val;
        }else{
            //continue on
        }
    }
}


//left
for(let i = 0; i < h; i++){
    let n = -1;
    for(let j = 0; j < w; j++){
        let val = grid[i][j];
        if(val > n){
            gamma[i][j]++;
            n = val;
        }else{
            //continue on
        }
    }
}

//right
for(let i = 0; i < h; i++){
    let n = -1;
    for(let j = w-1; j >= 0; j--){
        let val = grid[i][j];
        if(val > n){
            gamma[i][j]++;
            n = val;
        }else{
            //continue on
        }
    }
}


console.log(gamma);


//count it up
let cnt = 0;
for(let i = 0; i < h; i++){
    for(let j = 0; j < w; j++){
        if(gamma[i][j] > 0){
            cnt++;
        }
    }
}


console.log(`visible cnt is ${cnt}`);


