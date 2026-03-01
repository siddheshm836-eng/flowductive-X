import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';

const FocusTimer: React.FC = () => {
  const [duration, setDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [history, setHistory] = useState<{ duration: number; completedAt: string }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setSessions(prev => prev + 1);
            const newEntry = { duration, completedAt: new Date().toISOString() };
            setHistory(prev => [newEntry, ...prev]);
            addNotification({ title: 'Focus Session Complete!', message: `You completed a ${duration}-minute focus session.`, type: 'success' });
            toast({ title: `🎯 ${duration} min session complete!` });
            return duration * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const reset = () => { setRunning(false); setSeconds(duration * 60); };
  const setPreset = (min: number) => { setDuration(min); setSeconds(min * 60); setRunning(false); };

  const pct = ((duration * 60 - seconds) / (duration * 60)) * 100;
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  const circumference = 2 * Math.PI * 88;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Focus Timer</h1>
        <p className="text-sm text-muted-foreground mt-1">Pomodoro-based deep work sessions</p>
      </div>

      <div className="card-surface rounded-2xl p-8 text-center mb-6">
        {/* Ring */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <svg width="200" height="200" className="transform -rotate-90">
            <circle cx="100" cy="100" r="88" strokeWidth="6" stroke="hsl(220,16%,18%)" fill="none" />
            <circle cx="100" cy="100" r="88" strokeWidth="6"
              stroke="hsl(192,100%,50%)" fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (pct / 100) * circumference}
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-bold font-mono">{mins}:{secs}</span>
            <span className="text-xs text-muted-foreground mt-1">{running ? 'Focusing...' : 'Ready'}</span>
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-2 justify-center mb-6">
          {[15, 25, 45, 60].map(m => (
            <button key={m} onClick={() => setPreset(m)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${duration === m ? 'bg-gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {m}m
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <button onClick={() => setRunning(!running)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:shadow-glow-cyan">
            {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
          </button>
          <button onClick={reset} className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Session Counter */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card-surface rounded-xl p-4 text-center">
          <Target className="w-5 h-5 mx-auto mb-2 text-cyan" />
          <div className="text-2xl font-bold">{sessions}</div>
          <div className="text-xs text-muted-foreground">Sessions Today</div>
        </div>
        <div className="card-surface rounded-xl p-4 text-center">
          <Coffee className="w-5 h-5 mx-auto mb-2 text-app-amber" />
          <div className="text-2xl font-bold">{(sessions * duration / 60).toFixed(1)}h</div>
          <div className="text-xs text-muted-foreground">Focus Hours</div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="card-surface rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Session History</h3>
          <div className="space-y-2">
            {history.slice(0, 5).map((h, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{h.duration} min session</span>
                <span className="text-xs text-muted-foreground">{new Date(h.completedAt).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusTimer;
