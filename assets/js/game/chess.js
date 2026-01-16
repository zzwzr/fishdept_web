const chessBoard = document.getElementById('chess-board');

const BOARD_WIDTH = 9;  // 9列
const BOARD_HEIGHT = 10; // 10行
const CELL_SIZE = 60;

let isFlipped = false;

const PIECES = {
    'R': '俥', 'H': '傌', 'E': '相', 'A': '仕', 'G': '帥', 'C': '炮', 'P': '兵',
    'r': '車', 'h': '馬', 'e': '象', 'a': '士', 'g': '將', 'c': '砲', 'p': '卒'
};

// 初始棋盘设置
const initialBoard = [
    ['r', 'h', 'e', 'a', 'g', 'a', 'e', 'h', 'r'],
    ['', '', '', '', '', '', '', '', ''],
    ['', 'c', '', '', '', '', '', 'c', ''],
    ['p', '', 'p', '', 'p', '', 'p', '', 'p'],
    ['', '', '', '', '', '', '', '', ''],

    ['', '', '', '', '', '', '', '', ''],
    ['P', '', 'P', '', 'P', '', 'P', '', 'P'],
    ['', 'C', '', '', '', '', '', 'C', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['R', 'H', 'E', 'A', 'G', 'A', 'E', 'H', 'R']
];

let board = JSON.parse(JSON.stringify(initialBoard));
let selectedPiece = null;

function renderChessBoard(newBoard) {
    if (!Array.isArray(newBoard) || newBoard.length === 0) return;

    setActiveTab('chess');
    document.getElementById('game-title').textContent = '象棋';

    isFlipped = (window.settings?.currentRoom?.p === 'B');

    board = JSON.parse(JSON.stringify(newBoard));
    setupChess();
    drawPieces();
}

// 检查是否是红方棋子
function isRed(type) {
    return type === type.toUpperCase();
}

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

function drawPieces() {
    document.querySelectorAll('.chess-piece').forEach(p => p.remove());

    for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
            const type = board[row][col];
            if (!type) continue;

            createPiece(
                viewRow(row),
                viewCol(col),
                row,       // 实际行
                col,       // 实际列
                type
            );
        }
    }
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    console.log(`请求移动: (${fromRow},${fromCol}) -> (${toRow},${toCol})`);

    wsSend({
        type: 'MOVE',
        room_id: roomIdElement.textContent,
        from_row: fromRow,
        from_col: fromCol,
        to_row: toRow,
        to_col: toCol
    });
}

// 处理棋子点击的函数
function onPieceClick(row, col, type) {
    const room = window.settings?.currentRoom;

    if (isRed(type) === (room.p === 'R')) {
        clearSelected();

        selectedPiece = document.querySelector(
            `.chess-piece[data-row="${row}"][data-col="${col}"]`
        );
        selectedPiece?.classList.add('selected');
    } else if (selectedPiece) {
        const fromRow = +selectedPiece.dataset.row;
        const fromCol = +selectedPiece.dataset.col;

        if (isValidMove(fromRow, fromCol, row, col, selectedPiece.dataset.type)) {
            movePiece(fromRow, fromCol, row, col);
        } else {
            clearSelected();
        }
    }
}

function clearSelected() {
    if (selectedPiece) {
        selectedPiece.classList.remove('selected');
        selectedPiece = null;
    }
}

// 行列坐标翻转函数
function viewRow(row) {
    return isFlipped ? BOARD_HEIGHT - 1 - row : row;
}

function viewCol(col) {
    return isFlipped ? BOARD_WIDTH - 1 - col : col;
}

function chessMove({ from_row, from_col, to_row, to_col }) {
    console.log(`动画移动: (${from_row},${from_col}) -> (${to_row},${to_col})`);

    const movingPiece = document.querySelector(
        `.chess-piece[data-row="${from_row}"][data-col="${from_col}"]`
    );
    if (!movingPiece) return;

    const eatenPiece = document.querySelector(
        `.chess-piece[data-row="${to_row}"][data-col="${to_col}"]`
    );
    if (eatenPiece) {
        eatenPiece.classList.add('eaten');
        setTimeout(() => eatenPiece.remove(), 200);
    }

    movingPiece.dataset.row = to_row;
    movingPiece.dataset.col = to_col;

    const vRow = viewRow(to_row);
    const vCol = viewCol(to_col);

    movingPiece.style.left = `${vCol * CELL_SIZE}px`;
    movingPiece.style.top  = `${vRow * CELL_SIZE}px`;

    board[to_row][to_col] = board[from_row][from_col];
    board[from_row][from_col] = '';

    clearSelected();
}


