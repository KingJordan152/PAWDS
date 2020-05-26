// global variables
const { remote } = require("electron");
const fs = require("fs"); 
var elelFile = "./src/test_windows/elel/elel_data.txt";

var letterVelocities = [];
var velocity = 0; 
var startTime = 0.0;
var repTimes = [];
var timePerRep_E = 0.0;
var timePerRep_L = 0.0;
var letterWidths = [];
var e_width = 0.0;
var l_width = 0.0;
var letterHeights = [];
var e_height = 0.0;
var l_height = 0.0;

// reset data file
fs.writeFile(elelFile, "", (err) => {
    if (err) throw err;
});

// Button that erases drawn content and resets everything
const clearBtn = document.getElementById("clear");
clearBtn.disabled = true;
clearBtn.className = "button disabled";
clearBtn.addEventListener("click", () => {
    var win = remote.getCurrentWindow();
    win.reload();
});

// Button that ends the timer for the handwriting task and the task altogether
const stopTaskBtn = document.getElementById("stopTask");
stopTaskBtn.disabled = true;
stopTaskBtn.className = "button disabled";
stopTaskBtn.addEventListener("click", () => {
    totalTime = (new Date() - startTime) / 1000;

    // calculates total average velocity among every letter
    for (i = 0; i < letterVelocities.length; i++) {
        velocity += letterVelocities[i];
    }
    velocity /= letterVelocities.length;

    // calculates duration for each letter
    for (i = 0; i < repTimes.length; i++) {
        if (i % 2 == 0)
            timePerRep_E += repTimes[i];
        else  
            timePerRep_L += repTimes[i];
    }
    timePerRep_E /= (repTimes.length / 2);
    timePerRep_L /= (repTimes.length / 2);
    console.log(timePerRep_L);

    // calculates widths for each letter
    for (i = 0; i < letterWidths.length; i++) {
        if (i % 2 == 0)
            e_width += letterWidths[i];
        else 
            l_width += letterWidths[i];
    }
    e_width /= (letterWidths.length / 2);
    l_width /= (letterWidths.length / 2);

    // calculates heights for each letter
    for (i = 0; i < letterHeights.length; i++) {
        if (i % 2 == 0)
            e_height += letterHeights[i];
        else 
            l_height += letterHeights[i];
    }
    e_height /= (letterHeights.length / 2);
    l_height /= (letterHeights.length / 2);

    // write important info to data file
    fs.appendFile(elelFile, velocity + "\n", (err) => {
        if (err) throw err;
    });
    fs.appendFile(elelFile, timePerRep_E + "\n", (err) => {
        if (err) throw err;
    });
    fs.appendFile(elelFile, timePerRep_L + "\n", (err) => {
        if (err) throw err;
    });
    fs.appendFile(elelFile, e_width + "\n", (err) => {
        if (err) throw err;
    });
    fs.appendFile(elelFile, l_width + "\n", (err) => {
        if (err) throw err;
    });
    fs.appendFile(elelFile, e_height + "\n", (err) => {
        if (err) throw err;
    });
    fs.appendFile(elelFile, l_height + "\n", (err) => {
        if (err) throw err;
    });
    
    // disable drawpad and most buttons on screen 
    clearBtn.className = "button disabled";
    clearBtn.disabled = true;
    startTaskBtn.className = "button disabled";
    startTaskBtn.disabled = true;
    stopTaskBtn.className = "button disabled";
    stopTaskBtn.disabled = true;
    continueBtn.className = "button";
    continueBtn.disabled = false;
    drawpad.className = "disabled";
    drawpad.disabled = true;
    drawpadContainer.className = "disabled";
    drawpadContainer.disabled = true;

    // enable helptext
    helptext.innerHTML = "Press the blue button to move on to the next task!";
    helptext.style.left = "34px";
    helptext.className = "";
});

// Button that takes the user to the next task (continue)
const continueBtn = document.getElementById("continue");
continueBtn.disabled = true;
continueBtn.className = "button disabled";
continueBtn.addEventListener("click", () => {
    var win = remote.getCurrentWindow()
    win.loadFile("src/results/results.html")
});

// disable canvas/drawpad until user starts the task
const drawpad = document.getElementById("drawpad");
drawpad.disabled = true;
drawpad.className = "disabled";
const drawpadContainer = document.getElementById("drawpadContainer");
drawpadContainer.disabled = true;
drawpadContainer.className = "disabled";

