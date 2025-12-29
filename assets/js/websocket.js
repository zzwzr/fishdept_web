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
                const status = res.data.status;

                if (status === 2) {
                    renderMove(res.data);
                    showGameOver(`${res.data.p} 胜利！`);
                    return;
                }

                if (status === 3) {
                    renderMove(res.data);
                    showGameOver('平局！');
                    return;
                }

                if (status === 1) {
                    renderMove(res.data);
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
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

function renderMove({ index, p }) {
    const cell = document.querySelectorAll('.cell')[index];
    if (!cell) return;

    cell.textContent = p;
    cell.className = 'cell ' + p.toLowerCase();
}