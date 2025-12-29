
const chessBoard = document.getElementById('chess-board');
function setupChess() {

    const placeholders = ['tictactoe-board'];
    placeholders.forEach(id => {
        const placeholder = document.getElementById(id);
        if (placeholder) placeholder.style.display = 'none';
    });

    // 显示棋盘 
    chessBoard.style.display = 'grid';

    // 添加象棋模式类到游戏内容区域
    const gameContent = document.querySelector('.game-content');
    gameContent.classList.add('chess-mode');

    createChessBoard();
    // 更新游戏状态
    const gameState = document.getElementById('game-state');
    if (gameState) {
        gameState.textContent = '未开始';
    }
}

// 初始化象棋游戏
// function setupChess() {

//     // 显示象棋棋盘
//     const chessBoard = document.getElementById('chess-board');
//     if (!chessBoard) {
//         // 如果棋盘不存在，创建它
//         const gameArea = document.querySelector('.game-area');
//         const newChessBoard = document.createElement('div');
//         newChessBoard.id = 'chess-board';
//         newChessBoard.className = 'chess-board';
//         gameArea.appendChild(newChessBoard);
//         createChessBoard();
//     } else {
//         chessBoard.style.display = 'block';
//         createChessBoard();
//     }
    
//     // 添加象棋模式类到游戏内容区域
//     const gameContent = document.querySelector('.game-content');
//     gameContent.classList.add('chess-mode');

//     // 更新游戏状态
//     const gameState = document.getElementById('game-state');
//     if (gameState) {
//         gameState.textContent = '未开始';
//     }
// }

// 象棋棋子初始位置
const CHESS_INITIAL_POSITIONS = [
    // 红方棋子（底部）
    { piece: '車', color: 'red', row: 9, col: 0 },
    { piece: '馬', color: 'red', row: 9, col: 1 },
    { piece: '相', color: 'red', row: 9, col: 2 },
    { piece: '仕', color: 'red', row: 9, col: 3 },
    { piece: '帥', color: 'red', row: 9, col: 4 },
    { piece: '仕', color: 'red', row: 9, col: 5 },
    { piece: '相', color: 'red', row: 9, col: 6 },
    { piece: '馬', color: 'red', row: 9, col: 7 },
    { piece: '車', color: 'red', row: 9, col: 8 },
    { piece: '炮', color: 'red', row: 7, col: 1 },
    { piece: '炮', color: 'red', row: 7, col: 7 },
    { piece: '兵', color: 'red', row: 6, col: 0 },
    { piece: '兵', color: 'red', row: 6, col: 2 },
    { piece: '兵', color: 'red', row: 6, col: 4 },
    { piece: '兵', color: 'red', row: 6, col: 6 },
    { piece: '兵', color: 'red', row: 6, col: 8 },
    
    // 黑方棋子（顶部）
    { piece: '車', color: 'black', row: 0, col: 0 },
    { piece: '馬', color: 'black', row: 0, col: 1 },
    { piece: '象', color: 'black', row: 0, col: 2 },
    { piece: '士', color: 'black', row: 0, col: 3 },
    { piece: '將', color: 'black', row: 0, col: 4 },
    { piece: '士', color: 'black', row: 0, col: 5 },
    { piece: '象', color: 'black', row: 0, col: 6 },
    { piece: '馬', color: 'black', row: 0, col: 7 },
    { piece: '車', color: 'black', row: 0, col: 8 },
    { piece: '炮', color: 'black', row: 2, col: 1 },
    { piece: '炮', color: 'black', row: 2, col: 7 },
    { piece: '卒', color: 'black', row: 3, col: 0 },
    { piece: '卒', color: 'black', row: 3, col: 2 },
    { piece: '卒', color: 'black', row: 3, col: 4 },
    { piece: '卒', color: 'black', row: 3, col: 6 },
    { piece: '卒', color: 'black', row: 3, col: 8 }
];

// 创建象棋棋盘
function createChessBoard() {
    const chessBoard = document.getElementById('chess-board');
    chessBoard.innerHTML = '';
    
    // 添加河界
    const river = document.createElement('div');
    river.className = 'river';
    chessBoard.appendChild(river);
    
    // 添加九宫
    const topPalace = document.createElement('div');
    topPalace.className = 'palace';
    chessBoard.appendChild(topPalace);
    
    const bottomPalace = document.createElement('div');
    bottomPalace.className = 'palace bottom';
    chessBoard.appendChild(bottomPalace);
    
    // 添加交叉点标记
    const intersections = [
        'top-left', 'top-right', 'bottom-left', 'bottom-right'
    ];
    
    intersections.forEach(className => {
        const intersection = document.createElement('div');
        intersection.className = `intersection ${className}`;
        chessBoard.appendChild(intersection);
    });
    
    // 添加坐标标记
    addCoordinates(chessBoard);
    
    // 添加棋子
    CHESS_INITIAL_POSITIONS.forEach(pos => {
        createChessPiece(pos.piece, pos.color, pos.row, pos.col, chessBoard);
    });
    
    return chessBoard;
}

// 添加坐标标记
function addCoordinates(board) {
    const columns = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    
    // 顶部坐标
    columns.forEach((col, index) => {
        const coord = document.createElement('div');
        coord.className = 'coordinate top';
        coord.textContent = columns[8 - index];
        coord.style.left = `${(index * 11.11) + 5.55}%`;
        board.appendChild(coord);
    });
    
    // 底部坐标
    columns.forEach((col, index) => {
        const coord = document.createElement('div');
        coord.className = 'coordinate bottom';
        coord.textContent = columns[index];
        coord.style.left = `${(index * 11.11) + 5.55}%`;
        board.appendChild(coord);
    });
    
    // 左侧坐标
    rows.forEach((row, index) => {
        const coord = document.createElement('div');
        coord.className = 'coordinate left';
        coord.textContent = 10 - index;
        coord.style.top = `${(index * 10) + 5}%`;
        board.appendChild(coord);
    });
    
    // 右侧坐标
    rows.forEach((row, index) => {
        const coord = document.createElement('div');
        coord.className = 'coordinate right';
        coord.textContent = index + 1;
        coord.style.top = `${(index * 10) + 5}%`;
        board.appendChild(coord);
    });
}

