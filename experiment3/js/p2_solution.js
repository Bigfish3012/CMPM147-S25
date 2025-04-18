/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
        let row = [];
        for (let j = 0; j < numCols; j++) {
            row.push("_");
        }
        grid.push(row);
    }
    
    let room_width = floor(random(numCols * 0.2, numCols * 0.6));
    let room_height =  floor(random(numRows * 0.2, numRows * 0.6));
    
    let room_start_col = floor(random(1, numCols - room_width - 1));
    let room_start_row =  floor(random(1, numRows - room_height -1));
    
    for(let i = room_start_row; i < room_start_row + room_height; i++){
        for(let j = room_start_col; j < room_start_col + room_width; j++){
            grid[i][j] = "o";
        }
    }
    return grid;
}
    
function drawGrid(grid) {
    background(128);
        
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] == '_') {
                placeTile(i, j, (floor(random(4))), 0);
            }
            else if (grid[i][j] == 'o') {
                placeTile(i, j, 0, 1); 
            }
        }
    }
}

function gridCheck(grid, i, j, target) {
    if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
        return grid[i][j] === target;
    }
    return false;
}