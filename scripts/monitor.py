import psutil
import time
import json

cpu_usage = psutil.cpu_percent(interval=1)
memory = psutil.virtual_memory()
disk = psutil.disk_usage("/")
uptime_seconds = time.time() - psutil.boot_time()

data = {
    "cpu": cpu_usage,
    "memory": memory.percent,
    "disk": disk.percent,
    "uptime_hours": round(uptime_seconds / 3600, 2)
}

print(json.dumps(data))
