var canvas;
var ctx;
var bgImg;
var nob;
var poles;

const areaWidth = 240;
var mouseIsDown = false;
var blockToMove = null;
var dist = 0;
var poleOrigin = null;
var countMoves = 0;

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    bgImg = document.getElementById("source");
    nob = document.getElementById("numberOfBlocks").value;
    poles = createBoardElements(nob);

    var menu = document.getElementsByClassName("content-nav");
    Array.prototype.forEach.call(menu, element => element.addEventListener('click', () => changeContent(element.id)));

    canvas.onmousedown = onMouseDown;
    canvas.onmouseup = onMouseUp;
    canvas.onmousemove = onMouseMove;

    drawBoard();
}

function changeContent(id) {
    var containers = document.getElementsByClassName("content-container");
    Array.prototype.forEach.call(containers, element => element.style.display = "none");

    switch(id) {
        case "algorithmNav":
            document.getElementById("algorithmContainer").style.display = "block";
            break;
        case "gameNav":
            document.getElementById("gameContainer").style.display = "block";
            break;
        default:
            document.getElementById("homePageContainer").style.display = "block";
            break;
    }
}