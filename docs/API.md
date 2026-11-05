# CohortLink API 接口文档

## 基础信息

- **Base URL**: `/api`
- **认证方式**: Bearer Token (JWT)
- **Content-Type**: `application/json`

## 通用响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200    | 成功 |
| 400    | 请求参数错误 |
| 401    | 未认证/Token过期 |
| 403    | 无权限 |
| 404    | 资源不存在 |
| 500    | 服务器内部错误 |

---

## 1. 认证模块 (成员1负责)

### 1.1 用户注册

**POST** `/auth/register`

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "张三",
  "verificationCode": "123456"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "nickname": "张三",
      "avatar": null,
      "studentId": null
    }
  }
}
```

### 1.2 用户登录

**POST** `/auth/login`

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**: 同注册

### 1.3 发送验证码

**POST** `/auth/verification-code`

**请求体**:
```json
{
  "email": "user@example.com"
}
```

### 1.4 获取个人信息

**GET** `/auth/profile`

**Headers**: `Authorization: Bearer <token>`

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "nickname": "张三",
    "avatar": "https://...",
    "studentId": "2021001"
  }
}
```

### 1.5 更新个人信息

**PUT** `/auth/profile`

**请求体**:
```json
{
  "nickname": "李四",
  "avatar": "https://...",
  "studentId": "2021001"
}
```

---

## 2. 房间模块 (成员1负责)

### 2.1 创建房间

**POST** `/rooms`

**请求体**:
```json
{
  "name": "小组作业讨论组"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "uuid",
    "name": "小组作业讨论组",
    "code": "ABC123",
    "ownerId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2.2 获取我的房间列表

**GET** `/rooms`

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "uuid",
      "name": "小组作业讨论组",
      "code": "ABC123",
      "ownerId": "uuid",
      "owner": {
        "id": "uuid",
        "nickname": "张三",
        "avatar": "https://..."
      },
      "memberCount": 5,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2.3 加入房间

**POST** `/rooms/:code/join`

**响应**: 返回房间信息

### 2.4 获取房间详情

**GET** `/rooms/:id`

### 2.5 获取房间成员

**GET** `/rooms/:id/members`

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "id": "uuid",
        "nickname": "张三",
        "avatar": "https://..."
      },
      "role": "owner",
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2.6 移除成员

**DELETE** `/rooms/:roomId/members/:userId`

### 2.7 更新房间信息

**PUT** `/rooms/:id`

**请求体**:
```json
{
  "name": "新的房间名称"
}
```

### 2.8 删除房间

**DELETE** `/rooms/:id`

---

## 3. 消息模块 (成员2负责)

### 3.1 发送消息

**POST** `/rooms/:roomId/messages`

**请求体**:
```json
{
  "type": "text",
  "content": "Hello, World!",
  "replyToId": null
}
```

**代码消息**:
```json
{
  "type": "code",
  "content": "console.log('hello');",
  "language": "javascript"
}
```

**响应**: 返回消息对象

### 3.2 获取历史消息

**GET** `/rooms/:roomId/messages?page=1&pageSize=20`

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "uuid",
        "roomId": "uuid",
        "userId": "uuid",
        "user": {
          "id": "uuid",
          "nickname": "张三",
          "avatar": "https://..."
        },
        "type": "text",
        "content": "Hello",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

### 3.3 搜索消息

**GET** `/rooms/:roomId/messages/search?q=keyword&type=text&startDate=2024-01-01&endDate=2024-01-31`

### 3.4 删除消息

**DELETE** `/rooms/:roomId/messages/:messageId`

---

## 4. 任务模块 (成员2负责)

### 4.1 获取我的任务

**GET** `/tasks/my`

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "uuid",
      "roomId": "uuid",
      "room": {
        "id": "uuid",
        "name": "小组作业讨论组"
      },
      "assigneeId": "uuid",
      "title": "完成报告",
      "description": "撰写项目报告",
      "status": "pending",
      "dueDate": "2024-01-15T23:59:59Z",
      "source": "ai",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 4.2 获取房间任务

**GET** `/rooms/:roomId/tasks`

### 4.3 创建任务

**POST** `/tasks`

**请求体**:
```json
{
  "roomId": "uuid",
  "assigneeId": "uuid",
  "title": "完成报告",
  "description": "撰写项目报告",
  "dueDate": "2024-01-15T23:59:59Z",
  "source": "manual"
}
```

### 4.4 更新任务

**PUT** `/tasks/:id`

### 4.5 更新任务状态

**PATCH** `/tasks/:id/status`

**请求体**:
```json
{
  "status": "completed"
}
```

### 4.6 删除任务

**DELETE** `/tasks/:id`

---

## 5. 会议纪要模块 (成员2负责)

### 5.1 获取会议纪要列表

**GET** `/rooms/:roomId/meetings`

### 5.2 创建会议纪要

**POST** `/rooms/:roomId/meetings`

**请求体**:
```json
{
  "transcript": "会议内容文本..."
}
```

### 5.3 生成会议摘要

**POST** `/rooms/:roomId/meetings/:noteId/generate-summary`

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "topics": ["议题1", "议题2"],
    "keyPoints": ["要点1", "要点2"],
    "conclusions": ["结论1"],
    "actionItems": ["待办1", "待办2"]
  }
}
```

