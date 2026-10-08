#!/bin/bash

echo "===== IT服务器健康检查 ====="
echo "检查时间：$(date)"
echo

for service in nginx mysql docker
do
    status=$(systemctl is-active $service)

    if [ "$status" = "active" ]; then
        echo "[正常] $service : $status"
    else
        echo "[异常] $service : $status"
    fi
done

echo
echo "===== 系统资源 ====="

echo "CPU：$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')%"
echo "内存：$(free | awk '/Mem:/ {printf "%.1f", $3/$2 * 100}')%"
echo "磁盘：$(df / | awk 'NR==2 {print $5}')"
