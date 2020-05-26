const { remote } = require("electron"); 
const fs = require("fs");

// variable declarations
var circleTime, circleVelocity, circleTimePerRep;
var archTime, archVelocity, archTimePerRep;
var elelVelocity, elel_E_Time, elel_L_Time, elel_E_Width, elel_L_Width, elel_E_Height, elel_L_Height;

// Circle threshold variables (90% Confidence Interval)
const MIN_CIRCLE_TIME = 29.688;
const MAX_CIRCLE_TIME = 44.852;
const MIN_CIRCLE_VELOCITY = 0.08102;
const MAX_CIRCLE_VELOCITY = 0.13898;
const MIN_CIRCLE_REPTIME = 1.9299;
const MAX_CIRCLE_REPTIME = 4.5501;

// Arch threshold variables (90% Confidence Interval)
const MIN_ARCH_TIME = 93.19;
const MAX_ARCH_TIME = 156.69;
const MIN_ARCH_VELOCITY = 0.07102;
const MAX_ARCH_VELOCITY = 0.12898;
const MIN_ARCH_REPTIME = 7.2529;
const MAX_ARCH_REPTIME = 13.467;

// "elel" threshold variables (90% Confidence Interval)
const MIN_ELEL_VELOCITY = 0.04681;
const MAX_ELEL_VELOCITY = 0.09319;
const MIN_ELEL_E_TIME = 0.40464;
const MAX_ELEL_E_TIME = 0.55536;
const MIN_ELEL_L_TIME = 0.58928
const MAX_ELEL_L_TIME = 0.89072;
const MIN_ELEL_E_WIDTH = 5.6875;
const MAX_ELEL_E_WIDTH = 9.6525
const MIN_ELEL_L_WIDTH = 10.02;
const MAX_ELEL_L_WIDTH = 15.62;
const MIN_ELEL_E_HEIGHT = 12.491;
const MAX_ELEL_E_HEIGHT = 20.109;
const MIN_ELEL_L_HEIGHT = 33.684;
const MAX_ELEL_L_HEIGHT = 51.596;

// HTML <div> id initializations
const circleTimeID = document.getElementById("circleTime");
const circleTimePerRepID = document.getElementById("circleTimePerRep");
const circleVelocityID = document.getElementById("circleVelocity");
const archTimeID = document.getElementById("archTime");
const archTimePerRepID = document.getElementById("archTimePerRep");
const archVelocityID = document.getElementById("archVelocity");
const elelVelocityID = document.getElementById("elelVelocity");
const elel_E_TimeID = document.getElementById("elel_E_Time");
const elel_L_TimeID = document.getElementById("elel_L_Time");
const elel_E_WidthID = document.getElementById("elel_E_Width");
const elel_L_WidthID = document.getElementById("elel_L_Width");
const elel_E_HeightID = document.getElementById("elel_E_Height");
const elel_L_HeightID = document.getElementById("elel_L_Height");

// imported data from Circle task
var circleFile = "./src/test_windows/circle/circle_data.txt";
var rawCircleData = fs.readFileSync(circleFile, "utf8");
circleTime     = rawCircleData.substring(0, rawCircleData.indexOf("\n"));
rawCircleData = rawCircleData.replace(rawCircleData.substring(0, rawCircleData.indexOf("\n") + 1), "")
circleVelocity = rawCircleData.substring(0, rawCircleData.indexOf("\n"));
rawCircleData = rawCircleData.replace(rawCircleData.substring(0, rawCircleData.indexOf("\n") + 1), "")
circleTimePerRep = rawCircleData.substring(0, rawCircleData.indexOf("\n"));

// imported data from Arch task
var archFile = "./src/test_windows/arch/arch_data.txt";
var rawArchData = fs.readFileSync(archFile, "utf8");
archTime       = rawArchData.substring(0, rawArchData.indexOf("\n"));
rawArchData = rawArchData.replace(rawArchData.substring(0, rawArchData.indexOf("\n") + 1), "");
archVelocity   = rawArchData.substring(0, rawArchData.indexOf("\n"));
rawArchData = rawArchData.replace(rawArchData.substring(0, rawArchData.indexOf("\n") + 1), "");
archTimePerRep = rawArchData.substring(0, rawArchData.indexOf("\n"));

