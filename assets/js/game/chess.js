const chessBoard = document.getElementById('chess-board');


const BOARD_WIDTH = 9;  // 9列
const BOARD_HEIGHT = 10; // 10行
const CELL_SIZE = 60;

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

// 绘制所有棋子
function drawPieces() {
    // 移除现有的棋子
    document.querySelectorAll('.chess-piece').forEach(piece => piece.remove());

    for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
            const type = board[row][col];
            if (type) {
                const piece = createPiece(row, col, type);
                
                // 如果这个棋子之前被选中，恢复选中状态
                // if (selectedPiece && 
                //     parseInt(selectedPiece.dataset.row) === row && 
                //     parseInt(selectedPiece.dataset.col) === col) {
                //     piece.classList.add('selected');
                // }
            }
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

    console.log(`点击棋子: 行${row}, 列${col}, 类型 ${type}`);

    // 检查是否可以选中（当前回合的棋子）
    if (isRed(type) === (room.p === 'R')) {
        // 如果已经有选中的棋子，先取消选中
        if (selectedPiece) {
            selectedPiece.classList.remove('selected');
        }

        // 选中新棋子
        const pieceElement = document.querySelector(`.chess-piece[data-row="${row}"][data-col="${col}"]`);
        if (pieceElement) {
            selectedPiece = pieceElement;
            selectedPiece.classList.add('selected');
            console.log(`选中棋子: ${type}`);
        }
    } else {
        // 点击的是对方棋子，尝试移动
        if (selectedPiece) {
            const fromRow = parseInt(selectedPiece.dataset.row);
            const fromCol = parseInt(selectedPiece.dataset.col);
            const pieceType = selectedPiece.dataset.type;
            
            if (isValidMove(fromRow, fromCol, row, col, pieceType)) {
                movePiece(fromRow, fromCol, row, col);
            } else {
                selectedPiece.classList.remove('selected');
                selectedPiece = null;
                console.log('移动不合法');
            }
        }
    }
}

// // 移动棋子
// function movePiece(fromRow, fromCol, toRow, toCol) {
//     console.log(`移动棋子从 (${fromRow},${fromCol}) 到 (${toRow},${toCol})`);

//     // 获取棋子类型
//     const pieceType = board[fromRow][fromCol];

//     // 检查目标位置是否有棋子（吃子）
//     if (board[toRow][toCol]) {
//         const eatenPiece = document.querySelector(`.chess-piece[data-row="${toRow}"][data-col="${toCol}"]`);
//         if (eatenPiece) {
//             eatenPiece.classList.add('eaten');
//             setTimeout(() => {
//                 if (eatenPiece.parentNode) {
//                     eatenPiece.remove();
//                 }
//             }, 300);
//         }
//     }

//     // 更新棋盘数据
//     board[toRow][toCol] = pieceType;
//     board[fromRow][fromCol] = '';

//     // 更新选中的棋子位置
//     if (selectedPiece) {
//         selectedPiece.dataset.row = toRow;
//         selectedPiece.dataset.col = toCol;

//         // 更新棋子位置
//         selectedPiece.style.left = `${toCol * CELL_SIZE}px`;
//         selectedPiece.style.top = `${toRow * CELL_SIZE}px`;
        
//         // 移除选中状态
//         selectedPiece.classList.remove('selected');
//         selectedPiece = null;
//     }

//     // 切换回合
//     currentTurn = currentTurn === 'red' ? 'black' : 'red';
//     console.log(`当前回合: ${currentTurn}`);

//     // 检查游戏是否结束
//     // checkGameOver();

//     // 重新绘制棋子（确保选中状态被清除）
//     drawPieces();
// }






























// 简化的移动验证
function isValidMove(sx, sy, tx, ty, type) {
    return true;

    if (tx < 0 || tx >= BOARD_WIDTH || ty < 0 || ty >= BOARD_HEIGHT) return false;
    const target = board[ty][tx];
    if (target && isRed(target) === isRed(type)) return false; // 不能吃己方棋子

    const dx = Math.abs(tx - sx);
    const dy = Math.abs(ty - sy);

    switch (type.toUpperCase()) {
        case 'R': // 车
            if (dx !== 0 && dy !== 0) return false;
            return noPiecesBetween(sx, sy, tx, ty);
        case 'H': // 马
            if (!((dx === 1 && dy === 2) || (dx === 2 && dy === 1))) return false;
            // 检查马腿
            const legX = dx === 1 ? 0 : (tx > sx ? 1 : -1);
            const legY = dy === 1 ? 0 : (ty > sy ? 1 : -1);
            return !board[sy + legY][sx + legX];
        case 'E': // 象
            if (dx !== 2 || dy !== 2) return false;
            // 检查象眼
            const eyeX = (tx + sx) / 2;
            const eyeY = (ty + sy) / 2;
            if (!board[eyeY][eyeX]) {
                // 象不能过河
                const isRedPiece = isRed(type);
                if (isRedPiece && ty < 5) return false;
                if (!isRedPiece && ty > 4) return false;
                return true;
            }
            return false;
        case 'A': // 士
            if (dx !== 1 || dy !== 1) return false;
            // 九宫格边界
            if (tx < 3 || tx > 5 || (isRed(type) ? ty > 2 : ty < 7)) return false;
            return true;
        case 'G': // 将
            if (dx > 1 || dy > 1 || (dx === 0 && dy === 0)) return false;
            // 九宫格边界
            if (tx < 3 || tx > 5 || (isRed(type) ? ty > 2 : ty < 7)) return false;
            return true;
        case 'C': // 炮
            if (dx !== 0 && dy !== 0) return false;
            const piecesBetween = countPiecesBetween(sx, sy, tx, ty);
            if (target) return piecesBetween === 1; // 吃子需要隔一个子
            return piecesBetween === 0; // 移动不能有子阻挡
        case 'P': // 兵
            const forward = isRed(type) ? -1 : 1;
            if (dy === 0 && dx === 1) { // 过河后可以横移
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

function removeAllListeners() {
    const cells = document.querySelectorAll('.chess-cell');
    cells.forEach(cell => {
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);
    });
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
    drawPieces();
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

// 创建棋子元素
function createPiece(row, col, type) {
    const piece = document.createElement('div');
    piece.className = 'chess-piece';
    piece.classList.add(isRed(type) ? 'red-piece' : 'black-piece');
    piece.textContent = PIECES[type];
    
    // 设置棋子位置为交叉点坐标
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    
    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.dataset.type = type;
    
    // 为棋子添加点击事件
    piece.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡到格子
        onPieceClick(row, col, type);
    });
    
    chessBoard.appendChild(piece);
    return piece;
}

// 只处理空格子点击
function onCellClick(row, col) {
    console.log(`点击空格: 行${row}, 列${col}`);

    // 如果已经有选中的棋子，尝试移动到这个位置
    if (selectedPiece) {
        const fromRow = parseInt(selectedPiece.dataset.row);
        const fromCol = parseInt(selectedPiece.dataset.col);
        const pieceType = selectedPiece.dataset.type;
        
        // 检查目标位置是否为空或者有对方棋子
        const targetPiece = board[row][col];
        
        if (isValidMove(fromRow, fromCol, row, col, pieceType)) {
            movePiece(fromRow, fromCol, row, col);
        } else {
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
            drawPieces(); // 重新绘制棋子以清除选中状态
            console.log('移动不合法');
        }
    }
}