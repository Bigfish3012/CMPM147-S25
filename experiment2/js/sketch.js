// sketch.js - purpose and description here
// Author: Chengkun Li
// Date:

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

  //sky gradient
  for (let x = 0; x < width; x++) {
    let inter = map(x, 0, width, 0, 1); // 0 on the left, 1 on the right
    let c = lerpColor(color("#EEF5FF"), color("#578FCA"), inter); // Blend the two colors
    stroke(c);
    line(x, 0, x, height); // Draw vertical lines to fill canvas
  }

  // Ocean
  drawwaves();
  let wave_height = 350;
  for(let i = 0; i < 30; i++) {
    drawwaves(centerVert + wave_height);
    wave_height += 20; // Increase height for each wave
  }

  // Draw clouds
  const clouds = random(5, 7); // Random number of clouds
  const scrub = mouseX / width;
  for (let i = 0; i < clouds; i++) {
    let x = width * ((random() + (scrub / 50 + millis() / 500000.0)) % 1);
    let y = height / 4 + random(-50, 50); // Height with a bit of vertical variance
  
    drawCloud(x, y);
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

function drawCloud(xPos, yPos) {
  noStroke();
  fill("#FBFBFB");
  ellipse(xPos, yPos, 90, 50); // Main body of the cloud
  ellipse(xPos + random(40, 70), yPos, 90, 50);
  ellipse(xPos + random(50, 70), yPos - random(20, 30), 90, 50);
}

function drawwaves(height = canvasContainer.height()) {
  let OceanColors = ["#2A629A", "#578FCA", "#2A629A", "#0F67B1", "#7AA2E3", "#008DDA"];
  noStroke();
  fill(OceanColors[int(random(0, 5))]); 
  beginShape();
  vertex(0, height);
  const steps = 20;
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y = height / 2 - (random() * random() * height) / 40 - height / 100;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
}