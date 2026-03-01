import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Kanban, Calendar, Timer, Bot, AlertTriangle,
  Code2, BarChart3, Bell, Settings, User, Zap, ChevronLeft, ChevronRight,
  LogOut, Sun, Moon, Menu, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/workflow', icon: Kanban, label: 'Workflow' },
  { to: '/app/daily-log', icon: Calendar, label: 'Daily Log' },
  { to: '/app/focus', icon: Timer, label: 'Focus Timer' },
  { to: '/app/ai-chat', icon: Bot, label: 'AI Chat' },
  { to: '/app/burnout', icon: AlertTriangle, label: 'Burnout Risk' },
  { to: '/app/devlab', icon: Code2, label: 'DevLab' },
  { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/app/notifications', icon: Bell, label: 'Notifications' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const SidebarContent = () => (
    <>
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-7 h-7 rounded-lg bg-gradient-primary flex-shrink-0 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-bold text-sm">Flowductive</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all relative ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              } ${collapsed ? 'justify-center' : ''}`
            }>
            {({ isActive }) => (
              <>
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
                {item.to === '/app/notifications' && unreadCount > 0 && (
                  <span className={`${collapsed ? 'absolute top-1 right-1' : 'ml-auto'} w-4 h-4 rounded-full bg-cyan text-primary-foreground text-[10px] flex items-center justify-center font-bold`}>
                    {unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <button onClick={() => { navigate('/app/profile'); setMobileOpen(false); }}
          className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg hover:bg-sidebar-accent/50 transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-gradient-primary flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary-foreground">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              <div className="text-xs font-medium text-sidebar-accent-foreground truncate">{user?.name}</div>
              <div className="text-[10px] text-sidebar-foreground capitalize">{user?.role}</div>
            </div>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${collapsed ? 'w-14' : 'w-56'}`}>
        <SidebarContent />
        <button onClick={() => setCollapsed(!collapsed)} className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full w-5 h-8 bg-sidebar border border-sidebar-border rounded-r-md flex items-center justify-center text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors z-10">
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -224 }} animate={{ x: 0 }} exit={{ x: -224 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed left-0 top-0 bottom-0 w-56 bg-sidebar border-r border-sidebar-border z-50 md:hidden flex flex-col">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/80 backdrop-blur-sm flex-shrink-0">
          <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileOpen(true)}>
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => navigate('/app/notifications')} className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan" />}
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {initials}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user?.name?.split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-xl shadow-card z-50 overflow-hidden">
                    <div className="p-2">
                      <button onClick={() => { navigate('/app/profile'); setProfileOpen(false); }} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                        <User className="w-4 h-4" /> View Profile
                      </button>
                      <button onClick={() => { navigate('/app/settings'); setProfileOpen(false); }} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <div className="border-t border-border my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-destructive">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
