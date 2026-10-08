
const cpuHistory = [];
const memoryHistory = [];
const diskHistory = [];
const timeHistory = [];async function loadMonitorData() {
    try {
        const response = await fetch("http://192.168.115.129:5000/api/monitor");

        if (!response.ok) {
            throw new Error("API request failed: " + response.status);
        }

        const data = await response.json();
console.log("API数据:", data);
cpuHistory.push(data.cpu);
memoryHistory.push(data.memory);
diskHistory.push(data.disk);

console.log("CPU历史数据:", cpuHistory);

timeHistory.push(new Date().toLocaleTimeString("zh-CN"));
if (cpuHistory.length > 20) {
    cpuHistory.shift();
    memoryHistory.shift();
    diskHistory.shift();
    timeHistory.shift();
}
drawChart("cpu-chart", cpuHistory, "%");
drawChart("memory-chart", memoryHistory, "%");
drawChart("disk-chart", diskHistory, "%");
const now = new Date();

document.getElementById("last-update").textContent =
    now.toLocaleString("zh-CN", {
        hour12: false
    });
        document.getElementById("cpu").textContent = data.cpu + "%";
        document.getElementById("memory").textContent = data.memory + "%";
        document.getElementById("disk").textContent = data.disk + "%";
document.getElementById("cpu-alert").textContent = "状态: " + data.alerts.cpu;
document.getElementById("memory-alert").textContent = "状态： " + data.alerts.memory;
document.getElementById("disk-alert").textContent = "状态： " + data.alerts.disk;
function setAlertStyle(elementId, status) {
    const element = document.getElementById(elementId);

    element.classList.remove("normal", "warning", "critical");

    if (status === "正常") {
        element.classList.add("normal");
    } else if (status === "预警") {
        element.classList.add("warning");
    } else if (status === "严重告警") {
        element.classList.add("critical");
    }
}
setAlertStyle("cpu-alert", data.alerts.cpu);
setAlertStyle("memory-alert", data.alerts.memory);
setAlertStyle("disk-alert", data.alerts.disk);
        document.getElementById("uptime").textContent = data.uptime_hours + " 小时";

function setServiceStatus(elementId, status) {
    const element = document.getElementById(elementId);

    element.classList.remove("normal", "warning", "critical");

    if (status === "active") {
        element.textContent = "运行中";
        element.classList.add("normal");
    } else {
        element.textContent = "已停止";
        element.classList.add("critical");
    }
}

setServiceStatus("nginx", data.services.nginx);
setServiceStatus("mysql", data.services.mysql);
setServiceStatus("docker", data.services.docker);    } catch (error) {
        console.error(error);

        document.getElementById("cpu").textContent = "获取失败";
        document.getElementById("memory").textContent = "获取失败";
        document.getElementById("disk").textContent = "获取失败";
        document.getElementById("uptime").textContent = "获取失败";
    }
}

loadMonitorData();
setInterval(loadMonitorData, 5000);
async function loadLogs() {
    try {
        const response = await fetch("http://192.168.115.129:5000/api/logs");

        if (!response.ok) {
            throw new Error("Log API request failed: " + response.status);
        }

        const data = await response.json();
        const logsElement = document.getElementById("logs");

        if (data.logs.length === 0) {
            logsElement.textContent = "暂无告警记录";
            return;
        }

        logsElement.innerHTML = "";

        data.logs.slice().reverse().forEach(log => {
            const logItem = document.createElement("div");

            logItem.textContent = log;
            logItem.style.padding = "8px 0";
            logItem.style.borderBottom = "1px solid #e5e7eb";

            if (log.includes("active -> inactive")) {
                logItem.classList.add("critical");
            } else if (log.includes("inactive -> active")) {
                logItem.classList.add("normal");
            }

            logsElement.appendChild(logItem);
        });

    } catch (error) {
        console.error(error);
        document.getElementById("logs").textContent = "日志获取失败";
    }
}

loadLogs();
setInterval(loadLogs, 5000);
function drawChart(canvasId, history, unit) {
console.log("开始绘图:", canvasId, history);
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (history.length < 2) {
        return;
    }

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // 绘制横向网格线
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;

        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // 绘制曲线
    ctx.beginPath();

    history.forEach((value, index) => {
        const x =
            padding +
            index * (chartWidth / (history.length - 1));

        const y =
            padding +
            chartHeight -
            (value / 100) * chartHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Y轴刻度
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px Arial";

    ctx.fillText("100%", 5, padding + 5);
    ctx.fillText("80%", 10, padding + chartHeight * 0.2 + 5);
    ctx.fillText("60%", 10, padding + chartHeight * 0.4 + 5);
    ctx.fillText("40%", 10, padding + chartHeight * 0.6 + 5);
    ctx.fillText("20%", 10, padding + chartHeight * 0.8 + 5);
    ctx.fillText("0%", 15, padding + chartHeight + 5);
}
