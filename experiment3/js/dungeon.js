/* exported generateGrid, drawGrid */
/* global placeTile */

function generateDungeon(numCols, numRows) {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
        let row = [];
        for (let j = 0; j < numCols; j++) {
            row.push("w");
        }
        grid.push(row);
    }
    
    //rooms
    const numRooms = floor(random(5, 7));
    for(let n = 0; n < numRooms; n++){
        let room_width = floor(random(numCols * 0.2, numCols * 0.5));
        let room_height =  floor(random(numRows * 0.2, numRows * 0.5));
    
        let room_start_col = floor(random(1, numCols - room_width - 1));
        let room_start_row =  floor(random(1, numRows - room_height -1));
    
        for(let i = room_start_row; i < room_start_row + room_height; i++){
            for(let j = room_start_col; j < room_start_col + room_width; j++){
            grid[i][j] = ".";
            }
        }
    }
    //Boxs
    const numBox = floor(random(3, 5));
    for (let h = 0; h < numBox; h++) {
        for (let attempt = 0; attempt < 30; attempt++) {
            const houseRow = floor(random(numRows));
            const houseCol = floor(random(numCols));
    
            if (grid[houseRow][houseCol] === ".") {
            grid[houseRow][houseCol] = "b"; // box
            break;
            }
        }
    }
    //Pillars
    const numPillars = floor(random(2, 4));
    for (let h = 0; h < numPillars; h++) {
        for (let attempt = 0; attempt < 30; attempt++) {
            const houseRow = floor(random(numRows));
            const houseCol = floor(random(numCols));
    
            if (grid[houseRow][houseCol] != "w" && grid[houseRow][houseCol] != "b") {
            grid[houseRow][houseCol] = "p";
            break;
            }
        }
    }
    
    
    return grid;
}


function drawDungeon(grid) {
    background(128);
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            if (gridCheck_D(grid, i, j, "w")) {
                placeTile(i, j, 28, 24);
            }
            if(gridCheck_D(grid, i, j, ".")){
                placeTile(i, j, (floor(random(1, 4))), 15)
                drawContext_D(grid,i,j,".", 0, 0)
            }
            if(gridCheck_D(grid, i, j, "b")){
                placeTile(i, j, (floor(random(0, 6))), 28+(floor(random(0, 2))))
            }
            if(gridCheck_D(grid, i, j, "p")){
                const bases = [28, 29, 30];
                const variants = [[0,1], [2,3]];
                const baseCol = random(bases);
                const [a, b] = random(variants);
                placeTile(i - 1, j, baseCol, a);
                placeTile(i, j, baseCol, b);
            }
        }
    }
}

function gridCheck_D(grid, i, j, target) {
    if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
        return grid[i][j] === target;
    }
    return false;
}

function gridCode_D(grid,i,j,target){
    const northBit = gridCheck_D(grid, i-1, j, target) ? 1 : 0;
    const southBit = gridCheck_D(grid, i+1, j, target) ? 1 : 0;
    const eastBit = gridCheck_D(grid, i, j+1, target) ? 1 : 0;
    const westBit = gridCheck_D(grid, i, j-1, target) ? 1 : 0;
    return  (northBit<<0)+(southBit<<1)+(eastBit<<2)+(westBit<<3);
}

function drawContext_D(grid, i, j, target, ti, tj) {
    const code = gridCode_D(grid, i, j, target);
    let lookup;
    if (target === "b") {
        lookup = lookup_box;
    } else if (target === ".") {
        lookup = lookup_room;
    }else{
        lookup = lookup_box;
    }
    const [tiOffset, tjOffset] = lookup[code];
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
}




const lookup_box = [
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

const lookup_room = [
    [28,24], // 0000 - No neighbors
    [15,25], // 0001 - N only
    [17,25], // 0010 - S only 
    [0,23], // 0011 - NS
    [14,0], // 0100 - E only
    [15,23], // 0101 - N+E
    [15,21], // 0110 - S+E
    [15,22], // 0111 - NSE
    [7,25], // 1000 - W only
    [17,23], // 1001 - N+W
    [17,21], // 1010 - S+W
    [17,22], // 1011 - NSW
    [0,23], // 1100 - E+W
    [16,23], // 1101 - N+E+W
    [16,21], // 1110 - S+E+W
    [0,2]  // 1111 - All four neighbors
];