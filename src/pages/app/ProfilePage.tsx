import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, X, GraduationCap, BookOpen, Code2, Calendar, Mail, Award } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ROLE_ICON: Record<UserRole, React.FC<{ className?: string }>> = {
  student: GraduationCap,
  teacher: BookOpen,
  developer: Code2,
};

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'developer');

  const save = () => {
    updateUser({ name, role });
    setEditing(false);
    toast({ title: 'Profile updated!' });
  };

  const cancel = () => {
    setName(user?.name || '');
    setRole(user?.role || 'developer');
    setEditing(false);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const RoleIcon = ROLE_ICON[user?.role || 'developer'];

  const stats = [
    { label: 'Tasks Done', value: '18', icon: Award },
    { label: 'Focus Sessions', value: '24', icon: Calendar },
    { label: 'DevLab Runs', value: '43', icon: Code2 },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Your Flowductive identity</p>
      </div>

      {/* Profile Card */}
      <div className="card-surface rounded-2xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {initials}
            </div>
            {!editing ? (
              <div>
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <RoleIcon className="w-3.5 h-3.5 text-cyan" />
                  <span className="text-sm text-muted-foreground capitalize">{user?.role}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-app-amber/20 text-app-amber font-medium capitalize">{user?.subscription} plan</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input value={name} onChange={e => setName(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <div className="flex gap-2">
                  {(['student', 'teacher', 'developer'] as UserRole[]).map(r => (
                    <button key={r} onClick={() => setRole(r)}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all capitalize ${role === r ? 'bg-gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <>
                <button onClick={save} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={cancel} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-surface rounded-xl p-4 text-center">
            <s.icon className="w-5 h-5 mx-auto mb-2 text-cyan" />
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