// enable middle help text
const helptext = document.getElementById("helptext");

// Button that starts the timer for the handwriting task
const startTaskBtn = document.getElementById("startTask");
startTaskBtn.addEventListener("click", () => {
    startTime = new Date();

    // enable drawpad and most buttons on screen 
    clearBtn.className = "button";
    clearBtn.disabled = false;
    startTaskBtn.className = "button disabled";
    startTaskBtn.disabled = true;
    stopTaskBtn.className = "button";
    stopTaskBtn.disabled = false;
    drawpad.className = "";
    drawpad.disabled = false;
    drawpadContainer.className = "";
    drawpadContainer.disabled = false;

    // disable helptext
    helptext.className = "disabled";

    // show template
    let canvas = document.querySelector("#drawpad");
    let ctx = canvas.getContext("2d");
    var template = new Image();
    template.src = "elel_template.png";
    template.onload = () => {ctx.drawImage(template, 50, 300)};
});

/*------------------------------------------------------*/

// Drawing feature
window.addEventListener("load", () => {
    // establishes the canvas element as something you can draw on
    const canvas = document.querySelector("#drawpad");
    const ctx = canvas.getContext("2d");

    // Prevents default panning/zooming when using a stylus
    ctx.canvas.style.touchAction = "none";

    // resizing (NECESSARY FOR PROPER SCALE OF PEN STROKES)
    canvas.height = window.innerHeight - 235;
    canvas.width = window.innerWidth - 25;

    // instance variables
    let painting = false;
    var initXPos, initYPos;
    var xPos, yPos;
    var maxXPos, maxYPos, minXPos, minYPos;
    var lastX = 0;
    var lastY = 0;
    var pressure = 0;
    var totalDistance = 0;
    var timeOfPenDown = 0;
    var strokeNum = 0;

    // acts as a loop that draws multiple short lines to give off the impression of drawing
    function draw(e) {
        // prevents drawing if pen isn't touching pad
        if (!painting) 
            return;

        // Gets accurate position of pen (canvas pos - offset)
        xPos = e.clientX - canvas.offsetLeft - 2;
        yPos = e.clientY - canvas.offsetTop - 2;
        pressure = e.pressure; 
        
        // pen visuals
        ctx.lineWidth = pressure * 5;
        ctx.lineCap = "round";

        // actual drawing feature
        ctx.lineTo(xPos, yPos);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);

        if (xPos > maxXPos)
            maxXPos = xPos;
        if (xPos < minXPos)
            minXPos = xPos;
        if (yPos > maxYPos)
            maxYPos = yPos;
        if (yPos < minYPos)
            minYPos = yPos;
        
        // used in velocity calculation
        totalDistance += Math.sqrt(Math.pow(xPos - lastX, 2) + Math.pow(yPos - lastY, 2)) * 0.0002645833; // converted from pixels to meters
        lastX = xPos;
        lastY = yPos;
    }

    // activated when pen first touches tablet
    function startPos(e) {
        painting = true;

        // initializing some instance variables
        initXPos = e.clientX - canvas.offsetLeft - 2;
        lastX = initXPos;
        initYPos = e.clientY - canvas.offsetTop - 2;
        lastY = initYPos;
        timeOfPenDown = new Date();
        strokeNum++;
        maxXPos = maxYPos = 0;
        minXPos = minYPos = 99999999;

        // activates drawing function
        draw(e);
    }

    // activated when pen is lifted up from tablet
    function finishPos() {
        painting = false;
        ctx.beginPath();

        // initialze velocity from totalDistance data (IMPORTANT)
        letterVelocities[strokeNum - 1] = totalDistance / ((new Date() - timeOfPenDown) / 1000); 
        repTimes[strokeNum - 1] = (new Date() - timeOfPenDown) / 1000;
        letterWidths[strokeNum - 1] = (maxXPos - minXPos) * 0.246601942;
        letterHeights[strokeNum - 1] = (maxYPos - minYPos) * 0.246601942;
        console.log(letterHeights);

        // resets some values for next pen stroke
        totalDistance = 0;
        lastX = 0;
        lastY = 0;
    }

    // listens for when the pen interacts with the tablet
    canvas.addEventListener("pointerdown", startPos);
    canvas.addEventListener("pointerup", finishPos);
    canvas.addEventListener("pointermove", draw);
});