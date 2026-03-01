import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Code2, Heart, Activity, Send, RefreshCw } from 'lucide-react';

type Mode = 'assistant' | 'refactor' | 'wellness' | 'habits';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const MODES: { id: Mode; label: string; icon: React.FC<{ className?: string }>; color: string; desc: string }[] = [
  { id: 'assistant', label: 'AI Assistant', icon: Bot, color: 'text-cyan', desc: 'General productivity help' },
  { id: 'refactor', label: 'Refactorization', icon: Code2, color: 'text-app-blue', desc: 'Code improvement & review' },
  { id: 'wellness', label: 'AI Wellness', icon: Heart, color: 'text-app-rose', desc: 'Mental health & balance' },
  { id: 'habits', label: 'Habit Tracker', icon: Activity, color: 'text-app-emerald', desc: 'Build better routines' },
];

const MOCK_RESPONSES: Record<Mode, string[]> = {
  assistant: [
    "I can help you break down your tasks into manageable chunks. What's your biggest challenge right now?",
    "Based on your recent activity, I suggest scheduling your most complex tasks in the morning when focus is highest.",
    "Great question! The Pomodoro technique can significantly boost your productivity. Try 25-minute focused sessions with 5-minute breaks.",
  ],
  refactor: [
    "I notice your function could be simplified. Consider extracting the logic into smaller, single-responsibility functions.",
    "This code pattern could benefit from memoization to avoid unnecessary re-renders. Would you like me to show you how?",
    "The algorithm's time complexity is O(n²). Here's an optimized O(n log n) approach using a hash map...",
  ],
  wellness: [
    "I see you've been coding for 3+ hours. It's time for a proper break — take a 15-minute walk and hydrate!",
    "Your burnout risk has been elevated lately. Let's identify stress triggers and create a recovery plan together.",
    "Practicing the 4-7-8 breathing technique can help reduce anxiety. Inhale for 4 counts, hold for 7, exhale for 8.",
  ],
  habits: [
    "To build a new habit, attach it to an existing routine. What habit do you want to build, and what's your current morning routine?",
    "Your 12-day streak is impressive! Consistency is key. Missing one day is okay — just don't miss two in a row.",
    "The habit loop has three parts: cue, routine, reward. Let's design each part for your target habit.",
  ],
};

const AIChat: React.FC = () => {
  const [mode, setMode] = useState<Mode>('assistant');
  const [messages, setMessages] = useState<Record<Mode, Message[]>>({
    assistant: [],
    refactor: [],
    wellness: [],
    habits: [],
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentMessages = messages[mode];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, typing]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => ({ ...prev, [mode]: [...prev[mode], userMsg] }));
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const responses = MOCK_RESPONSES[mode];
    const aiMsg: Message = {
      id: crypto.randomUUID(), role: 'ai',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
    };
    setMessages(prev => ({ ...prev, [mode]: [...prev[mode], aiMsg] }));
    setTyping(false);
  };

  const clearChat = () => setMessages(prev => ({ ...prev, [mode]: [] }));

  const activeMode = MODES.find(m => m.id === mode)!;

  return (
    <div className="flex flex-col h-full p-4 gap-4 max-w-3xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <p className="text-sm text-muted-foreground mt-1">Your intelligent productivity companion</p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${mode === m.id ? 'border-primary bg-primary/10' : 'border-border bg-muted hover:border-border/80'}`}>
            <m.icon className={`w-4 h-4 flex-shrink-0 ${mode === m.id ? m.color : 'text-muted-foreground'}`} />
            <div>
              <div className="text-xs font-medium">{m.label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 card-surface rounded-2xl flex flex-col overflow-hidden min-h-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <activeMode.icon className={`w-4 h-4 ${activeMode.color}`} />
            <span className="text-sm font-medium">{activeMode.label}</span>
            <span className="text-xs text-muted-foreground">— {activeMode.desc}</span>
          </div>
          <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <activeMode.icon className={`w-10 h-10 mb-3 ${activeMode.color} opacity-50`} />
              <p className="text-sm text-muted-foreground">Start a conversation with {activeMode.label}</p>
            </div>
          )}

          <AnimatePresence>
            {currentMessages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-gradient-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-3 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder={`Ask ${activeMode.label}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
          <button onClick={send} disabled={!input.trim() || typing}
            className="p-2.5 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
