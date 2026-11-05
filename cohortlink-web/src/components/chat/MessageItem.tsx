import { useAuthStore } from '../../stores/authStore';
import { CodeBlock } from '../code-block/CodeBlock';
import type { Message } from '../../types';

interface MessageItemProps {
  message: Message;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
}

export const MessageItem = ({ message, onDelete, onReply }: MessageItemProps) => {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isOwn = message.userId === currentUserId;
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
          {message.user?.nickname?.charAt(0) || '?'}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {/* Sender Name */}
        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {message.user?.nickname || '未知用户'}
          </span>
          <span className="text-xs text-gray-400">{formatTime(message.createdAt)}</span>
        </div>

        {/* Message Bubble */}
        <div
          className={`relative group rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700'
          }`}
        >
          {/* Reply Reference */}
          {message.replyToId && (
            <div className={`text-xs mb-1 px-2 py-1 rounded ${
              isOwn ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              ↩️ 引用消息
            </div>
          )}

          {/* Message Content */}
          {message.type === 'code' ? (
            <CodeBlock code={message.content} language={message.language || 'text'} />
          ) : (
            <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
          )}

          {/* Action Buttons */}
          <div className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2`}>
            {onReply && (
              <button
                onClick={() => onReply(message.id)}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                title="回复"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
            )}
            {isOwn && onDelete && (
              <button
                onClick={() => onDelete(message.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="删除"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
