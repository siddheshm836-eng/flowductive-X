import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Code2, Timer, CheckSquare, TrendingDown, TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

const burnoutScore = 38;
const getRiskLevel = (score: number) => {
  if (score < 40) return { label: 'Low', color: 'text-app-emerald', bg: 'bg-app-emerald/10', bar: 'bg-app-emerald' };
  if (score < 70) return { label: 'Medium', color: 'text-app-amber', bg: 'bg-app-amber/10', bar: 'bg-app-amber' };
  return { label: 'High', color: 'text-app-rose', bg: 'bg-app-rose/10', bar: 'bg-app-rose' };
};

const factors = [
  { label: 'Failed Executions', value: 12, icon: Code2, impact: 'low', detail: '2 failures / 10 runs' },
  { label: 'Continuous Coding', value: 35, icon: Timer, impact: 'low', detail: '3.5h today' },
  { label: 'Task Completion', value: 75, icon: CheckSquare, impact: 'good', detail: '18/24 tasks done' },
  { label: 'Focus Sessions', value: 60, icon: Timer, impact: 'medium', detail: '4 sessions today' },
  { label: 'DevLab Success Rate', value: 94, icon: Code2, impact: 'good', detail: '94% last 10 runs' },
];

const suggestions = [
  'Take a 15-minute walk away from screens every 2 hours.',
  'Your task completion is great! Keep the momentum but avoid overloading.',
  'Schedule a rest day this weekend — you\'ve been consistent for 12 days.',
  'Try the 4-7-8 breathing technique during transitions between tasks.',
  'Consider reducing DevLab sessions after 10 PM to improve sleep quality.',
];

const risk = getRiskLevel(burnoutScore);

const BurnoutRisk: React.FC = () => {
  const radialData = [{ name: 'Burnout', value: burnoutScore, fill: burnoutScore < 40 ? 'hsl(160,84%,39%)' : burnoutScore < 70 ? 'hsl(38,92%,50%)' : 'hsl(350,89%,60%)' }];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Burnout Risk</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered analysis of your work patterns</p>
      </div>

      {/* Score Card */}
      <div className={`card-surface rounded-2xl p-6 mb-6 border ${burnoutScore < 40 ? 'border-app-emerald/30' : burnoutScore < 70 ? 'border-app-amber/30' : 'border-app-rose/30'}`}>
        <div className="flex items-center gap-6">
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="60%" outerRadius="100%" data={radialData} startAngle={90} endAngle={90 - (burnoutScore / 100) * 360}>
                <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'hsl(220,16%,14%)' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Burnout Score</div>
            <div className={`text-5xl font-bold ${risk.color}`}>{burnoutScore}</div>
            <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-sm font-semibold ${risk.bg} ${risk.color}`}>
              {burnoutScore < 40 ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {risk.label} Risk
            </div>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">
              {burnoutScore < 40 ? 'You\'re in great shape! Keep maintaining healthy work habits.' :
               burnoutScore < 70 ? 'Some warning signs detected. Consider adjusting your schedule.' :
               'High burnout risk. Take immediate action to rest and recover.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Factor Breakdown */}
        <div className="card-surface rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Contributing Factors</h3>
          <div className="space-y-4">
            {factors.map(f => (
              <div key={f.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <f.icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm">{f.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {f.impact === 'good' ? <TrendingUp className="w-3 h-3 text-app-emerald" /> : f.impact === 'medium' ? <TrendingDown className="w-3 h-3 text-app-amber" /> : null}
                    <span className="text-xs text-muted-foreground">{f.detail}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${f.impact === 'good' ? 'bg-app-emerald' : f.impact === 'medium' ? 'bg-app-amber' : 'bg-app-blue'}`}
                    style={{ width: `${f.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="card-surface rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Recommendations</h3>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex gap-3 p-3 rounded-lg bg-muted">
                <div className="w-5 h-5 rounded-full bg-cyan/20 text-cyan flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurnoutRisk;
