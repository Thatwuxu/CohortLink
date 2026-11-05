import { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import type { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  typingUsers: Set<string>;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  onDeleteMessage?: (messageId: string) => void;
  onReplyMessage?: (messageId: string) => void;
}

export const MessageList = ({
  messages,
  typingUsers,
  hasMore,
  loading,
  onLoadMore,
  onDeleteMessage,
  onReplyMessage,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 新消息时自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 滚动加载
  const handleScroll = () => {
    if (!containerRef.current || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop === 0 && scrollHeight > clientHeight) {
      onLoadMore();
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-2"
    >
      {/* 加载更多提示 */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
        </div>
      )}

      {!hasMore && messages.length > 0 && (
        <div className="text-center text-xs text-gray-400 py-2">
          没有更多消息了
        </div>
      )}

      {/* 消息列表 */}
      {messages.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">暂无消息，开始聊天吧！</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onDelete={onDeleteMessage}
            onReply={onReplyMessage}
          />
        ))
      )}

      {/* 输入状态提示 */}
      {typingUsers.size > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <span>{typingUsers.size} 人正在输入...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
