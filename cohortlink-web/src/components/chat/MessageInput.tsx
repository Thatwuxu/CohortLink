import { useState, useRef, useEffect } from 'react';
import type { MessageType } from '../../types';

interface MessageInputProps {
  onSend: (type: MessageType, content: string, language?: string, replyToId?: string) => void;
  onTyping: (isTyping: boolean) => void;
  replyToId?: string | null;
  onCancelReply?: () => void;
}

export const MessageInput = ({ onSend, onTyping, replyToId, onCancelReply }: MessageInputProps) => {
  const [content, setContent] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const type = isCodeMode ? 'code' : 'text';
    onSend(type, content, isCodeMode ? language : undefined, replyToId || undefined);
    setContent('');
    setIsCodeMode(false);
    onTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onTyping(true);
  };

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
    'go', 'rust', 'php', 'ruby', 'html', 'css', 'sql', 'json', 'yaml'
  ];

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      {/* 回复提示 */}
      {replyToId && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span className="text-sm text-blue-600 dark:text-blue-400">回复消息中...</span>
          <button
            onClick={onCancelReply}
            className="ml-auto text-blue-500 hover:text-blue-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* 工具栏 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCodeMode(!isCodeMode)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isCodeMode
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            代码
          </button>

          {isCodeMode && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-purple-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          )}

          <div className="ml-auto text-xs text-gray-400">
            Enter 发送, Shift+Enter 换行
          </div>
        </div>

        {/* 输入区域 */}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isCodeMode ? '输入代码...' : '输入消息...'}
            className={`flex-1 resize-none rounded-xl px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              isCodeMode ? 'font-mono' : ''
            }`}
            rows={1}
          />
          
          <button
            type="submit"
            disabled={!content.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
