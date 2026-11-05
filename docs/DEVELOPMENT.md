# CohortLink 开发指南

## 目录结构说明

### 前端模块分工

```
src/
├── components/
│   ├── chat/          # 成员2负责 - 聊天组件
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageItem.tsx
│   │   └── CodeBlock.tsx
│   ├── room/          # 成员1负责 - 房间组件
│   │   ├── RoomList.tsx
│   │   ├── RoomCard.tsx
│   │   ├── CreateRoomModal.tsx
│   │   └── JoinRoomModal.tsx
│   ├── voice/         # 成员1负责 - 语音会议组件
│   │   ├── VoiceRoom.tsx
│   │   ├── VoiceControls.tsx
│   │   └── ParticipantList.tsx
│   ├── task/          # 成员2负责 - 任务组件
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskPanel.tsx
│   │   └── StickyNote.tsx
│   ├── meeting/       # 成员2负责 - 会议纪要组件
│   │   ├── MeetingNote.tsx
│   │   ├── TranscriptView.tsx
│   │   └── SummaryView.tsx
│   └── common/        # 公共组件（两人协作）
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Loading.tsx
├── pages/
│   ├── Login.tsx      # 成员1
│   ├── Register.tsx   # 成员1
│   ├── Home.tsx       # 成员1
│   ├── Room.tsx       # 协作
│   ├── Tasks.tsx      # 成员2
│   └── Settings.tsx   # 成员2
├── stores/            # 状态管理（按模块对应）
├── services/          # API服务（按模块对应）
├── hooks/             # 自定义Hooks
├── utils/             # 工具函数
└── types/             # TypeScript类型定义
```

### 后端模块分工

```
src/main/java/com/cohortlink/server/
├── controller/
│   ├── AuthController.java        # 成员1 - 认证相关
│   ├── UserController.java        # 成员1 - 用户管理
│   ├── RoomController.java        # 成员1 - 房间管理
│   ├── VoiceController.java       # 成员1 - 语音会议
│   ├── MessageController.java     # 成员2 - 消息管理
│   ├── TaskController.java        # 成员2 - 任务管理
│   ├── MeetingController.java     # 成员2 - 会议纪要
│   └── LLMConfigController.java   # 成员2 - LLM配置
├── service/
│   ├── AuthService.java           # 成员1
│   ├── UserService.java           # 成员1
│   ├── RoomService.java           # 成员1
│   ├── VoiceService.java          # 成员1
│   ├── MessageService.java        # 成员2
│   ├── TaskService.java           # 成员2
│   ├── MeetingService.java        # 成员2
│   └── LLMService.java            # 成员2
├── mapper/                        # 数据访问层（对应service分工）
├── entity/                        # 实体类（协作）
├── dto/                           # 数据传输对象（协作）
├── config/                        # 配置类（协作）
├── security/                      # 安全配置（成员1）
├── websocket/                     # WebSocket处理（成员2）
└── util/                          # 工具类（协作）
```

## 开发规范

### 代码风格

#### 前端
- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 文件命名：PascalCase（组件）、camelCase（其他）
- 使用 ESLint + Prettier 统一代码格式

#### 后端
- 遵循阿里巴巴Java开发规范
- Controller 只负责参数校验和调用 Service
- Service 负责业务逻辑
- Mapper 只负责数据访问
- 使用 Lombok 简化代码

### Git 提交规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构（非新功能、非bug修复）
- `test`: 测试相关
- `chore`: 构建/工具变动

#### Scope 范围
- `auth`: 认证模块
- `user`: 用户模块
- `room`: 房间模块
- `chat`: 聊天模块
- `voice`: 语音模块
- `task`: 任务模块
- `meeting`: 会议模块
- `ai`: AI服务模块

#### 示例
```
feat(room): 添加创建房间功能

- 实现创建房间API接口
- 添加房间列表页面
- 支持邀请成员加入房间

Closes #12
```

### 分支管理

#### 分支命名
- 功能分支：`feature/<module>-<description>`
- 修复分支：`fix/<module>-<description>`
- 热修复：`hotfix/<version>-<description>`

#### 示例
```bash
# 成员1创建房间相关功能
git checkout -b feature/room-create-room

# 成员2创建聊天功能
git checkout -b feature/chat-message-list
```

### 代码审查

#### PR 要求
1. 必须通过 CI 检查
2. 至少一人 Code Review
3. 提交信息符合规范
4. 相关文档已更新

#### Review 重点
- 代码逻辑正确性
- 边界条件处理
- 性能考虑
- 安全性检查
- 代码可读性

## API 接口规范

### RESTful 风格

```
GET    /api/resource          # 获取列表
GET    /api/resource/:id      # 获取单个
POST   /api/resource          # 创建
PUT    /api/resource/:id      # 全量更新
PATCH  /api/resource/:id      # 部分更新
DELETE /api/resource/:id      # 删除
```

### 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 200    | 成功 |
| 400    | 请求参数错误 |
| 401    | 未认证 |
| 403    | 无权限 |
| 404    | 资源不存在 |
| 500    | 服务器内部错误 |

## WebSocket 事件规范

### 事件命名
- 使用冒号分隔：`module:action`
- 示例：`message:send`, `user:join`, `voice:start`

### 事件格式

```javascript
// 客户端发送
socket.emit('message:send', {
  roomId: 'xxx',
  type: 'text',
  content: 'hello'
});

// 服务端广播
io.to(roomId).emit('message:receive', {
  id: 'xxx',
  userId: 'xxx',
  type: 'text',
  content: 'hello',
  createdAt: '2024-01-01T00:00:00Z'
});
```

## 测试规范

### 前端测试
- 组件测试：React Testing Library
- Hook 测试：React Hooks Testing Library
- 工具函数测试：Jest

### 后端测试
- 单元测试：JUnit 5 + Mockito
- 集成测试：Spring Boot Test
- API 测试：MockMvc

## 部署流程

### 开发环境
```bash
# 前端
npm run dev

# 后端
mvn spring-boot:run
```

### 生产环境
```bash
# 构建前端
npm run build

# 构建后端
mvn clean package

# Docker 部署
docker-compose up -d
```

## 常见问题

### Q: 如何解决代码冲突？
A: 
1. `git pull origin develop` 拉取最新代码
2. 解决冲突文件
3. `git add .`
4. `git commit -m "merge: resolve conflicts"`
5. `git push origin feature/xxx`

### Q: 如何同步他人的代码？
A:
```bash
git checkout develop
git pull origin develop
git checkout feature/xxx
git merge develop
```

### Q: 如何回滚代码？
A:
```bash
# 回滚到上一次提交
git reset --hard HEAD~1

# 回滚到指定commit
git reset --hard <commit-hash>

# 推送到远程（谨慎使用）
git push -f origin feature/xxx
```

## 联系方式

如有问题，请在团队群内讨论或创建 Issue。
