/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
    return [
        {
        name: "Lunch atop a Skyscraper", 
        assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/lunch-on-a-skyscraper.jpg?v=1714798266994",
        credit: "Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932"
        },
        {
        name: "Train Wreck", 
        assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/train-wreck.jpg?v=1714798264965",
        credit: "Train Wreck At Monteparnasse, Levy & fils, 1895"
        },
        {
        name: "Migrant mother", 
        assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/migrant-mother.jpg?v=1714778906791",
        credit: "Migrant Mother near Nipomo, California, Dorothea Lange, 1936"
        },
        {
        name: "Disaster Girl", 
        assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/girl-with-fire.jpg?v=1714778905663",
        credit: "Four-year-old Zoë Roth, 2005"
        },
        {
        name: "Flower",
        assetUrl: "img/flower.jpg",
        credit: "Flower, RoonZ_ni, 2018" //Link: https://unsplash.com/photos/pink-flower-ATgfRqpFfFI
        },

        {
        name: "Moon",
        assetUrl: "img/moon.jpg",
        credit: "Moon, Neven Krcmarek, 2016" //Link: https://unsplash.com/photos/full-moon-9dTg44Qhx1Q
        },
        {
        name: "Panda",
        assetUrl: "img/panda.jpg",
        credit: "Panda, Damian Patkowski, 2018" //Link: https://unsplash.com/photos/wildlife-photography-of-black-and-white-panda-A57EhRpsvyI?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash
        },
        {
        name: "Dragon",
        assetUrl: "img/dragon.jpg",
        credit: "Dragon, Martin Woortman, 2018" //Link: https://unsplash.com/photos/orange-dragon-illustration-ojBTvDYb9Ak?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash
        },
        {
        name: "Frog",
        assetUrl: "img/frog.png",
        credit: "Frog, from the internet"
        },
    ];
}

function initDesign(inspiration) {
    // from professor's code : https://github.com/wmodes/cmpm147/blob/master/experiment5/js/mydesign.js
    $(".caption").text(inspiration.credit);
    const size = 400 / inspiration.image.width;
    resizeCanvas(inspiration.image.width * size, inspiration.image.height * size);
    const imageHTML = `<img src="${inspiration.assetUrl}" style="width: ${inspiration.image.width * size}px; height: ${inspiration.image.height * size}px;">`;
    $('#original').empty()
    $('#original').append(imageHTML);

    let design = {bg:128, fg:[]}
    for(let i = 0; i < 3000; i++){
        let imgX = floor(random(inspiration.image.width));
        let imgY = floor(random(inspiration.image.height));
        
        let shapeWidth = random(width/40, width/15);
        let shapeHeight = random(height/40, height/15);
        
        design.fg.push({
            x: (imgX * size),
            y: (imgY * size),
            w: shapeWidth,
            h: shapeHeight,
            fill: getImageColor(inspiration.image, imgX, imgY),
            shape: floor(random(3))
        })
    }
    
    return design
}

function renderDesign(design, inspiration) {
    background(design.bg);
    noStroke();
    
    for(let i = 0; i < design.fg.length; i++){
        const fg = design.fg[i];
        try {
            // get the color and create a semi-transparent version
            let c = fg.fill;
            fill(c[0], c[1], c[2], 160);
        } catch (e) {
            // if the color is invalid, use a random color
            fill(random(255), random(255), random(255), 120);
        }
        
        switch(fg.shape) {
            case 0: // rectangle
                rect(fg.x, fg.y, fg.w, fg.h);
                break;
            case 1: // ellipse
                ellipse(fg.x + fg.w/2, fg.y + fg.h/2, fg.w, fg.h);
                break;
            case 2: // triangle
                triangle(
                    fg.x, fg.y + fg.h,
                    fg.x + fg.w/2, fg.y,
                    fg.x + fg.w, fg.y + fg.h
                );
                break;
        }
    }
}

function mutateDesign(design, inspiration, rate) {
    // mutate the existing shapes
    for(let i = 0; i < design.fg.length; i++){
        const fg = design.fg[i];
        if(random(1) < rate){
            // randomly select a point on the image as the new position
            const size = 400 / inspiration.image.width;
            let newPosX = constrain(floor(randomGaussian(fg.x / size, inspiration.image.width * 0.1)), 0, inspiration.image.width - 1);
            let newPosY = constrain(floor(randomGaussian(fg.y / size, inspiration.image.height * 0.1)), 0, inspiration.image.height - 1);
            
            
            // mutate the position with a certain probability
            if (random(1) < rate * 0.7) {
                fg.x = newPosX * size;
                fg.y = newPosY * size;
            }
            
            // mutate the size with a certain probability
            if (random(1) < rate * 0.5) {
                fg.w = mut(fg.w, 5, width/10, rate * 0.8);
                fg.h = mut(fg.h, 5, height/10, rate * 0.8);
            }
            
            // mutate the color with a certain probability
            if (random(1) < rate * 0.8) {
                fg.fill = getImageColor(inspiration.image, newPosX, newPosY);
            }
            
            // mutate the shape type with a certain probability
            if(random(1) < rate * 0.4) {
                fg.shape = floor(random(3));
            }
        }
    }
}

function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}

function getImageColor(image, x, y) {
    // ensure the coordinates are within the image range
    x = constrain(floor(x), 0, image.width - 1);
    y = constrain(floor(y), 0, image.height - 1);
    
    // get color and ensure the return value is a valid color
    let c = image.get(x, y);
    
    // if the image is not loaded or the color is invalid, return a default color
    if (!Array.isArray(c)) {
        return [random(255), random(255), random(255), 120];
    }
    
    return c;
}