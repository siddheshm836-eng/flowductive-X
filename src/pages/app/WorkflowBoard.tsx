import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

interface Task {
  id: string;
  title: string;
  tag?: string;
  priority: 'low' | 'medium' | 'high';
}

const INITIAL: Record<Status, Task[]> = {
  backlog: [
    { id: '1', title: 'Set up CI/CD pipeline', tag: 'DevOps', priority: 'medium' },
    { id: '2', title: 'Research competitor analytics', tag: 'Research', priority: 'low' },
  ],
  todo: [
    { id: '3', title: 'Build auth middleware', tag: 'Backend', priority: 'high' },
    { id: '4', title: 'Design dashboard wireframes', tag: 'Design', priority: 'medium' },
  ],
  'in-progress': [
    { id: '5', title: 'Implement Kanban board', tag: 'Frontend', priority: 'high' },
    { id: '6', title: 'Write API documentation', tag: 'Docs', priority: 'medium' },
  ],
  review: [
    { id: '7', title: 'Code review: Focus timer', tag: 'Frontend', priority: 'medium' },
  ],
  done: [
    { id: '8', title: 'Set up project structure', tag: 'Setup', priority: 'high' },
    { id: '9', title: 'Create design system', tag: 'Design', priority: 'high' },
    { id: '10', title: 'Configure TypeScript', tag: 'Setup', priority: 'low' },
  ],
};

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'text-muted-foreground' },
  { id: 'todo', label: 'To Do', color: 'text-app-blue' },
  { id: 'in-progress', label: 'In Progress', color: 'text-app-amber' },
  { id: 'review', label: 'Review', color: 'text-app-violet' },
  { id: 'done', label: 'Done', color: 'text-app-emerald' },
];

const PRIORITY_COLOR: Record<string, string> = {
  high: 'bg-app-rose/20 text-app-rose',
  medium: 'bg-app-amber/20 text-app-amber',
  low: 'bg-app-emerald/20 text-app-emerald',
};

const WorkflowBoard: React.FC = () => {
  const [columns, setColumns] = useState(INITIAL);
  const [dragTask, setDragTask] = useState<{ task: Task; from: Status } | null>(null);
  const [adding, setAdding] = useState<Status | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleDragStart = (task: Task, from: Status) => setDragTask({ task, from });

  const handleDrop = (to: Status) => {
    if (!dragTask || dragTask.from === to) { setDragTask(null); return; }
    setColumns(prev => ({
      ...prev,
      [dragTask.from]: prev[dragTask.from].filter(t => t.id !== dragTask.task.id),
      [to]: [...prev[to], dragTask.task],
    }));
    setDragTask(null);
  };

  const addTask = (col: Status) => {
    if (!newTitle.trim()) return;
    const task: Task = { id: crypto.randomUUID(), title: newTitle.trim(), priority: 'medium' };
    setColumns(prev => ({ ...prev, [col]: [...prev[col], task] }));
    setNewTitle('');
    setAdding(null);
  };

  const removeTask = (col: Status, id: string) => {
    setColumns(prev => ({ ...prev, [col]: prev[col].filter(t => t.id !== id) }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Workflow Board</h1>
        <p className="text-sm text-muted-foreground mt-1">Drag and drop tasks across columns</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <div key={col.id} className="flex-shrink-0 w-64"
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold uppercase tracking-wide ${col.color}`}>{col.label}</span>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{columns[col.id].length}</span>
              </div>
              <button onClick={() => setAdding(col.id)} className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 min-h-12">
              {columns[col.id].map(task => (
                <motion.div key={task.id} layout draggable onDragStart={() => handleDragStart(task, col.id)}
                  className="card-surface rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-border/80 transition-all group">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{task.title}</p>
                    <button onClick={() => removeTask(col.id, task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground flex-shrink-0">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {task.tag && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{task.tag}</span>}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLOR[task.priority]}`}>{task.priority}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {adding === col.id && (
              <div className="mt-2">
                <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addTask(col.id); if (e.key === 'Escape') setAdding(null); }}
                  placeholder="Task name..." className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
                <div className="flex gap-2 mt-1.5">
                  <button onClick={() => addTask(col.id)} className="flex-1 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">Add</button>
                  <button onClick={() => setAdding(null)} className="flex-1 py-1.5 rounded-md bg-muted text-muted-foreground text-xs hover:text-foreground transition-colors">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowBoard;
