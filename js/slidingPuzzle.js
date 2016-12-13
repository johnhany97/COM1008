//Where all the magic takes place
var canvas = document.getElementById("sliding_puzzle");
var context = canvas.getContext("2d");
//Global constants
const CANVAS_HEIGHT = canvas.height
const CANVAS_WIDTH = canvas.width
const NUM_CELLS = 5;
const GAME_CELLS = 3;
const CELL_WIDTH = CANVAS_WIDTH / NUM_CELLS;
const CELL_HEIGHT = CANVAS_HEIGHT / NUM_CELLS;
var board;
var requestId;
var celebImg;
var celebStatus = 0;

/*
 * Game Status
 * 0 => Splash Screen
 * 1 => Playing game & Hasn't won
 * 2 => Won Game
 */
var game_status = 0;

splashScreen();

canvas .addEventListener("click", function(evt) {
    if (game_status == 0){
        initializeGame();
        if (checkWon()) drawCells();
    } else if (game_status == 1){
        if (checkWon()) game_status = 2;
        if (clickReset(evt)){
            initializeGame();
        } else slideCell(evt);
    } else if (game_status == 2) {
        if (!clickReset(evt)) {
            start();
        } else {
            initializeGame();
            cancelAnimationFrame(requestId);
        }
    }
}, false);

/*
 * Function to display a splash screen
 *
 */
function splashScreen() {
    // Background colour
    context.fillStyle = "rgb(17, 128, 221)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Title
    context.font = "30pt sans-serif";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText("Sliding Puzzle", CANVAS_HEIGHT / 2, CANVAS_HEIGHT / 2);
    // Author
    context.font = "15pt sans-serif";
    context.fillStyle= "black";
    context.textAlign = "center";
    context.fillText("Click to continue", CANVAS_HEIGHT / 2, (CANVAS_HEIGHT / 2) + (CANVAS_HEIGHT / 4));
}

/*
 * Function to initialize game variables
 *
 */
function initializeGame() {
    canvas.removeEventListener("click", initializeGame, false);
    //Clear
    game_status = 1;
    clearCanvas();
    context.fillStyle = "rgb(234, 0, 130)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //Draw Reset Button
    drawResetButton();
    //Get game board
    board = getBoard();
    //Fill board with random numbers
    shuffleBoard();
    //Initialize the empty location
    emptyTileInitialize(board);
    //Get the image
    img = new Image();
    img.onload = function() {
        drawCells();
    };
    img.src = "../images/game/" + Math.floor(Math.random() * 5) + ".jpg";
    if (checkWon()) {
        //draw the cells again
        drawCells();
        game_status = 2;
    }
}

/*
 * Function to return a fresh board
 *
 * Returns:
 *      2D array of objects
 *
 */
function getBoard() {
    var board = new Array(GAME_CELLS);
    for (var i = 0; i < GAME_CELLS; i++) {
        board[i] = new Array(GAME_CELLS);
        for (var j = 0; j < GAME_CELLS; j++){
            board[i][j] = new Object();
			//Represent row
            board[i][j].i = i;
			//Represent col
            board[i][j].j = j;
			//Whether or not it's the empty cell (initialize all to false)
            board[i][j].emptyLoc = false;
        }
    }
    return board;
}

/*
 * Function to draw cells on the canvas
 *
 */
function drawCells() {
    var img_cell_width = img.width / GAME_CELLS;
    var img_cell_height = img.height / GAME_CELLS;
    for (var i = 1; i <= GAME_CELLS; i++) {
        for (var j = 1; j <= GAME_CELLS; j++) {
            var y = board[i - 1][j - 1].i + 1;
            var x = board[i - 1][j - 1].j + 1;
            if (board[i - 1][j -1 ].emptyLoc && game_status != 2) {
                context.fillStyle = "black"
                context.fillRect(j * CELL_WIDTH, i * CELL_HEIGHT,CELL_WIDTH, CELL_HEIGHT);
            }
            else {
                context.drawImage(img, (x - 1) * img_cell_width, (y - 1) * img_cell_height, img_cell_width, img_cell_height, j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT)
            }
            context.strokeRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
        }
    }
}

/*
 * Function to shuffle the 2D board array
 *
 */
function shuffleBoard() {
    for (var i = 0; i < GAME_CELLS; i++){
        for (var j = 0; j < GAME_CELLS; j++){
			//Random cell
            var x = Math.floor(Math.random() * GAME_CELLS);
            var y = Math.floor(Math.random() * GAME_CELLS);
			//Swap current with the random cell
            var t =board[i][j];
            board[i][j] = board[y][x];
            board[y][x] = t;
        }
    }
}

/*
 * Function to initialize one cell to become an empty cell
 *
 */
function emptyTileInitialize() {
    var x = Math.floor(Math.random() * GAME_CELLS);
    var y = Math.floor(Math.random() * GAME_CELLS);
    board[y][x].emptyLoc = true;
}

/*
 * Function to return which grid cell is the mouse currently in
 *
 * Paramters:
 * 		x => Mouse X Position
 *      y => Mouse Y Position
 *
 * Returns:
 *      Object containing i and j representing index of cell in a 2d array
 *
 */
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
/*
 * Function to clear the canvas
 *
 */
