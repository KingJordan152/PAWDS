const {remote} = require("electron")

var button = document.getElementById("getStarted")
button.addEventListener("click", loadNext)

function loadNext() {
    var win = remote.getCurrentWindow()
    win.loadFile("src/test_windows/circle/circle.html")

}