// 绘制九宫格斜线
function drawPalaceLines() {
    // 黑方九宫格（上方）
    // 左上到右下
    const blackDiagonal1 = document.createElement('div');
    blackDiagonal1.className = 'board-line diagonal-line';
    blackDiagonal1.style.top = `${0 * CELL_SIZE}px`;
    blackDiagonal1.style.left = `${3 * CELL_SIZE}px`;
    blackDiagonal1.style.width = `${Math.sqrt(2) * 2 * CELL_SIZE}px`;
    blackDiagonal1.style.transform = 'rotate(45deg)';
    blackDiagonal1.style.transformOrigin = 'top left';
    chessBoard.appendChild(blackDiagonal1);
    
    // 左下到右上
    const blackDiagonal2 = document.createElement('div');
    blackDiagonal2.className = 'board-line diagonal-line';
    blackDiagonal2.style.top = `${2 * CELL_SIZE}px`;
    blackDiagonal2.style.left = `${3 * CELL_SIZE}px`;
    blackDiagonal2.style.width = `${Math.sqrt(2) * 2 * CELL_SIZE}px`;
    blackDiagonal2.style.transform = 'rotate(-45deg)';
    blackDiagonal2.style.transformOrigin = 'top left';
    chessBoard.appendChild(blackDiagonal2);
    
    // 红方九宫格（下方）
    // 左上到右下
    const redDiagonal1 = document.createElement('div');
    redDiagonal1.className = 'board-line diagonal-line';
    redDiagonal1.style.top = `${7 * CELL_SIZE}px`;
    redDiagonal1.style.left = `${3 * CELL_SIZE}px`;
    redDiagonal1.style.width = `${Math.sqrt(2) * 2 * CELL_SIZE}px`;
    redDiagonal1.style.transform = 'rotate(45deg)';
    redDiagonal1.style.transformOrigin = 'top left';
    chessBoard.appendChild(redDiagonal1);
    
    // 左下到右上
    const redDiagonal2 = document.createElement('div');
    redDiagonal2.className = 'board-line diagonal-line';
    redDiagonal2.style.top = `${9 * CELL_SIZE}px`;
    redDiagonal2.style.left = `${3 * CELL_SIZE}px`;
    redDiagonal2.style.width = `${Math.sqrt(2) * 2 * CELL_SIZE}px`;
    redDiagonal2.style.transform = 'rotate(-45deg)';
    redDiagonal2.style.transformOrigin = 'top left';
    chessBoard.appendChild(redDiagonal2);
}

// 创建棋盘格子
function createBoardGrid() {
    // 清除棋盘
    chessBoard.innerHTML = '';
    
    // 设置棋盘大小
    chessBoard.style.width = `${BOARD_WIDTH * CELL_SIZE}px`;
    chessBoard.style.height = `${BOARD_HEIGHT * CELL_SIZE}px`;
    
    // 创建所有格子（主要用于点击区域）
    for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
            const cell = document.createElement('div');
            cell.className = 'chess-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // 设置格子位置和大小
            cell.style.position = 'absolute';
            cell.style.left = `${col * CELL_SIZE - CELL_SIZE/2}px`;
            cell.style.top = `${row * CELL_SIZE - CELL_SIZE/2}px`;
            cell.style.width = `${CELL_SIZE}px`;
            cell.style.height = `${CELL_SIZE}px`;

            // 添加楚河汉界标记
            if (row === 4 || row === 5) {
                cell.classList.add('river');
            }

            // 添加点击事件
            cell.addEventListener('click', () => onCellClick(row, col));
            chessBoard.appendChild(cell);
        }
    }
}

// 在 drawBoard 函数中添加棋盘容器尺寸调整
function drawBoard() {

    createBoardGrid();

    // 设置棋盘容器精确尺寸
    chessBoard.style.width = `${(BOARD_WIDTH - 1) * CELL_SIZE}px`;
    chessBoard.style.height = `${(BOARD_HEIGHT - 1) * CELL_SIZE}px`;
    drawBoardLines();
    addRiverText();
}

// 确保线条长度正确
function drawBoardLines() {
    // 清除之前的线条
    document.querySelectorAll('.board-line').forEach(line => line.remove());
    
    const boardWidth = (BOARD_WIDTH - 1) * CELL_SIZE;
    const boardHeight = (BOARD_HEIGHT - 1) * CELL_SIZE;
    
    // 横线
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        const line = document.createElement('div');
        line.className = 'board-line horizontal-line';
        line.style.top = `${i * CELL_SIZE}px`;
        line.style.left = '0';
        line.style.width = `${boardWidth}px`;
        chessBoard.appendChild(line);
    }
    
    // 竖线
    for (let i = 0; i < BOARD_WIDTH; i++) {
        const line = document.createElement('div');
        line.className = 'board-line vertical-line';
        line.style.left = `${i * CELL_SIZE}px`;
        line.style.top = '0';
        line.style.height = `${boardHeight}px`;
        chessBoard.appendChild(line);
    }
    
    // 绘制九宫格斜线
    drawPalaceLines();
}

