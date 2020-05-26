// global variables
const { remote } = require("electron");
const fs = require("fs"); 
var archFile = "./src/test_windows/arch/arch_data.txt";

var velocity = 0; 
var startTime = 0.0;
var totalTime = 0;
var repTimes = [];
var timePerRep = 0.0;

// reset data file
fs.writeFile(archFile, "", (err) => {
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
    for (i = 0; i < repTimes.length; i++) {
        timePerRep += repTimes[i];
    }
    timePerRep /= repTimes.length;

    // write important info to data file
    fs.appendFile(archFile, totalTime + "\n", (err) => {
        if (err) throw err;
    });
    fs.appendFile(archFile, velocity + "\n", (err) => {
        if (err) throw err;
    })
    fs.appendFile(archFile, timePerRep + "\n", (err) => {
        if (err) throw err;
    })
    
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
    win.loadFile("src/test_windows/elel/elel.html")
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
    template.src = "arch_template.png";
    template.onload = () => {ctx.drawImage(template, 425, 25)};
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
    var lastX = 0;
    var lastY = 0;
    var pressure = 0;
    var totalDistance = 0;
    var timeOfPenDown = 0;
    var strokeNum = 0;
    var repsLeft = 5;

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
        ctx.strokeStyle = "#000000"

        // actual drawing feature
        ctx.lineTo(xPos, yPos);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        
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

        // update repetition text
        ctx.font = "30px Franklin Gothic Medium";
        if (repsLeft <= 0)
            ctx.fillText("No more repetitions required!", 20, canvas.height - 20);
        else   
            ctx.fillText("Repetitions left: " + repsLeft, 20, canvas.height - 20);

        // activates drawing function
        draw(e);
    }

    // activated when pen is lifted up from tablet
    function finishPos() {
        painting = false;
        ctx.beginPath();

        // initialze velocity from totalDistance data (IMPORTANT)
        velocity = totalDistance / ((new Date() - timeOfPenDown) / 1000); 
        repTimes[strokeNum - 1] = (new Date() - timeOfPenDown) / 1000;
        console.log(repTimes);

        // resets some values for next pen stroke
        totalDistance = 0;
        lastX = 0;
        lastY = 0;

        // erase previous circle and redraw template
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var template = new Image();
        template.src = "arch_template.png";
        template.onload = () => {ctx.drawImage(template, 425, 25)};
        repsLeft--;
        if (repsLeft <= 0)
            ctx.fillText("No more repetitions required!", 20, canvas.height - 20);
        else   
            ctx.fillText("Repetitions left: " + repsLeft, 20, canvas.height - 20);
    }

    // listens for when the pen interacts with the tablet
    canvas.addEventListener("pointerdown", startPos);
    canvas.addEventListener("pointerup", finishPos);
    canvas.addEventListener("pointermove", draw);
});