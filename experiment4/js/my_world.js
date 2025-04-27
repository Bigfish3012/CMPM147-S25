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

let colors_list = [
    "#A86523", "#FF90BB", "#C95792", "#547792", "#FF6363",
    "#B5FCCD", "#3D90D7", "#BE3D2A", "#7C4585", "#FE7743",
    "#FFDBDB", "#7AE2CF", "#077A7D", "#60B5FF", "#FF9149",
    "#8F87F1", "#EC5228", "#B03052", "#ADB2D4", "#7A73D1",
    "#89AC46", "#C5BAFF", "#85193C", "#5CB338", "#F5EFFF"];

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
    return 16;
}
function p3_tileHeight() {
    return 8;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
    let key = [i, j];
    clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
    noStroke();

    // Check if it's a yellow path (j === 0 or j === ±1 or j === ±2)
    if (j === 0 || j === 1 || j === -1 || j === 2 || j === -2) {
        fill("#FFEB00"); 
        push();
        beginShape();
        vertex(-tw, 0);
        vertex(0,  th);
        vertex(tw, 0);
        vertex(0, -th);
        endShape(CLOSE);
        pop();      
        return;
    }
    
    // Diagonal: [n][n] and [n-1][n] form a pillar
    if ((i >= 0 && j >= 0 && i === j) || (i >= 0 && j > 0 && i+1 === j)) {
        fill("#FFEB00"); 
        push();
        beginShape();
        vertex(-tw, 0);
        vertex(0,  th);
        vertex(tw, 0);
        vertex(0, -th);
        endShape(CLOSE);
        pop();      
        return;
    }
    // for other pillars
    const pillarSpacing = 15;
    if (j >= 0 && (i - j) % pillarSpacing === 0) {
        const offset = i - j;
        const pillarHash = XXH.h32("pillar:" + offset, worldSeed);
        const colorIndex = pillarHash % colors_list.length;
        fill(colors_list[colorIndex]);
        push();
        beginShape();
        vertex(-tw, 0);
        vertex(0,  th);
        vertex(tw, 0);
        vertex(0, -th);
        endShape(CLOSE);
        pop();
        return;
    }
    // night sky
    fill(0);
    push();
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);

    //stars
    if (XXH.h32("tile:" + [i, j], worldSeed) % 25 == 0) {
        const t = (sin(frameCount * 0.05 + (i * 13 + j * 7)) + 1) * 0.5;
        const starAlpha = lerp(60, 255, t);
        const starScale = lerp(0.01, 0.05, t);
        push();
        scale(starScale);
        noStroke();
        fill(255, 235, 0, starAlpha);
        beginShape();
        ellipse(0, 0, 100, 100);
        endShape(CLOSE);
        pop();
    }

    // twinkling stars
    let n = clicks[[i, j]] | 0;
    if (n % 2 == 1) {
        const t = (sin(frameCount * 0.05 + (i * 13 + j * 7)) + 1) * 0.5;
        const starAlpha = lerp(60, 255, t);
        const starScale = lerp(0.06, 0.1, t);
        push();
        scale(starScale);
        noStroke();
        fill(255, 235, 0, starAlpha);
        beginShape();
        vertex(0, -100);
        quadraticVertex(0, 0, 100, 0);
        quadraticVertex(0, 0, 0, 100);
        quadraticVertex(0, 0, -100, 0);
        quadraticVertex(0, 0, 0, -100);
        endShape(CLOSE);
        pop();
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
