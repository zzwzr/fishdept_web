// 获取浏览器ID函数
function getBrowserId() {
    let browserId = localStorage.getItem('browser_id');

    if (!browserId) {
        browserId = 'browser_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('browser_id', browserId);
    }

    return browserId;
}

function showToast(message, type = "success", duration = 2000) {
    const mask = document.createElement("div");
    mask.className = "custom-toast-mask";

    const toast = document.createElement("div");
    toast.className = "custom-toast " + (type === "success" ? "toast-success" : "toast-error");
    toast.textContent = message;

    mask.appendChild(toast);
    document.body.appendChild(mask);

    setTimeout(() => mask.classList.add("show"), 10);

    setTimeout(() => {
        mask.classList.remove("show");
        setTimeout(() => mask.remove(), 250);
    }, duration);

    mask.addEventListener("click", () => {
        mask.classList.remove("show");
        setTimeout(() => mask.remove(), 200);
    });
}
