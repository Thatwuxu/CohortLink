# CohortLink

大学生小组协作通信工具 - 阿里云天池 2026 Qoder 高校创作力大赛参赛项目

## 项目简介

CohortLink 是一款面向大学生的小组协作通信工具，集成实时通信、语音会议、AI智能纪要与任务管理，打造一站式协作体验。

### 核心功能

- 🔐 **用户系统** - 邮箱注册登录，个人信息管理
- 🏠 **小组房间** - 创建/加入协作房间，成员管理
- 💬 **实时聊天** - WebSocket消息通信，消息持久化
- 🎙️ **语音会议** - WebRTC多人语音通话
- 🧠 **AI笔记** - 语音转写 + 智能会议纪要 + 自动任务提取
- ✅ **任务管理** - 个人任务面板，跨房间聚合
- 📝 **代码共享** - 聊天内嵌代码高亮
- 📌 **任务便签** - 房间待办便签
- ⚙️ **自定义LLM** - 支持配置自定义大模型API

## 技术栈

### 前端 (cohortlink-web)

- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router v6
- **HTTP**: Axios + TanStack Query
- **实时通信**: Socket.io-client
- **语音通话**: PeerJS (WebRTC)
- **代码高亮**: Shiki

### 后端 (cohortlink-server)

- **框架**: Java 17 + Spring Boot 3
- **ORM**: MyBatis-Plus
- **数据库**: PostgreSQL 16
- **缓存**: Redis 7
- **认证**: JWT + Spring Security
- **实时通信**: Spring WebSocket
- **语音信令**: PeerJS Server

### 部署

- **容器化**: Docker + docker-compose
- **部署平台**: Qoder Sites

## 项目结构

```
CohortLink/
├── cohortlink-web/          # 前端项目
│   ├── src/
│   │   ├── components/      # 组件
│   │   │   ├── chat/       # 聊天相关
│   │   │   ├── room/       # 房间相关
│   │   │   ├── voice/      # 语音会议
│   │   │   ├── task/       # 任务组件
│   │   │   ├── code-block/ # 代码高亮
│   │   │   ├── meeting/    # 会议纪要
│   │   │   └── common/     # 通用组件
│   │   ├── pages/          # 页面
│   │   ├── hooks/          # 自定义Hooks
│   │   ├── stores/         # Zustand状态
│   │   ├── services/       # API服务
│   │   ├── utils/          # 工具函数
│   │   └── types/          # TypeScript类型
│   └── package.json
│
├── cohortlink-server/       # 后端项目
│   ├── src/main/java/com/cohortlink/server/
│   │   ├── config/         # 配置类
│   │   ├── controller/     # 控制器
│   │   ├── service/        # 服务层
│   │   ├── mapper/         # 数据访问层
│   │   ├── entity/         # 实体类
│   │   ├── dto/            # 数据传输对象
│   │   ├── security/       # 安全配置
│   │   ├── websocket/      # WebSocket处理
│   │   └── util/           # 工具类
│   └── pom.xml
│
└── docs/                   # 文档
    ├── API.md             # API接口文档
    └── DEVELOPMENT.md     # 开发指南
```

## 团队分工

按功能模块分工：

| 成员 | 负责模块 | 分支前缀 |
|------|----------|----------|
| 成员1 | 用户系统 + 房间管理 + 语音会议 | `feature/user-room-voice` |
| 成员2 | 实时聊天 + AI笔记 + 任务管理 | `feature/chat-ai-tasks` |

## 快速开始

### 环境要求

- Node.js 18+
- Java 17+
- PostgreSQL 16+
- Redis 7+
- Maven 3.8+

### 前端启动

```bash
cd cohortlink-web
npm install
npm run dev
```

访问 http://localhost:3000

### 后端启动

```bash
cd cohortlink-server
# 配置数据库连接 (src/main/resources/application.yml)
mvn spring-boot:run
```

API运行在 http://localhost:8080/api

### Docker 部署

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## Git 工作流

### 分支策略

```
main (生产分支)
  └── develop (开发主干)
       ├── feature/user-room-voice-* (成员1功能分支)
       └── feature/chat-ai-tasks-* (成员2功能分支)
```

### 开发流程

1. 同步最新代码：`git pull origin develop`
2. 创建功能分支：`git checkout -b feature/xxx`
3. 开发并提交：`git commit -m "feat: 完成xxx功能"`
4. 推送分支：`git push origin feature/xxx`
5. 创建 Pull Request 合并到 develop
6. Code Review 后合并

### 提交规范

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具变动

## 开发文档

- [API接口文档](docs/API.md)
- [开发指南](docs/DEVELOPMENT.md)
- [数据库设计](cohortlink-server/src/main/resources/schema.sql)

## License

MIT
