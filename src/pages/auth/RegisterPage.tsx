import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, GraduationCap, BookOpen, Code } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const roles: { value: UserRole; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
  { value: 'student', label: 'Student', desc: 'Track habits, study sessions, and growth', icon: GraduationCap },
  { value: 'teacher', label: 'Teacher', desc: 'Manage workflows and educational tasks', icon: BookOpen },
  { value: 'developer', label: 'Developer', desc: 'Full access including DevLab compiler', icon: Code },
];

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('developer');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password, role);
    setLoading(false);
    if (result.success) {
      toast({ title: result.message });
      navigate('/app/dashboard');
    } else {
      toast({ title: result.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,hsl(192_100%_50%/0.08),transparent_60%)]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Flowductive</span>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start your productivity journey</p>
        </div>
        <div className="card-surface rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="••••••••" minLength={6} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${role === r.value ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-muted text-muted-foreground hover:border-border/80'}`}>
                    <r.icon className={`w-4 h-4 mb-1.5 ${role === r.value ? 'text-cyan' : ''}`} />
                    <div className="text-xs font-medium">{r.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