function clearCanvas() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/*
 * Function to return the mouse co-ordinates
 *
 * Paramters:
 * 		e => Event details on click
 *
 * Returns:
 *      Object containing x and y representing co ordinates of mouse click
 *
 */
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

/*
 * Function to slide a cell
 *
 * Paramters:
 * 		e => Event details on click
 *
 */
function slideCell(e){
    //User didn't win yet
    //Where did he hit
    var mousePos = getMouseXY(e);
    //Which cell in the grid (if within the grid)
    var gridPos = whichGridCell(mousePos.x, mousePos.y);
    gridPos.i -= 1;
    gridPos.j -= 1;
    //Check if cell clicked is next to an empty Loc
    if (gridPos.i >= 0 && gridPos.i < GAME_CELLS && gridPos.j >= 0 && gridPos.j < GAME_CELLS) {
        //Top
        if (gridPos.i > 0) {
            if (board[gridPos.i - 1][gridPos.j].emptyLoc)
                swapCells(gridPos.i, gridPos.j, "top");
        }
        //Bottom
        if (gridPos.i < GAME_CELLS - 1) {
            if (board[gridPos.i + 1][gridPos.j].emptyLoc)
                swapCells(gridPos.i, gridPos.j, "bottom");
        }
        //Right
        if (gridPos.j < GAME_CELLS - 1) {
            if (board[gridPos.i][gridPos.j + 1].emptyLoc)
                swapCells(gridPos.i, gridPos.j, "right");
        }
        //Left
        if (gridPos.j > 0) {
            if (board[gridPos.i][gridPos.j - 1].emptyLoc)
                swapCells(gridPos.i, gridPos.j, "left");
        }
    }
    if (checkWon()) game_status = 2;
    drawCells();
}

/*
 * Function to actually swap the cells in the wanted direction
 *
 * Paramters:
 *      i => Cell Pressed row
 *      j => Cell pressed col
 *      posTo => Location to swap with
 *
 */
function swapCells(i, j, posTo){
    if (posTo == "top") {
        var t = board[i][j];
        board[i][j] = board[i-1][j];
        board[i-1][j] = t;
    }
    else if (posTo == "bottom") {
        var t = board[i][j];
        board[i][j] = board[i+1][j];
        board[i+1][j] = t;
    }
    else if (posTo == "right") {
        var t = board[i][j];
        board[i][j] = board[i][j+1];
        board[i][j+1] = t;
    }
    else if (posTo == "left") {
        var t = board[i][j];
        board[i][j] = board[i][j-1];
        board[i][j-1] = t;
    }
}

/*
 * Function to confirm whether a click was on the reset button or not
 *
 * Paramters:
 * 		evt => Event details on click
 *
 * Returns:
 *      boolean representing whether or not click was inside the button
 *
 */
function clickReset(evt){
	// Get Mouse Position
    mousePos = getMouseXY(evt);
	// Button X co-ordinates
    buttonXStart = CELL_WIDTH*3 + CELL_WIDTH/3;
    buttonXEnd = CELL_WIDTH*3 + CELL_WIDTH/3 + CELL_WIDTH + CELL_WIDTH/3;
	// Button Y Co-ordinates
    buttonYStart = CELL_HEIGHT*4 + CELL_HEIGHT/8;
    buttonYEnd = CELL_HEIGHT*4 + CELL_HEIGHT/8 + CELL_HEIGHT - CELL_HEIGHT/4;
	// Compare
    if (mousePos.x >= buttonXStart && mousePos.x <= buttonXEnd && mousePos.y >= buttonYStart && mousePos.y <= buttonYEnd)
        return true;
    else return false;
}

/*
 * Function to check wether the user has won or not
 *
 * Returns:
 *      boolean representing whether the user won or not
 *
 */
function checkWon(){
    var flag = true;
    for (var i = 0; i < GAME_CELLS; i++){
        for (var j = 0; j < GAME_CELLS; j++){
            if (board[i][j].i != i || board[i][j].j != j)
                flag = false;
        }
    }
    return flag;
}

function drawResetButton() {
    //Draw reset button
    context.fillStyle = "rgb(0, 28, 107)";
    context.fillRect(CELL_WIDTH*3 + CELL_WIDTH/3, CELL_HEIGHT*4 + CELL_HEIGHT/8, CELL_WIDTH + CELL_WIDTH/3, CELL_HEIGHT - (CELL_HEIGHT/4));
    context.fillStyle = "white";
    context.font = "10pt sans-serif";
    context.fillText("RESTART", CANVAS_WIDTH - (CELL_WIDTH), CANVAS_HEIGHT - (CELL_WIDTH / 2.5));
}

function start(){
    draw();
    nextFrame();
}

function draw() {
    //Clear Screen
    clearCanvas();
    //Draw Background
    context.fillStyle = "rgb(234, 0, 130)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //Draw Reset Button
    drawResetButton();
    //Draw new Win Animation
    celebImg = new Image();
    celebImg.onload = function() {
      context.drawImage(celebImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);  
    };
    if (celebStatus == 0) celebImg.src = "../images/game/game_win_0.png";
    else celebImg.src =  "../images/game/game_win_1.png";
}

function update() {
    if (celebStatus == 0) celebStatus = 1;
    else celebStatus = 0;
}

function nextFrame() {
    setTimeout(function() {
        requestId = requestAnimationFrame (nextFrame);
        update();
        draw();
    }, 1000);
}