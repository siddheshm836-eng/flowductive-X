import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

const weekData = [
  { day: 'Mon', productivity: 72, completion: 65, focus: 3.5, devlab: 5 },
  { day: 'Tue', productivity: 85, completion: 80, focus: 5, devlab: 12 },
  { day: 'Wed', productivity: 61, completion: 55, focus: 2.5, devlab: 3 },
  { day: 'Thu', productivity: 90, completion: 88, focus: 6, devlab: 8 },
  { day: 'Fri', productivity: 78, completion: 75, focus: 4, devlab: 7 },
  { day: 'Sat', productivity: 55, completion: 50, focus: 2, devlab: 2 },
  { day: 'Sun', productivity: 82, completion: 78, focus: 4.5, devlab: 6 },
];

const monthData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  score: 55 + Math.random() * 40,
  burnout: 20 + Math.random() * 30,
}));

const ChartCard: React.FC<{ title: string; sub: string; children: React.ReactNode }> = ({ title, sub, children }) => (
  <div className="card-surface rounded-xl p-5">
    <div className="mb-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
    {children}
  </div>
);

const Analytics: React.FC = () => {
  const heatmap = Array.from({ length: 35 }, (_, i) => ({ day: i, value: Math.floor(Math.random() * 5) }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep insights into your productivity patterns</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Avg Productivity', value: '74%', color: 'text-cyan' },
          { label: 'Completion Rate', value: '70%', color: 'text-app-emerald' },
          { label: 'Avg Focus Hours', value: '3.9h', color: 'text-app-blue' },
          { label: 'Total Executions', value: '43', color: 'text-app-violet' },
        ].map(s => (
          <div key={s.label} className="card-surface rounded-xl p-4">
            <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Productivity Trends" sub="Last 7 days">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="gradP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(192,100%,50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(192,100%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,18%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(220,16%,11%)', border: '1px solid hsl(220,16%,18%)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="productivity" stroke="hsl(192,100%,50%)" fill="url(#gradP)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Task Completion Rate" sub="Last 7 days">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,18%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(220,16%,11%)', border: '1px solid hsl(220,16%,18%)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="completion" fill="hsl(160,84%,39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Focus Hours & DevLab Sessions" sub="Last 7 days">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,18%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(220,16%,11%)', border: '1px solid hsl(220,16%,18%)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="focus" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="devlab" stroke="hsl(262,83%,68%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Burnout Trend" sub="Last 30 days">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthData}>
              <defs>
                <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38,92%,50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(38,92%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,18%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(220,16%,11%)', border: '1px solid hsl(220,16%,18%)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="burnout" stroke="hsl(38,92%,50%)" fill="url(#gradB)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Heatmap */}
      <div className="card-surface rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">5-Week Activity Heatmap</h3>
        <div className="flex gap-1 flex-wrap">
          {heatmap.map(d => (
            <div key={d.day} title={`${d.value} activities`} className="w-7 h-7 rounded-sm"
              style={{ background: d.value === 0 ? 'hsl(220,16%,14%)' : `hsl(192,100%,${20 + d.value * 10}%)` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
