# IT Operations Monitoring Platform

> A lightweight Linux server monitoring and automatic recovery platform built with Python, Flask, systemd, and a web-based dashboard.

一个面向 Linux 服务器运维场景的轻量级监控与自动故障恢复平台，用于实时查看服务器资源状态、关键服务运行状态，并通过 systemd 定时检测和自动恢复异常服务。

## 📌 Project Overview

本项目以 Ubuntu Server 为运行环境，模拟实际 IT 运维中的服务器监控与故障处理场景。

系统通过 Python + Flask 提供监控 API，并结合 `psutil` 获取服务器 CPU、内存和磁盘使用情况，同时检查 Nginx、MySQL、Docker 等关键服务状态。

当 Nginx 等关键服务异常时，systemd 定时任务负责检测服务状态并执行自动恢复，从而形成：

```text
服务器运行
    │
    ▼
资源与服务监控
    │
    ├── CPU
    ├── Memory
    ├── Disk
    ├── Nginx
    ├── MySQL
    └── Docker
    │
    ▼
异常检测
    │
    ├── 正常
    ├── 预警
    └── 严重告警
    │
    ▼
systemd 自动恢复
    │
    ▼
日志记录
```

## ✨ Key Features

### 1. Server Resource Monitoring

通过 Python `psutil` 获取服务器运行状态：

- CPU 使用率
- 内存使用率
- 磁盘使用率
- 系统运行时间

### 2. Linux Service Monitoring

监控关键 Linux 服务状态：

- Nginx
- MySQL
- Docker

通过 `systemctl` 获取服务运行状态，并在 Web 页面进行展示。

### 3. Web Monitoring Dashboard

使用 HTML + CSS + JavaScript 构建前端监控页面。

前端通过 Flask API 获取实时服务器数据，并展示：

- CPU 使用率
- 内存使用率
- 磁盘使用率
- 服务运行状态
- 系统运行时间
- 告警状态

### 4. Automatic Service Recovery

使用 Linux `systemd` 实现 Nginx 自动检测与恢复。

核心组件：

```text
nginx-recovery.service
        │
        ▼
检测 Nginx 状态
        │
        ├── active → 正常
        │
        └── inactive → 执行恢复
                         │
                         ▼
                    systemctl restart nginx
```

通过 `systemd timer` 定期执行检查，实现基础的故障自动恢复能力。

### 5. Monitoring Logs

系统记录关键服务状态变化，例如：

```text
active -> inactive
inactive -> active
```

用于辅助故障排查和运维测试。

---

## 🛠️ Technology Stack

| Category
