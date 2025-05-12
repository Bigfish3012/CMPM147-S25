// sketch.js - Overworld and Dungeon Generator
// Author: Chengkun Li
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file


let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;
let worldType = "overworld"; // Current world type: overworld or dungeon

// Store grids for both world types
let overworldGrid = [];
let dungeonGrid = [];

function preload() {
  tilesetImage = loadImage("./tileset/tilesetP8.png");
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  
  // Regenerate both grids
  overworldGrid = generateOverworld(numCols, numRows);
  dungeonGrid = generateDungeon(numCols, numRows);
  
  // Update current grid based on world type
  if (worldType === "overworld") {
    select("#asciiBox").value(gridToString(overworldGrid));
    currentGrid = overworldGrid;
  } else {
    select("#asciiBox").value(gridToString(dungeonGrid));
    currentGrid = dungeonGrid;
  }
}

function regenerateGrid() {
  // Only regenerate the current type of grid
  if (worldType === "overworld") {
    overworldGrid = generateOverworld(numCols, numRows);
    select("#asciiBox").value(gridToString(overworldGrid));
    currentGrid = overworldGrid;
  } else {
    dungeonGrid = generateDungeon(numCols, numRows);
    select("#asciiBox").value(gridToString(dungeonGrid));
    currentGrid = dungeonGrid;
  }
}

function reparseGrid() {
  // Update the appropriate grid based on world type
  if (worldType === "overworld") {
    overworldGrid = stringToGrid(select("#asciiBox").value());
    currentGrid = overworldGrid;
  } else {
    dungeonGrid = stringToGrid(select("#asciiBox").value());
    currentGrid = dungeonGrid;
  }
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function toggleWorldType() {
  // Switch between overworld and dungeon
  worldType = worldType === "overworld" ? "dungeon" : "overworld";
  
  // Update button text
  select("#toggleWorldButton").html(worldType === "overworld" ? "Switch to Dungeon" : "Switch to Overworld");
  
  // Use the stored grid for the current world type
  if (worldType === "overworld") {
    select("#asciiBox").value(gridToString(overworldGrid));
    currentGrid = overworldGrid;
  } else {
    select("#asciiBox").value(gridToString(dungeonGrid));
    currentGrid = dungeonGrid;
  }
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);
  
  // Create toggle world button
  let toggleButton = createButton("Switch to Dungeon");
  toggleButton.id("toggleWorldButton");
  toggleButton.mousePressed(toggleWorldType);
  toggleButton.parent("worldControls");

  // Initialize both grids
  overworldGrid = generateOverworld(numCols, numRows);
  dungeonGrid = generateDungeon(numCols, numRows);
  
  // Set initial grid
  currentGrid = overworldGrid;
  select("#asciiBox").value(gridToString(currentGrid));
}


function draw() {
  randomSeed(seed);
  
  // Draw the current world type
  if (worldType === "overworld") {
    drawOverworld(currentGrid);
  } else {
    drawDungeon(currentGrid);
  }
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}