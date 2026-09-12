import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, User, Send, X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const QUICK_SUGGESTIONS = [
  "🚧 Pothole complaint kaise karein?",
  "📋 Check my report status",
  "📞 Road emergency helpline",
  "💡 Street light issue report"
];

const ChatPopup = ({ isOpen = true, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: "Namaste! 🙏 Main Sadak Suraksha AI Assistant hoon. Aap road damage report karne, complaint status janne, ya emergency helplines ke baare mein pooch sakte hain!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query || !query.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      content: query.trim(),
      timestamp: new Date()
    };

    setMessages(msgs => [...msgs, userMsg]);
    if (typeof textToSend !== 'string') setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
        message: query.trim(),
        sessionId: 'sadaksuraksha-ui'
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      });

      const botReply = response.data.data?.response || "Sorry, I couldn't process your request right now.";

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        content: botReply,
        timestamp: new Date()
      };

      setMessages(msgs => [...msgs, botMsg]);
    } catch (error) {
      console.error('Chatbot API Error:', error);
      let errMsg = "Server se connect hone mein samasya aa rahi hai. Kripya dobara prayas karein.";
      if (error.code === 'ECONNABORTED') {
        errMsg = "Request timed out. Please try again.";
      }
      setMessages(msgs => [
        ...msgs,
        {
          id: Date.now() + 1,
          sender: 'bot',
          content: errMsg,
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`fixed left-4 sm:left-6 bottom-4 sm:bottom-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] max-h-[85vh] rounded-3xl shadow-2xl z-[1000] flex flex-col overflow-hidden transition-all duration-300 ease-out border border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl ${
        isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <Bot size={22} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base tracking-tight leading-none">Sadak Suraksha AI</h3>
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                <Sparkles size={10} />
                Live
              </span>
            </div>
            <p className="text-xs text-blue-100/90 mt-1">24/7 Road Safety Assistant</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/80 dark:bg-slate-950/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full animate-in fade-in duration-200`}
          >
            <div className="flex items-end gap-2 max-w-[85%]">
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                    : msg.isError
                    ? 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-bl-none'
                    : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-bl-none shadow-sm'
                }`}
                style={{ wordBreak: 'break-word' }}
              >
                <span>{msg.content}</span>
                <div
                  className={`text-[10px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400 dark:text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <User size={16} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex justify-start w-full animate-in fade-in duration-200">
            <div className="flex items-end gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length < 4 && (
        <div className="px-4 py-2 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800/80 flex gap-2 overflow-x-auto no-scrollbar">
          {QUICK_SUGGESTIONS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-xs shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question in Hindi or English..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Send message"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPopup;


