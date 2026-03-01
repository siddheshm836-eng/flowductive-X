import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, Zap, BarChart3, Code2, Brain, Target, Clock, ArrowRight, ChevronRight, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const features = [
    { icon: BarChart3, title: 'Smart Dashboard', desc: 'Real-time productivity metrics, burnout risk indicators, and habit consistency heatmaps.', color: 'text-cyan' },
    { icon: Target, title: 'Workflow Board', desc: 'Kanban-style task management with drag & drop across Backlog, In Progress, Review and Done.', color: 'text-app-blue' },
    { icon: Brain, title: 'AI Assistant', desc: '4 AI modes: Assistant, Refactorization, Wellness, and Habit Tracker — all in one chat interface.', color: 'text-app-violet' },
    { icon: Code2, title: 'DevLab Compiler', desc: 'Execute Java, Python, C, C++ in secure sandboxed containers with performance analytics.', color: 'text-app-emerald' },
    { icon: Clock, title: 'Focus Timer', desc: 'Pomodoro-based focus sessions with session tracking, burnout integration, and stats.', color: 'text-app-amber' },
    { icon: Zap, title: 'Burnout Engine', desc: 'AI-powered burnout risk scoring using DevLab, focus, tasks, and daily log data.', color: 'text-app-rose' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Flowductive</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login" className="text-sm px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">Get Started</Link>
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border px-4 py-4 flex flex-col gap-3">
            <a href="#features" className="text-sm text-muted-foreground">Features</a>
            <a href="#about" className="text-sm text-muted-foreground">About</a>
            <a href="#contact" className="text-sm text-muted-foreground">Contact</a>
            <Link to="/login" className="text-sm text-muted-foreground">Sign In</Link>
            <Link to="/register" className="text-sm px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-center">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 hero-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,hsl(192_100%_50%/0.12),transparent_70%)]" />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              Now in Beta — Free for all roles
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight">
              The complete
              <br />
              <span className="gradient-text">productivity OS</span>
              <br />
              for builders
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Flowductive unifies tasks, code execution, AI assistance, burnout detection, and deep focus into one seamless platform — built for students, teachers, and developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:shadow-glow-cyan text-sm">
                Start for free <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/login')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium">
                Sign in <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to <span className="gradient-text">flow</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">11 integrated modules that work together to maximize your productivity and wellbeing.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.4 }} viewport={{ once: true }} className="card-surface p-6 rounded-2xl hover:border-border/80 transition-all group cursor-default">
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Built for the <span className="gradient-text">modern builder</span></h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Flowductive was designed to eliminate tool-switching friction. Whether you're a developer running code, a student tracking habits, or a teacher managing workflows — everything integrates into one unified productivity layer with AI-driven insights.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[{ val: '11', label: 'Modules' }, { val: '4', label: 'AI Modes' }, { val: '4', label: 'Languages' }].map(s => (
              <div key={s.label} className="card-surface p-4 rounded-xl">
                <div className="text-2xl font-bold gradient-text">{s.val}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get in touch</h2>
          <p className="text-muted-foreground mb-8">Have questions or feedback? We'd love to hear from you.</p>
          <div className="card-surface p-6 rounded-2xl text-left space-y-4">
            <input placeholder="Your name" className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground" />
            <input placeholder="Email address" className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground" />
            <textarea rows={4} placeholder="Your message" className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none text-foreground placeholder:text-muted-foreground" />
            <button className="w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">Send Message</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Flowductive</span>
        </div>
        <p className="text-xs text-muted-foreground">© 2025 Flowductive. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
