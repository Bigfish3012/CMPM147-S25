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

function p3_worldKeyChanged(key) {
    worldSeed = XXH.h32(key, 0);
    noiseSeed(worldSeed);
    randomSeed(worldSeed);
}

function p3_tileWidth() {
    return 32;
}
function p3_tileHeight() {
    return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
    let key = [i, j];
    clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

let colors_list = [
    "#A86523", "#FF90BB", "#C95792", "#547792", "#FF6363",
    "#B5FCCD", "#3D90D7", "#BE3D2A", "#7C4585", "#FE7743",
    "#FFDBDB", "#7AE2CF", "#077A7D", "#60B5FF", "#FF9149",
    "#8F87F1", "#EC5228", "#B03052", "#ADB2D4", "#7A73D1",
    "#89AC46", "#C5BAFF", "#FFEB00", "#5CB338", "#F5EFFF"];
function p3_drawTile(i, j) {
    noStroke();
    const hash = XXH.h32("color:" + [i, j], worldSeed);
    const index  = hash % colors_list.length;
    fill(colors_list[index]);

    push();

    // Add wave effect - using sin function and frameCount to create wave motion
    let waveAmplitude = 10; // Wave amplitude
    let waveFrequency = 0.1; // Wave frequency
    let waveOffset = (i * 0.5 + j * 0.3); // Offset to make different tiles have different wave phases
    let waveY = sin(frameCount * waveFrequency + waveOffset) * waveAmplitude;
    
    // Apply wave motion to the tile
    translate(0, waveY);

    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);

    let n = clicks[[i, j]] | 0;
    if (n % 2 == 1) {
        // Draw lighthouse
        // Base - trapezoid (gray)
        fill(100, 100, 100);
        rect(-tw / 2, -th / 2, tw, th / 2);
        
        // Tower - rectangle (red)
        fill(255, 0, 0);
        rect(-tw/4, -th/2 - 15, tw/2, 15);
        
        // Lighthouse top - circle (yellow)
        fill(255, 255, 0);
        ellipse(0, -th/2 - 20, 10, 10);
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
    fill(0);
    text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
