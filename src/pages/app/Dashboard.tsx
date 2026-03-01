import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckSquare, Zap, Clock, Flame, Activity, Code2, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const productivityData = [
  { day: 'Mon', score: 72, focus: 3.5 },
  { day: 'Tue', score: 85, focus: 5 },
  { day: 'Wed', score: 61, focus: 2.5 },
  { day: 'Thu', score: 90, focus: 6 },
  { day: 'Fri', score: 78, focus: 4 },
  { day: 'Sat', score: 55, focus: 2 },
  { day: 'Sun', score: 82, focus: 4.5 },
];

const heatmapData = Array.from({ length: 35 }, (_, i) => ({
  day: i,
  value: Math.floor(Math.random() * 5),
}));

const StatCard: React.FC<{ icon: React.FC<{ className?: string }>; label: string; value: string; sub?: string; color: string }> = ({ icon: Icon, label, value, sub, color }) => (
  <div className="card-surface rounded-xl p-4 flex items-start gap-3">
    <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const burnout = 38;
  const burnoutColor = burnout < 40 ? 'text-app-emerald' : burnout < 70 ? 'text-app-amber' : 'text-app-rose';
  const burnoutLabel = burnout < 40 ? 'Low' : burnout < 70 ? 'Medium' : 'High';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your productivity today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={CheckSquare} label="Total Tasks" value="24" sub="6 due today" color="text-cyan" />
          <StatCard icon={Zap} label="Completed" value="18" sub="75% rate" color="text-app-emerald" />
          <StatCard icon={Activity} label="Productivity" value="82%" sub="+5% this week" color="text-app-blue" />
          <StatCard icon={Clock} label="Focus Hours" value="4.5h" sub="Today" color="text-app-violet" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Flame} label="Habit Streak" value="12 days" sub="Personal best!" color="text-app-amber" />
          <div className="card-surface rounded-xl p-4 col-span-1">
            <div className="text-xs text-muted-foreground mb-1">Burnout Risk</div>
            <div className={`text-2xl font-bold ${burnoutColor}`}>{burnoutLabel}</div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${burnout < 40 ? 'bg-app-emerald' : burnout < 70 ? 'bg-app-amber' : 'bg-app-rose'}`} style={{ width: `${burnout}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{burnout}/100</div>
          </div>
          <StatCard icon={Code2} label="DevLab Rate" value="94%" sub="Last 10 runs" color="text-app-emerald" />
          <StatCard icon={TrendingUp} label="Consistency" value="87%" sub="This month" color="text-cyan" />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="card-surface rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">Productivity Score (7 days)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(192,100%,50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(192,100%,50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,18%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(220,16%,11%)', border: '1px solid hsl(220,16%,18%)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="hsl(192,100%,50%)" fill="url(#gradScore)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card-surface rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">Focus Hours (7 days)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,18%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(220,10%,50%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(220,16%,11%)', border: '1px solid hsl(220,16%,18%)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="focus" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap */}
        <div className="card-surface rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Activity Heatmap (Past 5 Weeks)</h3>
          <div className="flex gap-1 flex-wrap">
            {heatmapData.map((d) => (
              <div key={d.day} title={`${d.value} activities`}
                className="w-6 h-6 rounded-sm transition-colors"
                style={{ background: d.value === 0 ? 'hsl(220,16%,14%)' : `hsl(192,100%,${20 + d.value * 10}%)` }} />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Less</span>
            {[0, 1, 2, 3, 4].map(v => (
              <div key={v} className="w-3 h-3 rounded-sm" style={{ background: v === 0 ? 'hsl(220,16%,14%)' : `hsl(192,100%,${20 + v * 10}%)` }} />
            ))}
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
