import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, Smile, Meh, Frown, Zap, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOODS = [
  { icon: Frown, label: 'Rough', color: 'text-app-rose', value: 1 },
  { icon: Meh, label: 'Okay', color: 'text-app-amber', value: 2 },
  { icon: Smile, label: 'Good', color: 'text-app-emerald', value: 3 },
  { icon: ThumbsUp, label: 'Great', color: 'text-app-blue', value: 4 },
  { icon: Zap, label: 'Amazing', color: 'text-cyan', value: 5 },
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDay = (year: number, month: number) => new Date(year, month, 1).getDay();

const DailyLog: React.FC = () => {
  const today = new Date();
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [logs, setLogs] = useState<Record<string, { mood: number; productivity: number; notes: string }>>({});
  const [mood, setMood] = useState(3);
  const [productivity, setProductivity] = useState(7);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const logKey = `${viewDate.year}-${viewDate.month + 1}-${selectedDay}`;
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonth = () => setViewDate(p => p.month === 0 ? { year: p.year - 1, month: 11 } : { ...p, month: p.month - 1 });
  const nextMonth = () => setViewDate(p => p.month === 11 ? { year: p.year + 1, month: 0 } : { ...p, month: p.month + 1 });

  const selectDay = (day: number) => {
    setSelectedDay(day);
    const key = `${viewDate.year}-${viewDate.month + 1}-${day}`;
    const existing = logs[key];
    if (existing) { setMood(existing.mood); setProductivity(existing.productivity); setNotes(existing.notes); }
    else { setMood(3); setProductivity(7); setNotes(''); }
  };

  const saveLog = () => {
    setLogs(prev => ({ ...prev, [logKey]: { mood, productivity, notes } }));
    toast({ title: 'Daily log saved!' });
  };

  const days = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDay = getFirstDay(viewDate.year, viewDate.month);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Daily Log</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your mood, productivity, and reflections</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="card-surface rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-semibold">{monthNames[viewDate.month]} {viewDate.year}</span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center text-xs text-muted-foreground py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: days }, (_, i) => {
              const day = i + 1;
              const key = `${viewDate.year}-${viewDate.month + 1}-${day}`;
              const hasLog = !!logs[key];
              const isSelected = selectedDay === day && viewDate.year === today.getFullYear() && viewDate.month === today.getMonth();
              const isToday = day === today.getDate() && viewDate.year === today.getFullYear() && viewDate.month === today.getMonth();
              return (
                <button key={day} onClick={() => selectDay(day)}
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition-all relative mx-auto block ${
                    selectedDay === day ? 'bg-gradient-primary text-primary-foreground' :
                    isToday ? 'border border-primary text-foreground' : 'hover:bg-muted text-foreground'
                  }`}>
                  {day}
                  {hasLog && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Log Entry */}
        <div className="card-surface rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-semibold">
            {monthNames[viewDate.month]} {selectedDay}, {viewDate.year}
            {logs[logKey] && <span className="ml-2 text-xs text-app-emerald">✓ Saved</span>}
          </h3>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">How are you feeling?</label>
            <div className="flex gap-2">
              {MOODS.map(m => (
                <button key={m.value} onClick={() => setMood(m.value)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border transition-all text-[10px] ${mood === m.value ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}>
                  <m.icon className={`w-4 h-4 ${mood === m.value ? m.color : 'text-muted-foreground'}`} />
                  <span className={mood === m.value ? 'text-foreground' : 'text-muted-foreground'}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-muted-foreground">Productivity</label>
              <span className="text-xs font-semibold text-cyan">{productivity}/10</span>
            </div>
            <input type="range" min={1} max={10} value={productivity} onChange={e => setProductivity(+e.target.value)}
              className="w-full h-1.5 rounded-full bg-muted accent-cyan cursor-pointer" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Notes & Reflections</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
              placeholder="What happened today? Any wins or challenges..."
              className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none placeholder:text-muted-foreground" />
          </div>

          <button onClick={saveLog} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" /> Save Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyLog;