### 5.4 更新会议摘要

**PUT** `/rooms/:roomId/meetings/:noteId/summary`

### 5.5 删除会议纪要

**DELETE** `/rooms/:roomId/meetings/:noteId`

---

## 6. LLM配置模块 (成员2负责)

### 6.1 获取配置列表

**GET** `/llm/configs`

### 6.2 创建配置

**POST** `/llm/configs`

**请求体**:
```json
{
  "apiBaseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-...",
  "modelName": "gpt-3.5-turbo",
  "isDefault": true
}
```

### 6.3 更新配置

**PUT** `/llm/configs/:id`

### 6.4 删除配置

**DELETE** `/llm/configs/:id`

### 6.5 设为默认配置

**POST** `/llm/configs/:id/default`

### 6.6 测试连接

**POST** `/llm/configs/test`

**请求体**: 同创建配置

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "success": true,
    "message": "连接成功"
  }
}
```

---

## 7. AI服务模块 (成员2负责)

### 7.1 语音转文字

**POST** `/rooms/:roomId/ai/transcribe`

**Content-Type**: `audio/webm`

**请求体**: 音频文件二进制数据

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "text": "转写后的文本"
  }
}
```

### 7.2 根据摘要生成任务

**POST** `/rooms/:roomId/ai/generate-tasks`

**请求体**:
```json
{
  "summary": "会议摘要内容..."
}
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "tasks": [
      {
        "title": "任务标题",
        "description": "任务描述",
        "dueDate": "2024-01-15"
      }
    ]
  }
}
```

---

## WebSocket 事件 (成员2负责)

### 连接

```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: 'Bearer <jwt-token>'
  }
});
```

### 事件列表

| 事件名 | 方向 | 说明 |
|--------|------|------|
| `message:send` | Client → Server | 发送消息 |
| `message:receive` | Server → Client | 接收新消息 |
| `user:join` | Server → Client | 用户加入房间 |
| `user:leave` | Server → Client | 用户离开房间 |
| `typing:start` | Client → Server | 开始输入 |
| `typing:stop` | Client → Server | 停止输入 |
| `typing:update` | Server → Client | 输入状态更新 |

### 事件示例

```javascript
// 发送消息
socket.emit('message:send', {
  roomId: 'uuid',
  type: 'text',
  content: 'Hello'
});

// 接收消息
socket.on('message:receive', (message) => {
  console.log(message);
});

// 加入房间
socket.emit('room:join', { roomId: 'uuid' });

// 开始输入
socket.emit('typing:start', { roomId: 'uuid' });
```

---

## 语音通话 (成员1负责)

使用 PeerJS 进行 WebRTC 语音通话，信令通过后端 PeerJS Server 中转。

### 发起通话

```javascript
import Peer from 'peerjs';

const peer = new Peer(userId, {
  host: 'localhost',
  port: 3001,
  path: '/peerjs'
});

// 呼叫其他用户
const call = peer.call(otherUserId, mediaStream);
call.on('stream', (remoteStream) => {
  // 播放远程音频
});
```

### 接听通话

```javascript
peer.on('call', (call) => {
  call.answer(mediaStream);
  call.on('stream', (remoteStream) => {
    // 播放远程音频
  });
});
```

---

## 附录

### 数据字典

#### 消息类型 (type)
- `text`: 文本消息
- `code`: 代码片段
- `image`: 图片
- `system`: 系统消息

#### 任务状态 (status)
- `pending`: 待办
- `in_progress`: 进行中
- `completed`: 已完成

#### 任务来源 (source)
- `ai`: AI自动生成
- `manual`: 手动创建
- `sticky`: 便签转化

#### 房间成员角色 (role)
- `owner`: 创建者
- `member`: 普通成员
