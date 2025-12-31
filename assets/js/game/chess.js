
const chessBoard = document.getElementById('chess-board');
function setupChess() {
    const placeholders = ['tictactoe-board'];
    placeholders.forEach(id => {
        const placeholder = document.getElementById(id);
        if (placeholder) placeholder.style.display = 'none';
    });

    // 显示棋盘
    chessBoard.style.display = 'grid';

    drawBoard();
}
const BOARD_WIDTH = 9;
const BOARD_HEIGHT = 10;
const CELL_SIZE = 60;

const PIECES = {
    'R': '車', 'H': '馬', 'E': '象', 'A': '士', 'G': '將', 'C': '炮', 'P': '兵',
    'r': '車', 'h': '馬', 'e': '相', 'a': '仕', 'g': '帥', 'c': '砲', 'p': '卒'
};

// Initial board setup (standard Chinese Chess starting position)
const initialBoard = [
    ['R', 'H', 'E', 'A', 'G', 'A', 'E', 'H', 'R'],
    ['', '', '', '', '', '', '', '', ''],
    ['', 'C', '', '', '', '', '', 'C', ''],
    ['P', '', 'P', '', 'P', '', 'P', '', 'P'],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['p', '', 'p', '', 'p', '', 'p', '', 'p'],
    ['', 'c', '', '', '', '', '', 'c', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['r', 'h', 'e', 'a', 'g', 'a', 'e', 'h', 'r']
];

let board = JSON.parse(JSON.stringify(initialBoard));
let selectedPiece = null;
let currentTurn = 'red';

const boardElement = document.getElementById('chess-board');
const statusElement = document.getElementById('status');

function drawBoard() {
    // Clear board
    boardElement.innerHTML = '';

    // Draw horizontal lines
    for (let y = 0; y <= 9; y++) {
        const line = document.createElement('div');
        line.classList.add('line', 'horizontal');
        line.style.top = `${y * CELL_SIZE + 30}px`; // Offset for center
        boardElement.appendChild(line);
    }

    // Draw vertical lines
    for (let x = 0; x <= 8; x++) {
        const line = document.createElement('div');
        line.classList.add('line', 'vertical');
        line.style.left = `${x * CELL_SIZE + 30}px`;
        boardElement.appendChild(line);
    }

    // River label (simplified, assuming Chinese characters)
    const river = document.createElement('div');
    river.id = 'river';
    river.innerText = '楚河          漢界';
    boardElement.appendChild(river);

    // 将十字
    const blackPalaceX1 = document.createElement('div');
    blackPalaceX1.classList.add('palace-cross');
    blackPalaceX1.style.left = `${3 * CELL_SIZE + 30}px`;
    blackPalaceX1.style.top = `${0 * CELL_SIZE + 30}px`;
    boardElement.appendChild(blackPalaceX1);

    const blackPalaceX2 = document.createElement('div');
    blackPalaceX2.classList.add('palace-cross', 'palace-cross2');
    blackPalaceX2.style.left = `${5 * CELL_SIZE + 30}px`;
    blackPalaceX2.style.top = `${0 * CELL_SIZE + 30}px`;
    boardElement.appendChild(blackPalaceX2);

    // 帅十字
    const redPalaceX1 = document.createElement('div');
    redPalaceX1.classList.add('palace-cross');
    redPalaceX1.style.left = `${3 * CELL_SIZE + 30}px`;
    redPalaceX1.style.top = `${7 * CELL_SIZE + 30}px`;
    boardElement.appendChild(redPalaceX1);

    const redPalaceX2 = document.createElement('div');
    redPalaceX2.classList.add('palace-cross', 'palace-cross2');
    redPalaceX2.style.left = `${5 * CELL_SIZE + 30}px`;
    redPalaceX2.style.top = `${7 * CELL_SIZE + 30}px`;
    boardElement.appendChild(redPalaceX2);

    // Draw pieces
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const type = board[y][x];
            if (type) {
                const piece = document.createElement('div');
                piece.classList.add('piece');
                piece.classList.add(isRed(type) ? 'red' : 'black');
                piece.innerText = PIECES[type];
                piece.style.left = `${x * CELL_SIZE + 5}px`; // Center in cell
                piece.style.top = `${y * CELL_SIZE + 5}px`;
                piece.dataset.x = x;
                piece.dataset.y = y;
                piece.addEventListener('click', onPieceClick);
                boardElement.appendChild(piece);
            }
        }
    }
}

function isRed(type) {
    return type === type.toUpperCase();
}

