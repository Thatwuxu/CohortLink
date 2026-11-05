import { useState, useEffect, useRef, useCallback } from 'react';
import { socketService } from '../services/socketService';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { messageService } from '../services/messageService';
import type { Message, MessageType } from '../types';

export const useChat = (roomId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const messages = useChatStore((state) => state.messages);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const setMessages = useChatStore((state) => state.setMessages);
  const addMessage = useChatStore((state) => state.addMessage);
  
  const currentUserId = useAuthStore((state) => state.user?.id);
  
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // 加载历史消息
  const loadMessages = useCallback(async (reset = false) => {
    if (!roomId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const currentPage = reset ? 1 : page;
      const response = await messageService.getMessages(roomId, currentPage, 20);
      
      if (reset) {
        setMessages(response.items);
        setPage(2);
      } else {
        setMessages([...response.items, ...messages]);
        setPage(currentPage + 1);
      }
      
      setHasMore(response.items.length === 20);
    } catch (err) {
      setError('加载消息失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [roomId, page, messages, setMessages]);

  // 发送消息
  const sendMessage = useCallback(async (type: MessageType, content: string, language?: string, replyToId?: string) => {
    if (!roomId || !content.trim()) return;
    
    try {
      await messageService.sendMessage(roomId, { type, content, language, replyToId });
      // 消息会通过 WebSocket 推送，不需要手动添加
    } catch (err) {
      setError('发送消息失败');
      console.error(err);
    }
  }, [roomId]);

  // 删除消息
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!roomId) return;
    
    try {
      await messageService.deleteMessage(roomId, messageId);
    } catch (err) {
      setError('删除消息失败');
      console.error(err);
    }
  }, [roomId]);

  // 发送输入状态
  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (!roomId) return;
    
    if (isTyping && !isTypingRef.current) {
      socketService.sendTypingStatus(roomId, true);
      isTypingRef.current = true;
    }
    
    // 清除之前的定时器
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // 设置新的定时器，2秒后发送停止输入状态
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        socketService.sendTypingStatus(roomId, false);
        isTypingRef.current = false;
      }
    }, 2000);
  }, [roomId]);

  // 加载更多消息
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMessages(false);
    }
  }, [loading, hasMore, loadMessages]);

  // 初始化 WebSocket 连接和事件监听
  useEffect(() => {
    if (!roomId) return;

    // 连接 WebSocket
    socketService.connect();
    socketService.joinRoom(roomId);

    // 加载初始消息
    loadMessages(true);

    // 监听新消息
    const handleNewMessage = (message: Message) => {
      addMessage(message);
    };

    // 监听消息删除
    const handleMessageDeleted = (data: { messageId: string }) => {
      useChatStore.setState((state) => ({
        messages: state.messages.filter((m) => m.id !== data.messageId),
      }));
    };

    // 监听用户加入
    const handleUserJoin = (data: { userId: string; nickname: string }) => {
      // 可以添加系统消息
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        roomId: roomId,
        userId: 'system',
        type: 'system',
        content: `${data.nickname} 加入了房间`,
        createdAt: new Date().toISOString(),
      };
      addMessage(systemMessage);
    };

    // 监听用户离开
    const handleUserLeave = (_data: { userId: string }) => {
      // 可以添加系统消息
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        roomId: roomId,
        userId: 'system',
        type: 'system',
        content: '有用户离开了房间',
        createdAt: new Date().toISOString(),
      };
      addMessage(systemMessage);
    };

    // 监听输入状态
    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== currentUserId) {
        if (data.isTyping) {
          useChatStore.setState((state) => {
            const newSet = new Set(state.typingUsers);
            newSet.add(data.userId);
            return { typingUsers: newSet };
          });
        } else {
          useChatStore.setState((state) => {
            const newSet = new Set(state.typingUsers);
            newSet.delete(data.userId);
            return { typingUsers: newSet };
          });
        }
      }
    };

    socketService.onMessage(handleNewMessage);
    socketService.onMessageDeleted(handleMessageDeleted);
    socketService.onUserJoin(handleUserJoin);
    socketService.onUserLeave(handleUserLeave);
    socketService.onTyping(handleTyping);

    // 清理
    return () => {
      socketService.leaveRoom(roomId);
      socketService.off('message:receive', handleNewMessage);
      socketService.off('message:deleted', handleMessageDeleted);
      socketService.off('user:join', handleUserJoin);
      socketService.off('user:leave', handleUserLeave);
      socketService.off('typing:update', handleTyping);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [roomId, loadMessages, addMessage, currentUserId]);

  return {
    messages,
    typingUsers,
    loading,
    error,
    hasMore,
    sendMessage,
    deleteMessage,
    sendTypingStatus,
    loadMore,
    loadMessages,
  };
};
