
import React, { useState, useRef, useEffect } from 'react';
import { type ChatMessage } from '../types';
import { SendIcon, AILogoIcon, UserIcon } from './Icons';

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  onAskQuestion: (question: string) => void;
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5 p-3">
        <div className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse-fast [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse-fast [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse-fast"></div>
    </div>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatHistory, onAskQuestion, isLoading }) => {
  const [question, setQuestion] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatHistory, isLoading]);
  
  const handleAsk = () => {
    if (!question.trim() || isLoading) return;
    onAskQuestion(question);
    setQuestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-auto max-h-80 overflow-y-auto pr-2 space-y-4">
        {chatHistory.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div key={index} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand-yellow text-brand-dark p-1.5 mt-1">
                    <AILogoIcon />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    isUser 
                    ? 'bg-brand-yellow text-brand-dark-text rounded-br-none' 
                    : 'bg-brand-light-3 dark:bg-brand-dark-3 border border-black/10 dark:border-white/10 rounded-bl-none'
                }`}>
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                </div>
                {isUser && (
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand-light-3 dark:bg-brand-dark-3 text-brand-gray-light dark:text-brand-gray p-1.5 mt-1">
                        <UserIcon />
                    </div>
                )}
              </div>
            );
        })}
        {isLoading && chatHistory[chatHistory.length - 1]?.role === 'user' && (
            <div className="flex items-start gap-3 justify-start">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand-yellow text-brand-dark p-1.5 mt-1">
                    <AILogoIcon />
                </div>
                <div className="bg-brand-light-3 dark:bg-brand-dark-3 border border-black/10 dark:border-white/10 rounded-2xl rounded-bl-none">
                   <TypingIndicator />
                </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a follow-up question..."
          className="w-full py-3 pl-5 pr-16 text-brand-dark-text dark:text-brand-light bg-transparent border border-brand-yellow rounded-full focus:ring-2 focus:ring-brand-yellow/50 focus:outline-none transition-all duration-300 placeholder-brand-gray-light dark:placeholder-brand-gray"
          disabled={isLoading}
        />
        <button
          onClick={handleAsk}
          disabled={!question.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex-shrink-0 flex items-center justify-center bg-brand-yellow text-brand-dark rounded-full disabled:opacity-50 transition-transform duration-200 hover:scale-110 active:scale-100"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
