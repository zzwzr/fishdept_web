let ws = null;

function connectWebSocket(browserId) {
    ws = new WebSocket(`ws://${WS_URL}/ws?browser_id=${browserId}`);

    ws.onopen = () => {
        startHeartbeat(ws);
    };

    ws.onmessage = (event) => {

        try {
            const res = JSON.parse(event.data);
            if (res.type === 'PONG') {
                return;
            }

            if (res.type === 'ERROR') {
                showToast(res.message, 'error');
            }

            if (res.type === 'LOAD') {
                loadRoom();
            }

            if (res.type !== 'PONG') {
                console.log(res);
            }

            if (res.type === 'MOVE') {
                const { status, type } = res.data;

                // 先执行落子（1:井字棋，2:象棋）
                if (status === 1 || status === 2 || status === 3) {
                    if (type === 1) {
                        tictactoeMove(res.data);
                    } else if (type === 2) {
                        chessMove(res.data);
                    }
                }

                // 再根据状态处理结局
                if (status === 2) {
                    showGameOver(`${res.data.p} 胜利！`);
                    return;
                }

                if (status === 3) {
                    showGameOver('平局！');
                    return;
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    ws.onerror = (err) => console.error('ws 错误:', err);
    ws.onclose = () => console.log('ws 已关闭');
}

let heartbeatTimer = null;

function startHeartbeat() {
    heartbeatTimer = setInterval(() => {
        wsSend({ type: 'PING' });
    }, 10000);
}

function stopHeartbeat() {
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
    }
}

// 全局函数：发送消息
function wsSend(data) {
    console.log('发送消息', data);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

function tictactoeMove({ index, p }) {
    const cell = document.querySelectorAll('.cell')[index];
    if (!cell) return;

    cell.textContent = p;
    cell.className = 'cell ' + p.toLowerCase();
}

function chessMove({ from_row, from_col, to_row, to_col }) {
    console.log(`动画移动: (${from_row},${from_col}) -> (${to_row},${to_col})`);

    const movingPiece = document.querySelector(`.chess-piece[data-row="${from_row}"][data-col="${from_col}"]`);

    if (!movingPiece) {
        console.error('找不到要移动的棋子');
        return;
    }

    // 如果目标有子，执行吃子动画
    const eatenPiece = document.querySelector(`.chess-piece[data-row="${to_row}"][data-col="${to_col}"]`);

    if (eatenPiece) {
        eatenPiece.classList.add('eaten');
        setTimeout(() => eatenPiece.remove(), 200);
    }

    // 更新 DOM 位置
    movingPiece.dataset.row = to_row;
    movingPiece.dataset.col = to_col;
    movingPiece.style.left = `${to_col * CELL_SIZE}px`;
    movingPiece.style.top = `${to_row * CELL_SIZE}px`;
}