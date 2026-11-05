import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): void {
    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn('No auth token, cannot connect to WebSocket');
      return;
    }

    if (this.socket?.connected) {
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080';
    
    this.socket = io(wsUrl, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 加入房间
  joinRoom(roomId: string): void {
    this.socket?.emit('room:join', { roomId });
  }

  // 离开房间
  leaveRoom(roomId: string): void {
    this.socket?.emit('room:leave', { roomId });
  }

  // 发送消息
  sendMessage(roomId: string, data: { type: string; content: string; language?: string; replyToId?: string }): void {
    this.socket?.emit('message:send', { roomId, ...data });
  }

  // 发送输入状态
  sendTypingStatus(roomId: string, isTyping: boolean): void {
    this.socket?.emit('typing:update', { roomId, isTyping });
  }

  // 监听新消息
  onMessage(callback: (message: any) => void): void {
    this.socket?.on('message:receive', callback);
  }

  // 监听消息删除
  onMessageDeleted(callback: (data: { messageId: string }) => void): void {
    this.socket?.on('message:deleted', callback);
  }

  // 监听用户加入
  onUserJoin(callback: (data: { userId: string; nickname: string }) => void): void {
    this.socket?.on('user:join', callback);
  }

  // 监听用户离开
  onUserLeave(callback: (data: { userId: string }) => void): void {
    this.socket?.on('user:leave', callback);
  }

  // 监听输入状态
  onTyping(callback: (data: { userId: string; isTyping: boolean }) => void): void {
    this.socket?.on('typing:update', callback);
  }

  // 移除监听器
  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  // 检查连接状态
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
