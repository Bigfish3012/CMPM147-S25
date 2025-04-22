function generateOverworld(numCols, numRows) {
    let grid = [];
    //ground
    for (let i = 0; i < numRows; i++) {
        let row = [];
        for (let j = 0; j < numCols; j++) {
            row.push("_");
        }
        grid.push(row);
    }
    const noiseScale = 0.08;
    
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const noiseVal = noise(j * noiseScale, i * noiseScale);
            
            if (noiseVal >= 0   && noiseVal < 0.4) {
                grid[i][j] = "w"; // water
            } else if (noiseVal >= 0.4 && noiseVal < 0.45) {
                grid[i][j] = "f"; // forest
            } else if (noiseVal >= 0.5  && noiseVal < 0.6){
                grid[i][j] = "i";
            }
            // otherwise "_"
        }
    }
    
    const numHouses = floor(random(7, 9));
    for (let h = 0; h < numHouses; h++) {
        for (let attempt = 0; attempt < 30; attempt++) {
            const houseRow = floor(random(numRows));
            const houseCol = floor(random(numCols));
            
            if (grid[houseRow][houseCol] === "_" | grid[houseRow][houseCol] === "i") {
                grid[houseRow][houseCol] = "h"; // house
                break;
            }
        }
    }
    
    return grid;
}
    
function drawOverworld(grid) {
    background(128);


    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            if (gridCheck_O(grid, i, j, "w")) {
                // water animation from ChatGPT
                const offset = floor(noise(i * 0.001, j * 0.1) * 100);
                const frame  = (floor(millis() / 500) + offset) % 2;
                placeTile(i, j, frame, 13);
                drawContext_O(grid, i, j, "w", 0, 0);
                // For the corner of the shore
                if(!gridCheck_O(grid, i-1, j+1, "w") && 
                    gridCheck_O(grid, i-1, j, "w") && 
                    gridCheck_O(grid, i, j+1, "w")){
                    placeTile(i, j, 12, 1);
                }
                //For the corner of the shore
                if(!gridCheck_O(grid, i-1, j-1, "w") && 
                    gridCheck_O(grid, i-1, j, "w") && 
                    gridCheck_O(grid, i, j-1, "w")){
                    placeTile(i, j, 13, 1);
                }
            } else if (gridCheck_O(grid, i, j, "f")) { // forest
                placeTile(i, j, 0, 0);
                drawContext_O(grid,i,j,"f", 0, 0)
                
            } else if (gridCheck_O(grid, i, j, "h")) { // random house
                placeTile(i, j, 0, 0);
                placeTile(i, j, 26 + floor(random(2)), floor(random(3)));
            } else if(gridCheck_O(grid, i, j, "i")){ // road
                placeTile(i, j, 2, 3);
                drawContext_O(grid,i,j,"i", 0, 0)
                if((!gridCheck_O(grid, i-1, j, "i")) && (!gridCheck_O(grid, i+1, j, "i")) 
                    && gridCode_O(grid, i, j, "i") != 8 && gridCode_O(grid, i, j, "i") != 4){
                    placeTile(i, j, 5, 0);
                    placeTile(i, j, 5, 2);
                }
                if((!gridCheck_O(grid, i, j-1, "i")) && (!gridCheck_O(grid, i, j+1, "i")) 
                    && gridCode_O(grid, i, j, "i") != 1 && gridCode_O(grid, i, j, "i") != 2){
                    placeTile(i, j, 4, 1);
                    placeTile(i, j, 6, 1);
                }
            }else {
                placeTile(i, j, random(4) | 0, 0); // random ground tile
            }
            // cloud‑shadow overlay  from ChatGPT
            let t = millis() * 0.0002;
            let b = noise(j*0.1 + t, i*0.1 + t);
            let a = map(b, 0, 1, 0, 200);
            noStroke();
            fill(80, 0, 115, a);
            rect(j*16, i*16, 16, 16);
            
            //rain from ChatGPT
            const rainCount = 1;
            const rainLength = 5;
            const rainSpeed = 0.5;  
            stroke(200, 200, 255, 120);
            strokeWeight(2);
            for(let r = 0; r < rainCount; r++){
                let x = random(width)
                let y = (random(height) + frameCount * rainSpeed) % height;
                line(x, y, x, y + rainLength);
            }
            noStroke();
        }
    }
}

function gridCheck_O(grid, i, j, target) {
    if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
        return grid[i][j] === target;
    }
    return false;
}

function gridCode_O(grid, i, j, target) {
    const northBit = gridCheck_O(grid, i-1, j, target) ? 1 : 0;
    const southBit = gridCheck_O(grid, i+1, j, target) ? 1 : 0;
    const eastBit = gridCheck_O(grid, i, j+1, target) ? 1 : 0;
    const westBit = gridCheck_O(grid, i, j-1, target) ? 1 : 0;
    return (northBit<<0) + (southBit<<1) + (eastBit<<2) + (westBit<<3);
}

function drawContext_O(grid, i, j, target, ti, tj) {
    const code = gridCode_O(grid, i, j, target);
    let lookup;
    
    if (target === "w") {
        lookup = lookup_water;
    } else if (target === "f") {
        lookup = lookup_forest;
    } else if (target === "i"){
        lookup = lookup_i;
    }else{
        lookup = lookup_water;
    }
    
    const [tiOffset, tjOffset] = lookup[code];
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
}

const lookup_water = [
    [0,0], // 0000 - No neighbors
    [30,2], // 0001 - N only
    [30,0], // 0010 - S only
    [0,13], // NS
    [0,0], // E only
    [9,2], // N+E
    [9,0], // S+E
    [9,1], // NSE
    [0,0], // W only
    [11,2], // N+W
    [11,0], // S+W
    [11,1], // NSW
    [10,0], // E+W
    [10,2], // N+E+W
    [10,0], // S+E+W
    [0,2]  // 1111 - All four neighbors
];

const lookup_forest = [
    [14,0], // 0000 - No neighbors
    [14,0], // 0001 - N only
    [14,0], // 0010 - S only 
    [14,0], // 0011 - NS
    [14,0], // 0100 - E only
    [15,2], // 0101 - N+E
    [15,0], // 0110 - S+E
    [15,1], // 0111 - NSE
    [14,0], // 1000 - W only
    [17,2], // 1001 - N+W
    [17,0], // 1010 - S+W
    [17,1], // 1011 - NSW
    [14,0], // 1100 - E+W
    [16,2], // 1101 - N+E+W
    [16,0], // 1110 - S+E+W
    [16,1]  // 1111 - All four neighbors
];

const lookup_i = [
    [0,0], // 0000 - No neighbors
    [28,0], // 0001 - N only
    [30,0], // 0010 - S only 
    [0,2], // 0011 - NS
    [29,0], // 0100 - E only
    [4,2], // 0101 - N+E
    [4,0], // 0110 - S+E
    [4,1], // 0111 - NSE
    [5,28], // 1000 - W only
    [6,2], // 1001 - N+W
    [6,0], // 1010 - S+W
    [6,1], // 1011 - NSW
    [5,0], // 1100 - E+W
    [5,2], // 1101 - N+E+W
    [5,0], // 1110 - S+E+W
    [4,3]  // 1111 - All four neighbors
];