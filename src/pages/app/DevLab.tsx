import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, BarChart3, History, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '../../contexts/NotificationContext';

type Language = 'python' | 'java' | 'c' | 'cpp';

const TEMPLATES: Record<Language, string> = {
  python: `# Python Code\nprint("Hello, Flowductive!")\n\n# Try some math\nnumbers = [1, 2, 3, 4, 5]\ntotal = sum(numbers)\nprint(f"Sum: {total}")`,
  java: `// Java Code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Flowductive!");\n        \n        int sum = 0;\n        for (int i = 1; i <= 5; i++) {\n            sum += i;\n        }\n        System.out.println("Sum: " + sum);\n    }\n}`,
  c: `// C Code\n#include <stdio.h>\n\nint main() {\n    printf("Hello, Flowductive!\\n");\n    \n    int sum = 0;\n    for (int i = 1; i <= 5; i++) {\n        sum += i;\n    }\n    printf("Sum: %d\\n", sum);\n    return 0;\n}`,
  cpp: `// C++ Code\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Flowductive!" << endl;\n    \n    vector<int> nums = {1, 2, 3, 4, 5};\n    int sum = 0;\n    for (int n : nums) sum += n;\n    cout << "Sum: " << sum << endl;\n    return 0;\n}`,
};

const MOCK_OUTPUTS: Record<Language, string> = {
  python: `Hello, Flowductive!\nSum: 15\n\n[Process completed in 0.18s]`,
  java: `Hello, Flowductive!\nSum: 15\n\n[Process completed in 0.42s]`,
  c: `Hello, Flowductive!\nSum: 15\n\n[Process completed in 0.08s]`,
  cpp: `Hello, Flowductive!\nSum: 15\n\n[Process completed in 0.09s]`,
};

const LANGUAGES: { id: Language; label: string; ext: string }[] = [
  { id: 'python', label: 'Python', ext: '.py' },
  { id: 'java', label: 'Java', ext: '.java' },
  { id: 'c', label: 'C', ext: '.c' },
  { id: 'cpp', label: 'C++', ext: '.cpp' },
];

interface Execution {
  id: string;
  language: Language;
  output: string;
  time: string;
  success: boolean;
  executedAt: string;
}

const DevLab: React.FC = () => {
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(TEMPLATES.python);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<Execution[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setCode(TEMPLATES[lang]);
    setOutput('');
  };

  const run = async () => {
    setRunning(true);
    setOutput('');
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const execTime = (0.08 + Math.random() * 0.5).toFixed(2);
    const success = Math.random() > 0.1;
    const result = success ? MOCK_OUTPUTS[language].replace(/\[.*?\]/, `[Process completed in ${execTime}s]`) : `Error: Runtime exception\n  at line 4: undefined variable 'x'\n\n[Process failed in ${execTime}s]`;
    setOutput(result);
    setRunning(false);
    const entry: Execution = {
      id: crypto.randomUUID(), language, output: result, time: execTime + 's',
      success, executedAt: new Date().toISOString(),
    };
    setHistory(prev => [entry, ...prev.slice(0, 19)]);
    if (success) {
      addNotification({ title: 'DevLab Execution Success', message: `Your ${language} script ran successfully in ${execTime}s.`, type: 'success' });
    }
    toast({ title: success ? `✅ Executed in ${execTime}s` : '❌ Execution failed', variant: success ? 'default' : 'destructive' });
  };

  const successRate = history.length ? Math.round((history.filter(h => h.success).length / history.length) * 100) : 100;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">DevLab</h1>
        <p className="text-sm text-muted-foreground mt-1">Sandbox code execution environment</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card-surface rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-cyan">{history.length}</div>
          <div className="text-xs text-muted-foreground">Executions</div>
        </div>
        <div className="card-surface rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-app-emerald">{successRate}%</div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </div>
        <div className="card-surface rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-app-amber">50/h</div>
          <div className="text-xs text-muted-foreground">Rate Limit</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Editor Panel */}
        <div className="lg:col-span-3 card-surface rounded-xl overflow-hidden">
          {/* Language Selector */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/50">
            {LANGUAGES.map(l => (
              <button key={l.id} onClick={() => selectLanguage(l.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${language === l.id ? 'bg-gradient-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                {l.label}
              </button>
            ))}
            <div className="ml-auto">
              <button onClick={run} disabled={running}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                <Play className="w-3 h-3" /> {running ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>

          <textarea value={code} onChange={e => setCode(e.target.value)}
            className="w-full h-72 p-4 bg-transparent font-mono text-sm resize-none focus:outline-none text-foreground leading-relaxed"
            spellCheck={false} />

          <div className="border-t border-border px-3 py-2">
            <div className="text-xs text-muted-foreground mb-1">stdin (optional)</div>
            <input value={stdin} onChange={e => setStdin(e.target.value)} placeholder="Input data..."
              className="w-full px-3 py-1.5 bg-muted rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground" />
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="card-surface rounded-xl overflow-hidden flex-1">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50">
              <div className={`w-2 h-2 rounded-full ${output ? (output.includes('Error') ? 'bg-app-rose' : 'bg-app-emerald') : 'bg-muted-foreground'}`} />
              <span className="text-xs font-medium">Output Console</span>
            </div>
            <div className="p-4 font-mono text-xs text-foreground min-h-40 whitespace-pre-wrap">
              {running ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-3 h-3 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                  Executing...
                </div>
              ) : output || <span className="text-muted-foreground">Run code to see output here...</span>}
            </div>
          </div>

          {/* History */}
          <div className="card-surface rounded-xl overflow-hidden">
            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Execution History
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform text-muted-foreground ${showHistory ? 'rotate-180' : ''}`} />
            </button>
            {showHistory && (
              <div className="border-t border-border max-h-48 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No executions yet</p>
                ) : history.map(h => (
                  <div key={h.id} className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 last:border-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${h.success ? 'bg-app-emerald' : 'bg-app-rose'}`} />
                    <span className="text-xs text-muted-foreground capitalize">{h.language}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{h.time}</span>
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{new Date(h.executedAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevLab;
