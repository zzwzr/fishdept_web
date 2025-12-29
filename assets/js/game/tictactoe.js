const tictactoeBoard = document.getElementById('tictactoe-board');
// 游戏状态变量
let currentPlayer = 'X';

let gameStateArray = ['', '', '', '', '', '', '', '', ''];
let scores = {
    player: 0,
    computer: 0,
    draw: 0
};

function setupTicTacToe() {
    const placeholders = ['chess-board'];
    placeholders.forEach(id => {
        const placeholder = document.getElementById(id);
        if (placeholder) placeholder.style.display = 'none';
    });

    // 显示棋盘 
    tictactoeBoard.style.display = 'grid';

    resetGame();

    // 清空旧事件，重新注册
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);
    });

    const newCells = document.querySelectorAll('.cell');
    newCells.forEach(cell => {
        cell.addEventListener('click', cellClicked);
    });
}

let isRequesting = false;

function cellClicked(e) {

    if (!window.settings.gameActive) {
        showToast('请先点击开始游戏！', 'success');
        return;
    }
    if (isRequesting) return;
    isRequesting = true;

    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    if (gameStateArray[cellIndex] !== '' || !window.settings.gameActive) {
        return;
    }

    try {

        wsSend({
            type: 'MOVE',
            room_id: roomIdElement.textContent,
            browser_id: browserId,
            index: cellIndex
        });
        // const res = sendMoveRequest({
        //     room_id: roomIdElement.textContent,
        //     browser_id: browserId,
        //     index: cellIndex
        // });

        // if (res.winner) {
        //     gameOver(res.winner);
        // }

    } catch (err) {
        console.error(err);
        showToast('网络错误', 'error');
    } finally {
        isRequesting = false;
    }
}

function renderBoard(board) {

    if (!board) {
        return;
    }
    gameStateArray = board;

    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, idx) => {
        const val = board[idx];
        cell.textContent = val;
        cell.className = 'cell';

        if (val === 'X' || val === 'O') {
            cell.classList.add(val.toLowerCase());
        }
    });
}

function resetGame() {
    currentPlayer = 'X';
    window.settings.gameActive = false;
    gameStateArray = ['', '', '', '', '', '', '', '', ''];
    gameState.textContent = '等待开始';

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
}

function gameOver(winnerSymbol) {
    window.settings.gameActive = false;
    gameState.textContent = '游戏结束';

    if (winnerSymbol === 'DRAW') {
        gameResult.textContent = '平局';
    } else {
        gameResult.textContent = winnerSymbol + ' 获胜！';
    }

    gameOverModal.style.display = 'flex';
}