function onPieceClick(event) {
    const piece = event.target;
    const x = parseInt(piece.dataset.x);
    const y = parseInt(piece.dataset.y);
    const type = board[y][x];

    if (selectedPiece) {
        const sx = parseInt(selectedPiece.dataset.x);
        const sy = parseInt(selectedPiece.dataset.y);

        if (isValidMove(sx, sy, x, y, board[sy][sx])) {
            // Move piece
            if (board[y][x]) {
                // Eat
                const eatenPiece = Array.from(boardElement.children).find(p => 
                    parseInt(p.dataset.x) === x && parseInt(p.dataset.y) === y
                );
                if (eatenPiece) {
                    eatenPiece.classList.add('eaten');
                    setTimeout(() => eatenPiece.remove(), 500);
                }
            }

            board[y][x] = board[sy][sx];
            board[sy][sx] = '';

            // Animate movement
            selectedPiece.classList.add('moving');
            selectedPiece.style.left = `${x * CELL_SIZE + 5}px`;
            selectedPiece.style.top = `${y * CELL_SIZE + 5}px`;
            selectedPiece.dataset.x = x;
            selectedPiece.dataset.y = y;

            selectedPiece.classList.remove('selected');
            selectedPiece = null;

            currentTurn = currentTurn === 'red' ? 'black' : 'red';
            statusElement.innerText = `${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}'s turn`;

            checkGameOver();
        } else {
            selectedPiece.classList.remove('selected');
            if (isRed(type) === (currentTurn === 'red') && type) {
                piece.classList.add('selected');
                selectedPiece = piece;
            } else {
                selectedPiece = null;
            }
        }
    } else {
        if (isRed(type) === (currentTurn === 'red') && type) {
            piece.classList.add('selected');
            selectedPiece = piece;
        }
    }
}

// Simplified validation (full rules would be more complex)
function isValidMove(sx, sy, tx, ty, type) {
    if (tx < 0 || tx >= BOARD_WIDTH || ty < 0 || ty >= BOARD_HEIGHT) return false;
    const target = board[ty][tx];
    if (target && isRed(target) === isRed(type)) return false; // Same side

    const dx = Math.abs(tx - sx);
    const dy = Math.abs(ty - sy);

    switch (type.toUpperCase()) {
        case 'R': // Rook
            if (dx !== 0 && dy !== 0) return false;
            return noPiecesBetween(sx, sy, tx, ty);
        case 'H': // Horse
            if (!((dx === 1 && dy === 2) || (dx === 2 && dy === 1))) return false;
            // Check leg not blocked
            const legX = dx === 1 ? 0 : (tx > sx ? 1 : -1);
            const legY = dy === 1 ? 0 : (ty > sy ? 1 : -1);
            return !board[sy + legY][sx + legX];
        case 'E': // Elephant
            if (dx !== 2 || dy !== 2) return false;
            // Check eye not blocked
            const eyeX = (tx + sx) / 2;
            const eyeY = (ty + sy) / 2;
            if (!board[eyeY][eyeX]) {
                // Boundary for elephant
                const isRedPiece = isRed(type);
                if (isRedPiece && ty < 5) return false;
                if (!isRedPiece && ty > 4) return false;
                return true;
            }
            return false;
        case 'A': // Advisor
            if (dx !== 1 || dy !== 1) return false;
            // Palace boundary
            if (tx < 3 || tx > 5 || (isRed(type) ? ty > 2 : ty < 7)) return false;
            return true;
        case 'G': // General
            if (dx > 1 || dy > 1 || (dx === 0 && dy === 0)) return false;
            // Palace boundary
            if (tx < 3 || tx > 5 || (isRed(type) ? ty > 2 : ty < 7)) return false;
            // Flying general check (simplified, no direct face)
            return true;
        case 'C': // Cannon
            if (dx !== 0 && dy !== 0) return false;
            const piecesBetween = countPiecesBetween(sx, sy, tx, ty);
            if (target) return piecesBetween === 1; // Eat with one over
            return piecesBetween === 0; // Move empty
        case 'P': // Pawn
            const forward = isRed(type) ? -1 : 1;
            if (dy === 0 && dx === 1) { // Side after river
                const crossedRiver = isRed(type) ? sy <= 4 : sy >= 5;
                return crossedRiver;
            }
            if (dx !== 0 || dy !== forward) return false;
            return true;
        default:
            return false;
    }
}

function noPiecesBetween(sx, sy, tx, ty) {
    return countPiecesBetween(sx, sy, tx, ty) === 0;
}

function countPiecesBetween(sx, sy, tx, ty) {
    let count = 0;
    const dx = tx === sx ? 0 : (tx > sx ? 1 : -1);
    const dy = ty === sy ? 0 : (ty > sy ? 1 : -1);
    let x = sx + dx;
    let y = sy + dy;
    while (x !== tx || y !== ty) {
        if (board[y][x]) count++;
        x += dx;
        y += dy;
    }
    return count;
}

function checkGameOver() {
    // Simple check if general is eaten (full check would include checkmate)
    let redGeneral = false;
    let blackGeneral = false;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] === 'G') blackGeneral = true;
            if (board[y][x] === 'g') redGeneral = true;
        }
    }
    if (!redGeneral) {
        statusElement.innerText = 'Black wins!';
        removeAllListeners();
    }
    if (!blackGeneral) {
        statusElement.innerText = 'Red wins!';
        removeAllListeners();
    }
}

function removeAllListeners() {
    const pieces = document.querySelectorAll('.piece');
    pieces.forEach(p => p.removeEventListener('click', onPieceClick));
}
