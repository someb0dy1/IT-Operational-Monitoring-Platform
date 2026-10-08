from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import psutil
import time
import subprocess

app = Flask(__name__)
CORS(app)

HTML_DIR = "/home/itadminn/it-project/html"

@app.route("/")
def index():
    return send_from_directory(HTML_DIR, "index.html")

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(HTML_DIR, filename)

last_services = {}


@app.route("/api/monitor")
def monitor():
    cpu_usage = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    uptime_seconds = time.time() - psutil.boot_time()

    alerts = {}

    alerts["cpu"] = "严重告警" if cpu_usage >= 90 else "预警" if cpu_usage >= 80 else "正常"
    alerts["memory"] = "严重告警" if memory.percent >= 90 else "预警" if memory.percent >= 80 else "正常"
    alerts["disk"] = "严重告警" if disk.percent >= 90 else "预警" if disk.percent >= 80 else "正常"


    services = {}
    for service in ["nginx", "mysql", "docker"]:
        result = subprocess.run(["systemctl", "is-active", service], capture_output=True, text=True)
        services[service] = result.stdout.strip()
    for service, status in services.items():
        alerts[service] = "正常" if status == "active" else "严重告警"
    for service, status in services.items():
        previous_status = last_services.get(service)

        if previous_status is not None and previous_status != status:
            log_message = f"{time.strftime('%Y-%m-%d %H:%M:%S')} | {service} | 状态变化 | {previous_status} -> {status}"

            print(log_message)

            with open("../logs/monitor.log", "a") as f:
                f.write(log_message + "\n")

        last_services[service] = status
    data = {
        "cpu": cpu_usage,
        "memory": memory.percent,
        "disk": disk.percent,
        "uptime_hours": round(uptime_seconds / 3600, 2),
        "services": services,
        "alerts": alerts,
    }

    return jsonify(data)


@app.route("/api/logs")
def logs():
    try:
        with open("../logs/monitor.log", "r") as f:
            lines = f.readlines()

        return jsonify({
            "logs": [line.strip() for line in lines[-20:]]
        })

    except FileNotFoundError:
        return jsonify({
            "logs": []
        })
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
