
const roomIdElement = document.getElementById('room-id');
const roomName = document.getElementById('room-name');

const player1Name = document.getElementById('player1-name');
const player2Name = document.getElementById('player2-name');
const player1Status = document.getElementById('player1-status');
const player2Status = document.getElementById('player2-status');

// 在线人数元素
const onlineCountElement = document.getElementById('online-count');

// 游戏相关元素
const startGameBtn = document.getElementById('start-game-btn');
const gameState = document.getElementById('game-state');

const statusMap = {
    1: "未开始",
    2: "游戏中",
    3: "已结束"
};

window.settings = {
    gameActive: false
};

// 结束弹窗
const gameResult = document.getElementById('game-result');
const gameOverModal = document.getElementById('game-over-modal');

const closeGameOverModalBtn = document.getElementById('close-game-over-modal');
const restartGameBtn = document.getElementById('restart-game-btn');
const exitRoomBtn = document.getElementById('exit-room-btn');
function showGameOver(resultText) {
    gameResult.textContent = resultText;
    gameOverModal.style.display = 'flex';
}
async function loadRoom() {

    const res = await fetch(`${HTTP}${BASE_URL}/api/v1/room/first?browser_id=${browserId}`);
    const data = await res.json();
    if (data.code !== 0) throw new Error(data.message || '获取房间信息失败');

    roomIdElement.textContent = data.data.number;
    roomName.textContent = data.data.name;
    gameState.textContent = statusMap[data.data.status] || "未开始";

    window.settings.gameActive = data.data.status == 2;

    player1Name.textContent = data.data.player1 || player1Name.textContent;
    player2Name.textContent = data.data.player2 || player2Name.textContent;

    currentRoom = {
        id: data.data.number,
        name: data.data.name,
        players: { 1: data.data.player1, 2: data.data.player2 },
        status: data.data.status,
        p: data.data.player1 === browserId ? 'X' : 'O'
    };

    console.log(currentRoom);

    checkIfGameCanStart();

    // 井字棋，加载棋盘
    renderBoard(data.data.board);

    if (data.data.status == 3) {
        showGameOver('游戏已结束');
    }
}

// 检查是否可以开始游戏
function checkIfGameCanStart() {
    if (currentRoom && currentRoom.players[1] && currentRoom.players[2]) {
        startGameBtn.disabled = false;
    } else {
        startGameBtn.disabled = true;
    }
}

// 开始游戏功能
startGameBtn.addEventListener('click', function () {
    if (!currentRoom || !currentRoom.players[1] || !currentRoom.players[2]) {
        showToast('需要两名玩家才能开始游戏', 'error');
        return;
    }
    startGame(roomIdElement.textContent);

    window.settings.gameActive = true;
    currentPlayer = 'X';

    gameState.textContent = '游戏中';
    // 重置棋盘
    resetBoard();

    // 关闭房间信息弹窗
    // const roomInfoModal = document.getElementById('room-info-modal');
    // roomInfoModal.style.display = 'none';
});

function resetBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
}

async function loadRoomList() {
    try {
        const res = await fetch(`${HTTP}${BASE_URL}/api/v1/room`);
        const data = await res.json();

        if (data.code !== 0) {
            showToast('获取房间列表失败：' + (data.message || '未知错误'), 'error');
            return;
        }

        const roomListContainer = document.querySelector('.room-list');
        const rooms = data.data;

        // 清空旧的列表（保留标题）
        roomListContainer.innerHTML = `<div class="room-list-title">房间列表</div>`;

        rooms.forEach(room => {
            const roomItem = document.createElement('div');
            roomItem.classList.add('room-item');

            const isFull = room.count >= 2;

            roomItem.innerHTML = `
                <div class="room-info">
                    <div class="room-name">${room.name}</div>
                    <div class="room-players">${room.count}/2 玩家</div>
                </div>
                <button class="join-btn" ${isFull ? 'disabled' : ''}>
                    ${isFull ? '已满' : '加入'}
                </button>
            `;

            // 加入按钮点击事件
            const joinBtn = roomItem.querySelector('.join-btn');
            joinBtn.addEventListener('click', () => {
                if (!isFull) {
                    joinSelectedRoom(room.number, room.name);
                }
            });

            roomListContainer.appendChild(roomItem);
        });

    } catch (err) {
        console.error(err);
        showToast('获取房间列表失败，请检查网络连接', 'error');
    }
}

async function createRoom(roomName) {

    fetch(`${HTTP}${BASE_URL}/api/v1/room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: roomName,
            browser_id: browserId
        }),
    })
        .then(async (response) => {
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                const message = data.message || `请求失败 (${response.status})`;
                showToast('创建房间失败: ' + message, 'error');
                throw new Error(message);
            }

            // 正常逻辑
            if (data.code === 0) {
                const roomCode = data.data.number;

                loadRoomList();
                loadRoom();
            } else {
                showToast('创建房间失败: ' + (data.message || '未知错误'), 'error');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            showToast('创建房间失败，请检查网络连接', 'error');
        });
}

// 加入房间
async function joinSelectedRoom(roomNumber, roomName) {
    try {
        const res = await fetch(`${HTTP}${BASE_URL}/api/v1/room/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                number: roomNumber,
                browser_id: browserId
            })
        });

        const data = await res.json();

        if (data.code !== 0) {
            showToast('加入房间失败：' + (data.message || '未知错误'), 'error');
            return;
        }

        // 显示房间信息
        loadRoom();
        // 加入成功后刷新房间列表
        loadRoomList();

    } catch (err) {
        console.error(err);
        showToast('加入房间失败：' + err.message, 'error');
    }
}

async function loadLink() {
    const res = await fetch(`${HTTP}${BASE_URL}/api/v1/online/count`);
    const data = await res.json();

    const el = onlineCountElement;

    // 淡出
    el.classList.add('fade');

    setTimeout(() => {
        el.textContent = data.data.count;

        // 淡入
        el.classList.remove('fade');
    }, 150);
}