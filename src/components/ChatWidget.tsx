'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MessageCircle, X, Send, Bot, Loader2, Minus } from 'lucide-react';
import { type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const t = useTranslations('chat');
  const locale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setMessages([{ role: 'assistant', content: t('welcome') }]);
      setHasGreeted(true);
    }
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, hasGreeted, isMinimized, t]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Lanza el chat: primero /api/chat (Next, con Node), y si no hay API
    // (hosting estático), fallback a /chat.php (proxy PHP a OpenRouter).
    const callChat = async (endpoint: string, body: string) => {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data && typeof data.message === 'string') return data as { message: string };
      } catch {
        // JSON inválido o endpoint inexistente
      }
      return null;
    };

    try {
      const body = JSON.stringify({
        messages: [...messages, userMsg],
        locale,
      });
      const data = (await callChat('/api/chat', body)) || (await callChat('/chat.php', body));
      if (!data) throw new Error('No chat endpoint');
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: t('error') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const suggestions = [
    t('suggestions.0' as Parameters<typeof t>[0]),
    t('suggestions.1' as Parameters<typeof t>[0]),
    t('suggestions.2' as Parameters<typeof t>[0]),
    t('suggestions.3' as Parameters<typeof t>[0]),
  ];

  return (
    <>
      {/* FAB button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-terracota-500 text-white shadow-large hover:bg-terracota-600 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
          aria-label={t('title')}
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-3xl shadow-large border border-tinta/10 transition-all duration-300',
            isMinimized ? 'h-16 w-72' : 'w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)]'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-tinta/10 bg-terracota-500 rounded-t-3xl text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm">{t('title')}</p>
                {!isMinimized && (
                  <p className="text-xs text-white/70">{t('poweredBy')}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Minimize"
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label={t('close' as Parameters<typeof t>[0]) || 'Close'}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hidden">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-terracota-100 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                        <Bot size={14} className="text-terracota-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-terracota-500 text-white rounded-tr-sm'
                          : 'bg-crema text-tinta rounded-tl-sm'
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-full bg-terracota-100 flex items-center justify-center flex-shrink-0 mr-2">
                      <Bot size={14} className="text-terracota-600" />
                    </div>
                    <div className="bg-crema rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-terracota-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-terracota-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-terracota-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions — only show when no messages or after welcome */}
                {messages.length <= 1 && !isLoading && (
                  <div className="space-y-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s)}
                        className="w-full text-left text-sm px-4 py-2.5 rounded-xl border border-tinta/10 hover:border-terracota-300 hover:bg-terracota-50 transition-colors text-tinta/70"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-tinta/10">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('placeholder')}
                    className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-tinta/20 bg-crema placeholder:text-tinta/40 focus:outline-none focus:ring-2 focus:ring-terracota-400 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 rounded-xl bg-terracota-500 text-white flex items-center justify-center hover:bg-terracota-600 active:bg-terracota-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={t('send')}
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
