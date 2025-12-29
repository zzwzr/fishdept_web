async function startGame(roomId) {
    try {
        const res = await fetch(`${HTTP}${BASE_URL}/api/v1/game/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ room_id: roomId })
        });

        const data = await res.json();

        if (data.code !== 0) {
            showToast('开始游戏失败：' + (data.message || '未知错误'), 'error');
            return;
        }

        showToast('游戏已开始', 'success');

    } catch (err) {
        console.error(err);
        showToast('请求失败，请检查网络', 'error');
    }
}

async function restartGame(roomId) {
    console.log(roomId);
    try {
        const res = await fetch(`${HTTP}${BASE_URL}/api/v1/game/restart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ room_id: roomId })
        });

        const data = await res.json();

        if (data.code !== 0) {
            showToast('开始游戏失败：' + (data.message || '未知错误'), 'error');
            return;
        }
        loadRoom();

    } catch (err) {
        console.error(err);
        showToast('请求失败，请检查网络', 'error');
    }
}

// async function sendMoveRequest(payload) {
//     const res = await fetch(`${HTTP}${BASE_URL}/api/v1/game/move`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//     });

//     return await res.json();
// }
