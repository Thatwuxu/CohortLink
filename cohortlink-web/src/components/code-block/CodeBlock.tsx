import { codeToHtml } from 'shiki';
import { useEffect, useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const highlight = async () => {
      try {
        const result = await codeToHtml(code, {
          lang: language || 'text',
          theme: 'github-dark',
        });
        setHtml(result);
      } catch (err) {
        console.error('Code highlight error:', err);
        setHtml(`<pre><code>${code}</code></pre>`);
      }
    };
    highlight();
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-[#0d1117] my-2">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <span className="text-xs text-gray-400 uppercase">{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#30363d]"
        >
          {copied ? '已复制!' : '复制'}
        </button>
      </div>
      <div
        className="p-4 overflow-x-auto text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
