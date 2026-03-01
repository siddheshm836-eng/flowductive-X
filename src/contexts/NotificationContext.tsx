import React, { createContext, useContext, useState } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL: Notification[] = [
  { id: '1', title: 'Focus Session Complete', message: 'You completed a 25-minute focus session. Great work!', type: 'success', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', title: 'Burnout Risk Alert', message: 'Your burnout risk has increased. Consider taking a break.', type: 'warning', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', title: 'Daily Log Reminder', message: "Don't forget to fill in today's daily log.", type: 'info', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', title: 'DevLab Execution Success', message: 'Your Python script ran successfully in 0.24s.', type: 'success', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    setNotifications(prev => [{
      ...n, id: crypto.randomUUID(), read: false, createdAt: new Date().toISOString()
    }, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
