"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {
    background(128);
}

let worldSeed;
let starState = {}; 
function p3_worldKeyChanged(key) {
    worldSeed = XXH.h32(key, 0);
    noiseSeed(worldSeed);
    randomSeed(worldSeed);
    
    // Initialize star twinkling states
    starState = {};
}

function p3_tileWidth() {
    return 8;
}
function p3_tileHeight() {
    return 4;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
    let key = [i, j];
    clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() { background(0);  }

function p3_drawTile(i, j) {
    const key = [i, j];
    const keyStr = key.toString();
    
    const tileHash = XXH.h32("tile:" + key, worldSeed);
    const isStarSeed = tileHash % 5 === 0; // Adjust the number of stars
    
    // Get click count
    let clickCount = clicks[key] | 0;
    push();
    noStroke();
    
    // Display star when not clicked or click count is even
    if (clickCount % 2 === 0 && isStarSeed) {
        // Set twinkling frequency for each star (based on position hash)
        if (!starState[keyStr]) {
            starState[keyStr] = {
                blinkSpeed: 0.5 + (tileHash % 10) * 0.5,  // Different stars have different twinkling speeds
                phaseOffset: (tileHash >>> 4) % 628 * 0.01 
            };
        }
        
        // Use random color
        const r = 150 + (tileHash % 100);
        const g = 150 + ((tileHash >> 8) % 100);
        const b = 150 + ((tileHash >> 16) % 100);
        fill(r, g, b);
        
        // Random size, range between 3 and 10
        const starSize = 3 + (tileHash % 5);
        ellipse(0, 0, starSize, starSize);
        
        // Add white twinkling effect
        const { blinkSpeed, phaseOffset } = starState[keyStr];
        const noiseX = (millis() * 0.001 * blinkSpeed + phaseOffset);
        const blinkIntensity = map(noise(noiseX), 0, 1, 10, 200);
        
        // Draw white twinkling halo
        noStroke();
        fill(255, blinkIntensity);
        ellipse(0, 0, starSize + 2, starSize + 2);
    } 
    // Display black hole when click count is odd
    else if (clickCount % 2 === 1) {
        const noiseTime = millis() * 0.05; // Convert to seconds
        const pulseSize = map(noise(noiseTime), 0, 1, 8, 10); // Map 0 to 1 to range 8-10
        
        // Outer ring - varies with core size
        stroke(255, 180);
        strokeWeight(2);
        noFill();
        ellipse(0, 0, pulseSize + 6, pulseSize + 6);
        
        // Black hole core - pulsing effect
        noStroke();
        fill(0);
        ellipse(0, 0, pulseSize, pulseSize);
    }
    
    pop();
}

function p3_drawSelectedTile(i, j) {
    noFill();
    stroke(0, 255, 0, 128);

    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);

    noStroke();
    fill("white");
    text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