// imported data from "elel" task
var elelFile = "./src/test_windows/elel/elel_data.txt";
var rawElelData = fs.readFileSync(elelFile, "utf8");
console.log(rawElelData);
elelVelocity = rawElelData.substring(0, rawElelData.indexOf("\n"));
rawElelData  = rawElelData.replace(rawElelData.substring(0, rawElelData.indexOf("\n") + 1), "");
elel_E_Time  = rawElelData.substring(0, rawElelData.indexOf("\n"));
rawElelData  = rawElelData.replace(rawElelData.substring(0, rawElelData.indexOf("\n") + 1), "");
elel_L_Time  = rawElelData.substring(0, rawElelData.indexOf("\n"));
rawElelData  = rawElelData.replace(rawElelData.substring(0, rawElelData.indexOf("\n") + 1), "");
elel_E_Width = rawElelData.substring(0, rawElelData.indexOf("\n"));
rawElelData  = rawElelData.replace(rawElelData.substring(0, rawElelData.indexOf("\n") + 1), "");
elel_L_Width = rawElelData.substring(0, rawElelData.indexOf("\n"));
rawElelData  = rawElelData.replace(rawElelData.substring(0, rawElelData.indexOf("\n") + 1), "");
elel_E_Height = rawElelData.substring(0, rawElelData.indexOf("\n"));
rawElelData  = rawElelData.replace(rawElelData.substring(0, rawElelData.indexOf("\n") + 1), "");
elel_L_Height = rawElelData.substring(0, rawElelData.indexOf("\n"));
rawElelData  = rawElelData.replace(rawElelData.substring(0, rawElelData.indexOf("\n") + 1), "");

// Parkinson's risk calculation
function calcResults() {
    let positiveFeatures = 0;
    let totalFeatures = 13;

    /*
    if (circleTime >= MIN_CIRCLE_TIME && circleTime <= MAX_CIRCLE_TIME) {
        positiveFeatures++;
        circleTimeID.className = "data positive";
    }
    if (circleVelocity >= MIN_CIRCLE_VELOCITY && circleVelocity <=  MAX_CIRCLE_VELOCITY) {
        positiveFeatures++;
        circleVelocityID.className = "data positive";
    } 
    if (circleTimePerRep >= MIN_CIRCLE_REPTIME && circleTimePerRep <= MAX_CIRCLE_REPTIME) {
        positiveFeatures++;
        circleTimePerRepID.className = "data positive";
    }
    if (archTime >= MIN_ARCH_TIME && archTime <= MAX_ARCH_TIME) {
        positiveFeatures++;
        archTimeID.className = "data positive";
    }  
    if (archVelocity >= MIN_ARCH_VELOCITY && archVelocity <= MAX_ARCH_VELOCITY) {
        positiveFeatures++;
        archVelocityID.className = "data positive";
    }
    if (archTimePerRep >= MIN_ARCH_REPTIME && archTimePerRep <= MAX_ARCH_REPTIME) {
        positiveFeatures++;
        archTimePerRepID.className = "data positive";
    }
    if (elelVelocity >= MIN_ELEL_VELOCITY && elelVelocity <= MAX_ELEL_VELOCITY) {
        positiveFeatures++;
        elelVelocityID.className = "data positive";
    }
    if (elel_E_Time >= MIN_ELEL_E_TIME && elel_E_Time <= MAX_ELEL_E_TIME) {
        positiveFeatures++;
        elel_E_TimeID.className = "data positive";
    }
    if (elel_L_Time >= MIN_ELEL_L_TIME && elel_L_Time <= MAX_ELEL_L_TIME) {
        positiveFeatures++;
        elel_L_TimeID.className = "data positive";
    }
    if (elel_E_Width >= MIN_ELEL_E_WIDTH && elel_E_Width <= MAX_ELEL_E_WIDTH) {
        positiveFeatures++;
        elel_E_WidthID.className = "data positive";
    }
    if (elel_L_Width >= MIN_ELEL_L_WIDTH && elel_L_Width <= MAX_ELEL_L_WIDTH) {
        positiveFeatures++;
        elel_L_WidthID.className = "data positive";
    }
    if (elel_E_Height >= MIN_ELEL_E_HEIGHT && elel_E_Height <= MAX_ELEL_E_HEIGHT) {
        positiveFeatures++;
        elel_E_HeightID.className = "data positive";
    }
    if (elel_L_Height >= MIN_ELEL_L_HEIGHT && elel_L_Height <= MAX_ELEL_L_HEIGHT) {
        positiveFeatures++;
        elel_L_HeightID.className = "data positive";
    }
    */

    if (circleTime >= MAX_CIRCLE_TIME) {
        positiveFeatures++;
        circleTimeID.className = "data positive";
    }
    if (circleVelocity <=  MAX_CIRCLE_VELOCITY) {
        positiveFeatures++;
        circleVelocityID.className = "data positive";
    } 
    if (circleTimePerRep >= MAX_CIRCLE_REPTIME) {
        positiveFeatures++;
        circleTimePerRepID.className = "data positive";
    }
    if (archTime >= MAX_ARCH_TIME) {
        positiveFeatures++;
        archTimeID.className = "data positive";
    }  
    if (archVelocity <= MAX_ARCH_VELOCITY) {
        positiveFeatures++;
        archVelocityID.className = "data positive";
    }
    if (archTimePerRep >= MAX_ARCH_REPTIME) {
        positiveFeatures++;
        archTimePerRepID.className = "data positive";
    }
    if (elelVelocity <= MAX_ELEL_VELOCITY) {
        positiveFeatures++;
        elelVelocityID.className = "data positive";
    }
    if (elel_E_Time >= MAX_ELEL_E_TIME) {
        positiveFeatures++;
        elel_E_TimeID.className = "data positive";
    }
    if (elel_L_Time >= MAX_ELEL_L_TIME) {
        positiveFeatures++;
        elel_L_TimeID.className = "data positive";
    }
    if (elel_E_Width <= MAX_ELEL_E_WIDTH) {
        positiveFeatures++;
        elel_E_WidthID.className = "data positive";
    }
    if (elel_L_Width <= MAX_ELEL_L_WIDTH) {
        positiveFeatures++;
        elel_L_WidthID.className = "data positive";
    }
    if (elel_E_Height <= MAX_ELEL_E_HEIGHT) {
        positiveFeatures++;
        elel_E_HeightID.className = "data positive";
    }
    if (elel_L_Height <= MAX_ELEL_L_HEIGHT) {
        positiveFeatures++;
        elel_L_HeightID.className = "data positive";
    }

    return ((positiveFeatures / totalFeatures) * 100).toFixed(2);
}

