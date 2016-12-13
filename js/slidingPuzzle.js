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

function initializeGame() {
    canvas.removeEventListener("click", initializeGame);
    //Clear
    game_won = false;
    clearCanvas();
    context.fillStyle = "rgb(234, 0, 130)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //Draw reset button
    context.fillStyle = "rgb(0, 28, 107)";
    context.fillRect(CELL_WIDTH*3 + CELL_WIDTH/3, CELL_HEIGHT*4 + CELL_HEIGHT/8, CELL_WIDTH + CELL_WIDTH/3, CELL_HEIGHT - (CELL_HEIGHT/4));
    context.fillStyle = "white";
    context.font = "10pt sans-serif";
    context.fillText("RESTART", CANVAS_WIDTH - (CELL_WIDTH), CANVAS_HEIGHT - (CELL_WIDTH / 2.5));
    //Get game board
    var board = getBoard();
    //Fill board with random numbers
    shuffleBoard(board);
    //Initialize the empty location
    emptyTileInitialize(board);
    //Get the image
    img = new Image();
    img.onload = function() {
        drawCells(board);
    };
    img.src = "../images/game/" + getImage() + ".jpg";
    //Start the actual game
    gamePlay(board);
}

function gamePlay(board) {
    //Wait until user clicks as long as we didn't win
    if (checkWon(board)) game_won = true;
    if (game_won) winCelebration();
    else {
        canvas.addEventListener("click", function(evt) {
            console.log("Cool");
            if (!clickReset(evt))
                slideCell(evt, board);
            else {
                evt.stopImmediatePropagation();
                initializeGame();
            }
        });
    }
}

function clickReset(evt){
    mousePos = getMouseXY(evt);
    buttonXStart = CELL_WIDTH*3 + CELL_WIDTH/3;
    buttonXEnd = CELL_WIDTH*3 + CELL_WIDTH/3 + CELL_WIDTH + CELL_WIDTH/3;
    buttonYStart = CELL_HEIGHT*4 + CELL_HEIGHT/8;
    buttonYEnd = CELL_HEIGHT*4 + CELL_HEIGHT/8 + CELL_HEIGHT - CELL_HEIGHT/4;
    if (mousePos.x >= buttonXStart && mousePos.x <= buttonXEnd && mousePos.y >= buttonYStart && mousePos.y <= buttonYEnd)
        return true;
    else return false;
}

function getBoard() {
    var board = new Array(GAME_CELLS);
    for (var i = 0; i < GAME_CELLS; i++) {
        board[i] = new Array(GAME_CELLS);
        for (var j = 0; j < GAME_CELLS; j++){
            board[i][j] = new Object();
            board[i][j].i = i;
            board[i][j].j = j;
            board[i][j].emptyLoc = false;
        }
    }
    return board;
}

function shuffleBoard(arr) {
    for (var i = 0; i < GAME_CELLS; i++){
        for (var j = 0; j < GAME_CELLS; j++){
            var x = Math.floor(Math.random() * GAME_CELLS);
            var y = Math.floor(Math.random() * GAME_CELLS);
            var t = arr[i][j];
            arr[i][j] = arr[y][x];
            arr[y][x] = t;
        }
    }
}

function emptyTileInitialize(arr) {
    var x = Math.floor(Math.random() * GAME_CELLS);
    var y = Math.floor(Math.random() * GAME_CELLS);
    arr[y][x].emptyLoc = true;
}

function getImage() {
    return Math.floor(Math.random() * 5);
}

function drawCells(board) {
    var img_cell_width = img.width / GAME_CELLS;
    var img_cell_height = img.height / GAME_CELLS;
    for (var i = 1; i <= GAME_CELLS; i++) {
        for (var j = 1; j <= GAME_CELLS; j++) {
            var y = board[i - 1][j - 1].i + 1;
            var x = board[i - 1][j - 1].j + 1;
            if (board[i - 1][j -1 ].emptyLoc) {
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

function slideCell(e, arr) {
    if (!game_won) {
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
                if (arr[gridPos.i - 1][gridPos.j].emptyLoc)
                    swapCells(arr, gridPos.i, gridPos.j, "top");
            }
            //Bottom
            if (gridPos.i < GAME_CELLS - 1) {
                if (arr[gridPos.i + 1][gridPos.j].emptyLoc)
                    swapCells(arr, gridPos.i, gridPos.j, "bottom");
            }
            //Right
            if (gridPos.j < GAME_CELLS - 1) {
                if (arr[gridPos.i][gridPos.j + 1].emptyLoc)
                    swapCells(arr, gridPos.i, gridPos.j, "right");
            }
            //Left
            if (gridPos.j > 0) {
                if (arr[gridPos.i][gridPos.j - 1].emptyLoc)
                    swapCells(arr, gridPos.i, gridPos.j, "left");
            }
        } else console.log("Garbage click at : " + gridPos.i.toString() + gridPos.j.toString());
        game_won = checkWon(arr);
        drawCells(arr);
    } else {
        //User won
        //stop listeneing to user clicks in grid
        canvas.removeEventListener("click", function(evt) {
            console.log("Cool");
            if (!clickReset(evt))
                slideCell(evt, board);
            else {
                evt.stopImmediatePropagation()
                initializeGame();
            }
        });
        winCelebration();
    }
    
}

function swapCells(arr, i, j, posTo){
    if (posTo == "top") {
        var t = arr[i][j];
        arr[i][j] = arr[i-1][j];
        arr[i-1][j] = t;
    }
    else if (posTo == "bottom") {
        var t = arr[i][j];
        arr[i][j] = arr[i+1][j];
        arr[i+1][j] = t;
    }
    else if (posTo == "right") {
        var t = arr[i][j];
        arr[i][j] = arr[i][j+1];
        arr[i][j+1] = t;
    }
    else if (posTo == "left") {
        var t = arr[i][j];
        arr[i][j] = arr[i][j-1];
        arr[i][j-1] = t;
    }
}

function checkWon(arr){
    var flag = true;
    for (var i = 0; i < GAME_CELLS; i++){
        for (var j = 0; j < GAME_CELLS; j++){
            if (arr[i][j].i != i || arr[i][j].j != j)
                flag = false;
        }
    }
    return flag;
}

//Where all the magic takes place
var canvas = document.getElementById("sliding_puzzle");
var context = canvas.getContext("2d");
//Global constants
const CANVAS_HEIGHT = 300
const CANVAS_WIDTH = 300
const NUM_CELLS = 5;
const GAME_CELLS = 3;
const CELL_WIDTH = CANVAS_WIDTH / NUM_CELLS;
const CELL_HEIGHT = CANVAS_HEIGHT / NUM_CELLS;
var game_won = false;
var img;
var celebImg;
var celebrationImg = "../images/game_win_1.png";
//Start the magic show
splashScreen()
canvas.addEventListener("click", initializeGame);