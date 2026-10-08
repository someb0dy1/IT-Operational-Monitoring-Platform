rm README.md && cat > README.md <<'EOF'
# IT 运维监控平台

基于 Linux、Python Flask、JavaScript、Shell 和 systemd 构建的服务器运维监控平台，实现服务器资源监控、服务状态检测、分级告警以及 Nginx 自动故障恢复。

## 一、项目简介

本项目模拟企业服务器运维场景，在 Ubuntu Server 环境中搭建 IT 运维监控平台。

通过 Flask 提供监控 API，结合 psutil 获取服务器 CPU、内存、磁盘等资源信息，同时通过 systemd 检查 Nginx、MySQL、Docker 等服务运行状态。

项目进一步结合 systemd Timer 和 Shell 脚本，实现 Nginx 服务异常后的自动检测与恢复。

## 二、技术栈

- 操作系统：Ubuntu Server 26.04.1 LTS
- 后端：Python、Flask
- 系统监控：psutil
- 前端：HTML、CSS、JavaScript
- 服务管理：systemd
- 自动化：Shell Script
- Web 服务：Flask
- 被监控服务：Nginx、MySQL、Docker
- 虚拟化网络：VMware NAT

## 三、主要功能

### 1. 系统资源监控

监控服务器：

- CPU 使用率
- 内存使用率
- 磁盘使用率
- 系统运行时间

### 2. 服务状态监控

实时检查：

- Nginx
- MySQL
- Docker

### 3. 分级告警

根据资源使用率进行分级：

| CPU / 内存 / 磁盘 | 状态 |
|---|---|
| < 80% | 正常 |
| 80% - 89% | 预警 |
| ≥ 90% | 严重告警 |

### 4. Nginx 自动故障恢复

通过 systemd Timer 定期检查 Nginx：

```text
systemd Timer
      ↓
nginx-recovery.service
      ↓
auto_recovery.sh
      ↓
检查 Nginx
      ↓
发现异常
      ↓
自动启动 Nginx
实现 Nginx 服务自动恢复。
```

### 5. Web 可视化监控

通过浏览器访问：

http://192.168.115.129:5000

查看服务器资源、服务状态、告警信息和监控日志。