// 创建棋子
function createChessPiece(piece, color, row, col, board) {
    const container = document.createElement('div');
    container.className = 'chess-piece-container';
    container.dataset.row = row;
    container.dataset.col = col;
    container.dataset.piece = piece;
    container.dataset.color = color;
    
    const pieceElement = document.createElement('div');
    pieceElement.className = `chess-piece piece-${color}`;
    pieceElement.innerHTML = `<span class="piece-text">${piece}</span>`;
    
    // 计算位置（9列10行）
    const left = (col * 11.11) + 5.55; // 百分比
    const top = (row * 10) + 5; // 百分比
    
    container.style.left = `calc(${left}% - 32.5px)`;
    container.style.top = `calc(${top}% - 32.5px)`;
    
    container.appendChild(pieceElement);
    board.appendChild(container);
    
    // 添加点击事件
    container.addEventListener('click', function() {
        handlePieceClick(this);
    });
    
    return container;
}

// 处理棋子点击
function handlePieceClick(pieceContainer) {
    // 移除之前选中的棋子样式
    document.querySelectorAll('.piece-selected').forEach(el => {
        el.classList.remove('piece-selected');
    });
    
    // 添加选中样式
    pieceContainer.querySelector('.chess-piece').classList.add('piece-selected');
    
    // 显示可移动位置（这里简单实现，实际需要根据象棋规则计算）
    showPossibleMoves(pieceContainer);
}

// 显示可能的移动位置
function showPossibleMoves(pieceContainer) {
    // 移除之前的提示
    document.querySelectorAll('.move-hint').forEach(el => el.remove());
    
    const row = parseInt(pieceContainer.dataset.row);
    const col = parseInt(pieceContainer.dataset.col);
    const piece = pieceContainer.dataset.piece;
    
    // 根据棋子类型显示可能的移动位置（简化版）
    let moves = [];
    
    switch(piece) {
        case '兵':
        case '卒':
            moves = getSoldierMoves(row, col, pieceContainer.dataset.color);
            break;
        case '炮':
            moves = getCannonMoves(row, col);
            break;
        case '車':
            moves = getChariotMoves(row, col);
            break;
        case '馬':
            moves = getHorseMoves(row, col);
            break;
        case '相':
        case '象':
            moves = getElephantMoves(row, col, pieceContainer.dataset.color);
            break;
        case '仕':
        case '士':
            moves = getGuardMoves(row, col);
            break;
        case '帥':
        case '將':
            moves = getGeneralMoves(row, col);
            break;
    }
    
    // 添加移动提示
    moves.forEach(move => {
        const hint = document.createElement('div');
        hint.className = 'move-hint';
        hint.style.left = `calc(${(move.col * 11.11) + 5.55}% - 7.5px)`;
        hint.style.top = `calc(${(move.row * 10) + 5}% - 7.5px)`;
        
        hint.addEventListener('click', function() {
            movePiece(pieceContainer, move.row, move.col);
        });
        
        document.getElementById('chess-board').appendChild(hint);
    });
}

// 移动棋子
function movePiece(pieceContainer, newRow, newCol) {
    const left = (newCol * 11.11) + 5.55;
    const top = (newRow * 10) + 5;
    
    pieceContainer.style.left = `calc(${left}% - 32.5px)`;
    pieceContainer.style.top = `calc(${top}% - 32.5px)`;
    pieceContainer.dataset.row = newRow;
    pieceContainer.dataset.col = newCol;
    
    // 移除选中状态和提示
    document.querySelectorAll('.piece-selected').forEach(el => {
        el.classList.remove('piece-selected');
    });
    document.querySelectorAll('.move-hint').forEach(el => el.remove());
}

// 各种棋子的移动规则（简化版）
function getSoldierMoves(row, col, color) {
    const moves = [];
    
    if (color === 'red') {
        // 红兵向前（向上）
        if (row > 0) moves.push({ row: row - 1, col });
        // 过河后可以左右移动
        if (row <= 4) {
            if (col > 0) moves.push({ row, col: col - 1 });
            if (col < 8) moves.push({ row, col: col + 1 });
        }
    } else {
        // 黑卒向前（向下）
        if (row < 9) moves.push({ row: row + 1, col });
        // 过河后可以左右移动
        if (row >= 5) {
            if (col > 0) moves.push({ row, col: col - 1 });
            if (col < 8) moves.push({ row, col: col + 1 });
        }
    }
    
    return moves;
}

function getCannonMoves(row, col) {
    // 炮的移动规则（简化）
    const moves = [];
    // 上下左右四个方向
    const directions = [
        { dr: -1, dc: 0 }, // 上
        { dr: 1, dc: 0 },  // 下
        { dr: 0, dc: -1 }, // 左
        { dr: 0, dc: 1 }   // 右
    ];
    
    directions.forEach(dir => {
        for (let i = 1; i <= 9; i++) {
            const newRow = row + dir.dr * i;
            const newCol = col + dir.dc * i;
            
            if (newRow >= 0 && newRow <= 9 && newCol >= 0 && newCol <= 8) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    });
    
    return moves;
}

// 其他棋子的移动规则可以类似实现...