function whichGridCell(x, y) {
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x >= CANVAS_WIDTH) x = CANVAS_WIDTH - 1;
    if (y >= CANVAS_HEIGHT) y = CANVAS_HEIGHT - 1;
    var gx = Math.floor(x / CELL_WIDTH);
    var gy = Math.floor(y / CELL_HEIGHT);
    // need to be careful here
    // x, y on screen is j,i in grid
    return {j: gx, i: gy};
}

function clearCanvas() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function getMouseXY(e) {
    var boundingRect = canvas.getBoundingClientRect();
    var offsetX = boundingRect.left;
    var offsetY = boundingRect.top;
    var w = (boundingRect.width - CANVAS_WIDTH) / 2;
    var h = (boundingRect.height - CANVAS_HEIGHT) / 2;
    offsetX += w;
    offsetY += h;
    // use clientX and clientY as getBoundingClientRect is used above
    var mx = Math.round(e.clientX - offsetX);
    var my = Math.round(e.clientY - offsetY);
    return {x: mx, y: my}; // return as an object
}

function drawGrid() {
    context.strokeStyle = "rgb(100, 100, 100)";
    context.lineWidth = "1";
    for (var x = 0; x < CANVAS_WIDTH; x += CELL_WIDTH) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, CANVAS_WIDTH);
        context.stroke();
    }
    for (var y = 0; y < CANVAS_HEIGHT; y += CELL_HEIGHT) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(CANVAS_HEIGHT, y);
        context.stroke();
    }
}

function splashScreen() {
    // Background colour
    context.fillStyle = "rgb(17, 128, 221)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Title
    context.font = "30pt sans-serif";
    context.fillStyle = "white";
    context.fillText("Match the Pairs", 15, 130);
    // Author
    context.font = "15pt sans-serif";
    context.fillStyle= "black";
    context.fillText("Click to continue", 75, 190);

drawGrid();
}

function mainMenu() {
    //Clear
    clearCanvas();
    context.fillStyle = "rgb(234, 0, 130)";
    //TOP
    context.fillRect(0, 0, CANVAS_WIDTH, CELL_HEIGHT);
    //BOTTOM
    context.fillRect(0, CELL_HEIGHT * (NUM_CELLS - 1), CANVAS_WIDTH, CELL_HEIGHT);
    //Left
    context.fillRect(0, 0, CELL_HEIGHT, CANVAS_HEIGHT);
    //Right
    context.fillRect(CELL_HEIGHT * (NUM_CELLS - 1), 0, CELL_HEIGHT, CANVAS_HEIGHT);
    //Draw the blocks
    for (var i = 1; i <= 4; i++){
        for (var j = 1; j <= 4; j++){
            drawBlock(CELL_WIDTH * j, CELL_HEIGHT * i);
        }
    }
    //Generate the background 2D array
    var arr = Array.new(4);
    for (var i = 0; i < 4; i++){
        arr[i] = Array.new(4);
    }
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            //SOMETHING TO HAVE A RANDOM ARRAY
        }
    }
}

function drawBlock(x, y){
    var block_img = new Image();
    
    block_img.onload = function() {
        context.drawImage(block_img, x, y);
    };
    block_img.src = "../images/block.png";
}
//Where all the magic takes place
var canvas = document.getElementById("match_pairs");
var context = canvas.getContext("2d");
//Global constants
const CANVAS_HEIGHT = 300
const CANVAS_WIDTH = 300
const NUM_CELLS = 6;
const CELL_WIDTH = CANVAS_WIDTH / NUM_CELLS;
const CELL_HEIGHT = CANVAS_HEIGHT / NUM_CELLS;
//Start the magic show
splashScreen()
canvas.addEventListener("click", mainMenu);