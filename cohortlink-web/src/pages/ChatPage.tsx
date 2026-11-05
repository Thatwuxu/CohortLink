import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { useChat } from '../hooks/useChat';
import { useRoomStore } from '../stores/roomStore';
import type { MessageType } from '../types';

export const ChatPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [replyToId, setReplyToId] = useState<string | null>(null);
  
  const currentRoom = useRoomStore((state) => state.currentRoom);
  
  const {
    messages,
    typingUsers,
    loading,
    error,
    hasMore,
    sendMessage,
    deleteMessage,
    sendTypingStatus,
    loadMore,
  } = useChat(roomId);

  const handleSend = (type: MessageType, content: string, language?: string, replyTo?: string) => {
    sendMessage(type, content, language, replyTo);
    setReplyToId(null);
  };

  const handleReply = (messageId: string) => {
    setReplyToId(messageId);
  };

  const handleCancelReply = () => {
    setReplyToId(null);
  };

  if (!roomId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">请选择一个房间</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentRoom?.name || '聊天室'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              房间号: {currentRoom?.code || roomId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Message List */}
      <MessageList
        messages={messages}
        typingUsers={typingUsers}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
        onDeleteMessage={deleteMessage}
        onReplyMessage={handleReply}
      />

      {/* Message Input */}
      <MessageInput
        onSend={handleSend}
        onTyping={sendTypingStatus}
        replyToId={replyToId}
        onCancelReply={handleCancelReply}
      />
    </div>
  );
};