// 函数中的位置计算
function addRiverText() {
    // 楚河
    const chuhe = document.createElement('div');
    chuhe.className = 'river-text chuhe';
    chuhe.textContent = '楚 河';
    chuhe.style.left = `${CELL_SIZE * 2.5}px`;
    chuhe.style.top = `${CELL_SIZE * 4.5}px`;
    chessBoard.appendChild(chuhe);
    
    // 汉界
    const hanjie = document.createElement('div');
    hanjie.className = 'river-text hanjie';
    hanjie.textContent = '汉 界';
    hanjie.style.left = `${CELL_SIZE * 5.5}px`;
    hanjie.style.top = `${CELL_SIZE * 4.5}px`;
    chessBoard.appendChild(hanjie);
}

function createPiece(vRow, vCol, realRow, realCol, type) {
    const piece = document.createElement('div');
    piece.className = 'chess-piece';
    piece.classList.add(isRed(type) ? 'red-piece' : 'black-piece');
    piece.textContent = PIECES[type];

    piece.style.left = `${vCol * CELL_SIZE}px`;
    piece.style.top  = `${vRow * CELL_SIZE}px`;

    // 这里存真实坐标，逻辑不乱
    piece.dataset.row = realRow;
    piece.dataset.col = realCol;
    piece.dataset.type = type;

    piece.addEventListener('click', e => {
        e.stopPropagation();

        const r = +piece.dataset.row;
        const c = +piece.dataset.col;
        const t = piece.dataset.type;

        onPieceClick(r, c, t);
    });

    chessBoard.appendChild(piece);
}

function onCellClick(vRow, vCol) {
    if (!selectedPiece) return;   // ← 必须有这句

    const row = isFlipped ? BOARD_HEIGHT - 1 - vRow : vRow;
    const col = isFlipped ? BOARD_WIDTH  - 1 - vCol : vCol;

    const fromRow = +selectedPiece.dataset.row;
    const fromCol = +selectedPiece.dataset.col;
    const type = selectedPiece.dataset.type;

    if (isValidMove(fromRow, fromCol, row, col, type)) {
        movePiece(fromRow, fromCol, row, col);
    } else {
        clearSelected();
    }
}























function isValidMove(sx, sy, tx, ty, type) {
    return true;
    // 边界
    if (tx < 0 || tx >= BOARD_WIDTH || ty < 0 || ty >= BOARD_HEIGHT) return false;

    const target = board[ty][tx];
    const isRedPiece = isRed(type);

    // 不能吃己方
    if (target && isRed(target) === isRedPiece) return false;

    const dx = tx - sx;
    const dy = ty - sy;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);

    switch (type.toUpperCase()) {

        // 车
        case 'R':
            if (dx !== 0 && dy !== 0) return false;
            return countPiecesBetween(sx, sy, tx, ty) === 0;

        // 马
        case 'H':
            if (!((adx === 2 && ady === 1) || (adx === 1 && ady === 2))) return false;
            // 马腿
            const legX = sx + (adx === 2 ? dx / 2 : 0);
            const legY = sy + (ady === 2 ? dy / 2 : 0);
            return !board[legY][legX];

        // 相 / 象
        case 'E':
            if (adx !== 2 || ady !== 2) return false;
            // 象眼
            if (board[sy + dy / 2][sx + dx / 2]) return false;
            // 不能过河
            return isRedPiece ? ty >= 5 : ty <= 4;

        // 士
        case 'A':
            if (adx !== 1 || ady !== 1) return false;
            return inPalace(tx, ty, isRedPiece);

        // 帅 / 将
        case 'G':
            if (adx + ady !== 1) return false;
            return inPalace(tx, ty, isRedPiece);

        // 炮
        case 'C':
            if (dx !== 0 && dy !== 0) return false;
            const between = countPiecesBetween(sx, sy, tx, ty);
            if (target) return between === 1;   // 吃子
            return between === 0;               // 平移

        // 兵 / 卒
        case 'P': {
            const forward = isRedPiece ? -1 : 1;

            // 前进
            if (dx === 0 && dy === forward) return true;

            // 过河后可横走
            const crossed = isRedPiece ? sy <= 4 : sy >= 5;
            if (crossed && adx === 1 && dy === 0) return true;

            return false;
        }

        default:
            return false;
    }
}


function noPiecesBetween(sx, sy, tx, ty) {
    return countPiecesBetween(sx, sy, tx, ty) === 0;
}

function inPalace(x, y, isRedPiece) {
    if (x < 3 || x > 5) return false;
    return isRedPiece ? (y >= 7 && y <= 9) : (y >= 0 && y <= 2);
}

function countPiecesBetween(sx, sy, tx, ty) {
    let count = 0;
    const stepX = Math.sign(tx - sx);
    const stepY = Math.sign(ty - sy);

    let x = sx + stepX;
    let y = sy + stepY;

    while (x !== tx || y !== ty) {
        if (board[y][x]) count++;
        x += stepX;
        y += stepY;
    }
    return count;
}

function removeAllListeners() {
    const cells = document.querySelectorAll('.chess-cell');
    cells.forEach(cell => {
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);
    });
}