// print out risk percentage
document.getElementById("results").innerHTML = calcResults() + "%";

// print out individual feature data
circleTimeID.innerHTML = "- " + "Total Time: " + parseFloat(circleTime).toFixed(2) + " seconds";
circleTimePerRepID.innerHTML = "- " + "Time Per Repetition: " + parseFloat(circleTimePerRep).toFixed(2) + " seconds";
circleVelocityID.innerHTML = "- " + "Average Velocity: " + parseFloat(circleVelocity).toFixed(2) + " m/s";

archTimeID.innerHTML = "- " + "Total Time: " + parseFloat(archTime).toFixed(2) + " seconds";   
archTimePerRepID.innerHTML = "- " + "Time Per Rep: " + parseFloat(archTimePerRep).toFixed(2) + " seconds";
archVelocityID.innerHTML = "- " + "Average Velocity: " + parseFloat(archVelocity).toFixed(2) + " m/s";

elelVelocityID.innerHTML = "- " + "Average Velocity: " + parseFloat(elelVelocity).toFixed(2) + " m/s";
elel_E_TimeID.innerHTML = "- " + "Average \"E\" Duration: " + parseFloat(elel_E_Time).toFixed(2) + " seconds";
elel_L_TimeID.innerHTML = "- " + "Average \"L\" Duration: " + parseFloat(elel_L_Time).toFixed(2) + " seconds";
elel_E_WidthID.innerHTML = "- " + "Average \"E\" Width: " + parseFloat(elel_E_Width).toFixed(2) + " mm";
elel_L_WidthID.innerHTML = "- " + "Average \"L\" Width: " + parseFloat(elel_L_Width).toFixed(2)  + " mm";
elel_E_HeightID.innerHTML = "- " + "Average \"E\" Height: " + parseFloat(elel_E_Height).toFixed(2)  + " mm";
elel_L_HeightID.innerHTML = "- " + "Average \"L\" Height: " + parseFloat(elel_L_Height).toFixed(2)  + " mm";

// rest data from all files
fs.writeFile(circleFile, "", (err) => {
    if (err) throw err;
});
fs.writeFile(archFile, "", (err) => {
    if (err) throw err;
});
fs.writeFile(elelFile, "", (err) => {
    if (err) throw err;
});

const surveyBtn = document.getElementById("surveyBtn");
surveyBtn.addEventListener("click", () => {
    var win = remote.getCurrentWindow();
    win.loadURL("https://forms.gle/MQiLuSY6hL8YPA3e8");
});
