// Tetris Game Implementation
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

// Game constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;
const COLORS = [
    '#000000', // Empty
    '#00FFFF', // I - Cyan
    '#0000FF', // J - Blue
    '#FFA500', // L - Orange
    '#FFFF00', // O - Yellow
    '#00FF00', // S - Green
    '#800080', // T - Purple
    '#FF0000'  // Z - Red
];

// Tetris pieces (tetrominoes)
const PIECES = [
    // I piece
    [
        [1, 1, 1, 1]
    ],
    // J piece
    [
        [2, 0, 0],
        [2, 2, 2]
    ],
    // L piece
    [
        [0, 0, 3],
        [3, 3, 3]
    ],
    // O piece
    [
        [4, 4],
        [4, 4]
    ],
    // S piece
    [
        [0, 5, 5],
        [5, 5, 0]
    ],
    // T piece
    [
        [0, 6, 0],
        [6, 6, 6]
    ],
    // Z piece
    [
        [7, 7, 0],
        [0, 7, 7]
    ]
];

// Game state
let board = [];
let currentPiece = null;
let nextPiece = null;
let currentX = 0;
let currentY = 0;
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let isPaused = false;
let dropTime = 0;
let dropInterval = 1000; // 1 second

// Initialize game
function init() {
    // Create empty board
    board = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        board[y] = [];
        for (let x = 0; x < BOARD_WIDTH; x++) {
            board[y][x] = 0;
        }
    }
    
    // Reset game state
    score = 0;
    level = 1;
    lines = 0;
    gameOver = false;
    isPaused = false;
    dropTime = 0;
    
    // Generate first pieces
    currentPiece = generatePiece();
    nextPiece = generatePiece();
    
    // Start at top center
    currentX = Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece[0].length / 2);
    currentY = 0;
    
    updateDisplay();
    gameLoop();
}

// Generate random piece
function generatePiece() {
    const pieceIndex = Math.floor(Math.random() * PIECES.length);
    return PIECES[pieceIndex].map(row => [...row]);
}

// Draw a cell
function drawCell(ctx, x, y, color) {
    ctx.fillStyle = COLORS[color];
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    if (color !== 0) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}

// Draw the board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw placed pieces
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            drawCell(ctx, x, y, board[y][x]);
        }
    }
    
    // Draw current piece
    if (currentPiece) {
        for (let y = 0; y < currentPiece.length; y++) {
            for (let x = 0; x < currentPiece[y].length; x++) {
                if (currentPiece[y][x] !== 0) {
                    drawCell(ctx, currentX + x, currentY + y, currentPiece[y][x]);
                }
            }
        }
    }
}

// Draw next piece
function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const offsetX = (4 - nextPiece[0].length) / 2;
        const offsetY = (4 - nextPiece.length) / 2;
        
        for (let y = 0; y < nextPiece.length; y++) {
            for (let x = 0; x < nextPiece[y].length; x++) {
                if (nextPiece[y][x] !== 0) {
                    nextCtx.fillStyle = COLORS[nextPiece[y][x]];
                    nextCtx.fillRect(
                        (offsetX + x) * CELL_SIZE, 
                        (offsetY + y) * CELL_SIZE, 
                        CELL_SIZE, 
                        CELL_SIZE
                    );
                    nextCtx.strokeStyle = '#333';
                    nextCtx.lineWidth = 1;
                    nextCtx.strokeRect(
                        (offsetX + x) * CELL_SIZE, 
                        (offsetY + y) * CELL_SIZE, 
                        CELL_SIZE, 
                        CELL_SIZE
                    );
                }
            }
        }
    }
}

// Check collision
function checkCollision(piece, x, y) {
    for (let py = 0; py < piece.length; py++) {
        for (let px = 0; px < piece[py].length; px++) {
            if (piece[py][px] !== 0) {
                const newX = x + px;
                const newY = y + py;
                
                // Check boundaries
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                    return true;
                }
                
                // Check collision with placed pieces
                if (newY >= 0 && board[newY][newX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Place piece on board
function placePiece() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] !== 0) {
                const boardY = currentY + y;
                const boardX = currentX + x;
                
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece[y][x];
                }
            }
        }
    }
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        let isLineFull = true;
        
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] === 0) {
                isLineFull = false;
                break;
            }
        }
        
        if (isLineFull) {
            // Remove the line
            board.splice(y, 1);
            // Add new empty line at top
            board.unshift(new Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++; // Check the same line again
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        
        // Scoring system
        const lineScores = [0, 40, 100, 300, 1200];
        score += lineScores[linesCleared] * level;
        
        // Level up every 10 lines
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(50, 1000 - (level - 1) * 50);
    }
}

// Rotate piece
function rotatePiece(piece) {
    const rows = piece.length;
    const cols = piece[0].length;
    const rotated = [];
    
    for (let x = 0; x < cols; x++) {
        rotated[x] = [];
        for (let y = rows - 1; y >= 0; y--) {
            rotated[x][rows - 1 - y] = piece[y][x];
        }
    }
    
    return rotated;
}

// Move piece
function movePiece(dx, dy) {
    if (!checkCollision(currentPiece, currentX + dx, currentY + dy)) {
        currentX += dx;
        currentY += dy;
        return true;
    }
    return false;
}

// Drop piece
function dropPiece() {
    if (!movePiece(0, 1)) {
        // Piece can't move down, place it
        placePiece();
        clearLines();
        
        // Get next piece
        currentPiece = nextPiece;
        nextPiece = generatePiece();
        currentX = Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece[0].length / 2);
        currentY = 0;
        
        // Check game over
        if (checkCollision(currentPiece, currentX, currentY)) {
            gameOver = true;
            document.getElementById('gameOver').style.display = 'block';
        }
    }
}

// Hard drop
function hardDrop() {
    while (movePiece(0, 1)) {
        score += 2;
    }
    dropPiece();
}

// Update display
function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

// Game loop
function gameLoop() {
    if (!gameOver && !isPaused) {
        const currentTime = Date.now();
        
        if (currentTime - dropTime > dropInterval) {
            dropPiece();
            dropTime = currentTime;
        }
    }
    
    drawBoard();
    drawNextPiece();
    updateDisplay();
    
    requestAnimationFrame(gameLoop);
}

// Restart game
function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    init();
}

// Key handling
document.addEventListener('keydown', (e) => {
    if (gameOver || isPaused) {
        if (e.key === 'p' || e.key === 'P') {
            isPaused = !isPaused;
        }
        return;
    }
    
    switch (e.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            dropPiece();
            dropTime = Date.now();
            break;
        case 'ArrowUp':
            const rotated = rotatePiece(currentPiece);
            if (!checkCollision(rotated, currentX, currentY)) {
                currentPiece = rotated;
            }
            break;
        case ' ':
            hardDrop();
            break;
        case 'p':
        case 'P':
            isPaused = !isPaused;
            break;
    }
});

// Start game
init();