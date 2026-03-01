import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Shield, Palette, Save } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'developer');
  const [notifFocus, setNotifFocus] = useState(true);
  const [notifBurnout, setNotifBurnout] = useState(true);
  const [notifDaily, setNotifDaily] = useState(false);

  const saveProfile = () => {
    updateUser({ name, role });
    toast({ title: 'Settings saved!' });
  };

  const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button onClick={onChange} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-gradient-primary' : 'bg-muted'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  const ROLES: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'developer', label: 'Developer' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences and account</p>
      </div>

      <div className="space-y-4">
        {/* Profile Settings */}
        <div className="card-surface rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-cyan" />
            <h2 className="text-sm font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Display Name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Role</label>
              <div className="flex gap-2">
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => setRole(r.value)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${role === r.value ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-muted text-muted-foreground hover:text-foreground'}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={saveProfile} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="card-surface rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-app-violet" />
            <h2 className="text-sm font-semibold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
              <div>
                <p className="text-sm font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                <p className="text-xs text-muted-foreground">Toggle between dark and light theme</p>
              </div>
            </div>
            <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
          </div>
        </div>

        {/* Notifications */}
        <div className="card-surface rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-app-amber" />
            <h2 className="text-sm font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Focus Session Complete', desc: 'Notify when a focus session ends', checked: notifFocus, toggle: () => setNotifFocus(!notifFocus) },
              { label: 'Burnout Risk Alerts', desc: 'Alert when risk level increases', checked: notifBurnout, toggle: () => setNotifBurnout(!notifBurnout) },
              { label: 'Daily Log Reminder', desc: 'Remind to fill daily log each evening', checked: notifDaily, toggle: () => setNotifDaily(!notifDaily) },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Toggle checked={item.checked} onChange={item.toggle} />
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="card-surface rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">Account</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subscription</span>
              <span className="capitalize px-2 py-0.5 rounded-full text-xs bg-app-amber/20 text-app-amber font-medium">{user?.subscription}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Member since</span>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
