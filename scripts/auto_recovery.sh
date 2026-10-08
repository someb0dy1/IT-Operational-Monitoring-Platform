#!/bin/bash

echo "===== IT服务器自动恢复检查 ====="
echo "检查时间：$(date)"
echo

SERVICE="nginx"

status=$(systemctl is-active "$SERVICE")

echo "当前状态：$SERVICE -> $status"

if [ "$status" = "active" ]; then
    echo "[正常] $SERVICE 正在运行，无需恢复。"
else
    echo "[异常] $SERVICE 已停止，开始尝试自动恢复..."

    sudo systemctl start "$SERVICE"

    sleep 2

    new_status=$(systemctl is-active "$SERVICE")

    if [ "$new_status" = "active" ]; then
        echo "[恢复成功] $SERVICE 已重新启动。"
    else
        echo "[恢复失败] $SERVICE 仍然处于 $new_status 状态。"
    fi
fi

echo
echo "===== 恢复检查结束 ====="
