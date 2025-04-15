// sketch.js - purpose and description here
// Author: Chengkun Li
// Date: 4/14/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(100);
  background(220);    
  // call a method on the instance
  myInstance.myMethod();

  //sky gradient -- code copied from flanniganable's video https://www.youtube.com/watch?v=EAY7S1tWbzc
  for (let x = 0; x < width; x++) {
    let inter = map(x, 0, width, 0, 1);
    let c = lerpColor(color("#FFDDAB"), color("#578FCA"), inter); 
    stroke(c);
    line(x, 0, x, height); 
  }

  // Ocean
  let wave_height = 450;
  for(let i = 0; i < 130; i++) {
    drawwaves(height/2 + wave_height);
    wave_height += 4;
  }


  // // Draw a stone on the beach
  drawStone()
  // // Draw mountains
  drawMountain()
  // Draw clouds
  const clouds = 5; // number of clouds
  const scrub = mouseX / width;
  for (let i = 0; i < clouds; i++) { // code copied from Prof. Modes https://glitch.com/edit/#!/cmpm147-ex2-living-impression?path=script.js%3A39%3A18
    let x = width * ((random() + (scrub / 50 + millis() / 50000.0)) % 1);
    let y = height / 3 + random(-100, 100);
  
    drawCloud(x, y, random(1, 5)); // Random size between 1 and 5
  }
  // // Draw bird
  for(let i = 0; i < 20; i++) {
    let x = width * ((random() + (scrub / 50 + millis() / 20000.0)) % 1);
    let y = random(200, 350);
    drawBird(x, y);
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

// code copied from https://editor.p5js.org/jackiezen/sketches/rJEziNOR
function drawCloud(x, y, size) {
  noStroke();
  fill(245, 238, 220, random(10, 200));
	arc(x, y, 50 * size, 20 * size, PI + TWO_PI, TWO_PI);
	arc(x + 10, y,30 * size, 45 * size, PI + TWO_PI, TWO_PI);
	arc(x + 25, y, 30 * size, 35 * size, PI + TWO_PI, TWO_PI);
	arc(x + 40, y, 50 * size, 20 * size, PI + TWO_PI, TWO_PI);
}

function drawwaves(height = canvasContainer.height()) {
  let OceanColors = ["#3876BF", "#4A8CC2", "#5DA3C5", "#6EB9C8", "#81CFCB"];
  noStroke();
  fill(OceanColors[int(random(0, 5))]);
  beginShape();
  vertex(0, height);
  const steps = 40;
  for (let i = 0; i < steps + 1; i++) { // code copied from Prof. Modes https://glitch.com/edit/#!/cmpm147-ex2-living-impression?path=script.js%3A39%3A18
    let x = (width * i) / steps;
    let y = height / 2 - (random() * random() * random() * height) / 50;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
}

function drawStone() {
  fill("#32012F");
  let xPos = width - 300;  
  let yPos = height - 100;  
  rect(xPos, yPos, 310, 200, 10);
  rect(xPos + 40, yPos - 20, 300, 80, 10);
  rect(xPos + 80, yPos - 40, 300, 60, 10);
  rect(xPos + 210, yPos - 60, 300, 40, 10);
  rect(xPos - 70, yPos + 80, 310, 40, 10);
}

function drawMountain() {
  // Background mountain
  let bgTopY = 300; // code from https://www.youtube.com/watch?v=-MUOweQ6wac
  let bgBottomY = height / 2 + 75;
  let gradient = drawingContext.createLinearGradient(0, bgTopY, 0, bgBottomY);
  gradient.addColorStop(0, 'rgba(160, 147, 134, 0.5)'); 
  gradient.addColorStop(1, 'rgba(87, 123, 141, 0)');
  drawingContext.fillStyle = gradient;

  beginShape();
  vertex(0, height / 2 + 75);
  vertex(0, 350);
  vertex(width/10, 340);
  vertex(width/6, 320);
  vertex(width/5, 330);
  vertex(width/2, height / 2.2);
  vertex(width - (width/2.1), height / 2.3);
  vertex(width - (width/3), height / 2.5);
  vertex(width - 100, height / 2 + 75);
  endShape(CLOSE);

  // foreground mountain
  let fgTopY = 340;
  let fgBottomY = height / 2 + 80;
  gradient = drawingContext.createLinearGradient(0, fgTopY, 0, fgBottomY);
  gradient.addColorStop(0, 'rgba(127, 141, 155, 0.53)');
  gradient.addColorStop(1, 'rgba(52, 76, 100, 0)');
  drawingContext.fillStyle = gradient;
  beginShape();
  vertex(width / 4, height / 2 + 80);

  vertex(width / 4 + 20, height / 2 + 65);
  vertex(width / 4 + 50, height / 2 + 55);
  vertex(width / 4 + 80, height / 2 + 50);
  vertex(width / 4 + 120, height / 2 + 45);
  vertex(width / 4 + 160, height / 2 + 40);
  vertex(width / 4 + 200, height / 2 + 50);

  vertex(width /2 + 200, height / 2 + 80);
  endShape(CLOSE);

  // foreground mountain 2
  let fg2TopY = height/2 + 50; 
  let fg2BottomY = height / 2 + 80;
  gradient = drawingContext.createLinearGradient(0, fg2TopY, 0, fg2BottomY);
  gradient.addColorStop(0, 'rgb(128, 117, 102)'); 
  gradient.addColorStop(1, 'rgba(99, 148, 228, 0)');
  drawingContext.fillStyle = gradient;
  beginShape();
  vertex(width / 3, height / 2 + 80);
  vertex(width / 3 + 30, height / 2 + 60);
  vertex(width / 3 + 120, height / 2 + 50);
  vertex(width / 3 + 160, height / 2 + 40);
  vertex(width / 3 + 200, height / 1.9);
  vertex(width / 3 + 240, height / 2);

  vertex(width - (width/7), height / 2.5);
  vertex(width - (width/10), height / 2.25);
  vertex(width - (width/25), height / 2.3);
  vertex(width, height / 2.2);
  vertex(width, height / 2 + 80);
  endShape(CLOSE);

  // foreground mountain 3
  let fg3TopY = height / 2 + 50;
  let fg3BottomY = height / 2 + 90;
  gradient = drawingContext.createLinearGradient(0, fg3TopY, 0, fg3BottomY);
  gradient.addColorStop(0, 'rgb(83, 85, 76)'); 
  gradient.addColorStop(1, 'rgb(84, 138, 224)');
  drawingContext.fillStyle = gradient;
  beginShape();
  vertex(width / 2, height / 2 + 80);
  vertex(width - (width/2.03), height - (height / 2.5));
  vertex(width - (width/2.1), height - (height / 2.5));
  vertex(width - (width/2.12), height - (height / 2.6));
  vertex(width - (width/2.5), height - (height / 2.1));
  vertex(width - (width/3), height - (height / 2.3));
  vertex(width - (width/4.5), height - (height / 2));
  vertex(width - (width/5), height - (height / 2.2));
  vertex(width - (width/6), height - (height / 2.1));
  vertex(width - (width/8), height /1.8);
  vertex(width - 100, height /1.9);
  vertex(width - 10, height /1.9);
  vertex(width, height /1.85);
  vertex(width, height / 2 + 90);
  endShape(CLOSE);
}
// code copied from https://p5js.org/reference/p5/bezier/ and https://www.youtube.com/watch?v=vN5tnSg1x2g
function drawBird(x = 215, y = 105) {
  stroke(0);
  strokeWeight(2);
  noFill();
  bezier(
    x, y, 
    x - 22, y - 22,  
    x - 2, y - 11,   
    x - 18, y - 12 
  );
  bezier(
    x, y, 
    x + 10, y - 12,
    x - 2, y - 11,  
    x + 15, y - 22
  );
}