'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import {
  BarChart3,
  Bell,
  Board,
  Command,
  FolderKanban,
  Home,
  Keyboard,
  LayoutDashboard,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  Users,
  Zap,
} from 'lucide-react';
import './globals.css';
import api from '../lib/api';
import { useAuth } from '../stores/auth';
import { useWorkspace } from '../stores/workspace';
import { useSocket } from '../hooks/useSocket';
import { Dashboard } from '../components/Dashboard';
import { KanbanBoard } from '../components/KanbanBoard';

export default function App() {
  const { user, isAuthenticated, token, setUser, setToken, logout } = useAuth();
  const { currentWorkspace, setCurrentWorkspace, setStats, setOnlineUsers } = useWorkspace();
  const [showLogin, setShowLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [tasks, setTasks] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [email, setEmail] = useState('demo@taskflow.app');
  const [password, setPassword] = useState('demo123');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const { emitTaskMove, emitTaskCreate } = useSocket();

  // Check auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      fetchUser(savedToken);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toast('Search coming soon!', { icon: '🔍' });
      }
      // ? for shortcuts
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }
      // Cmd + 1,2,3 for navigation
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        setCurrentPage('dashboard');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        setCurrentPage('board');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      const res = await api.get('/auth/me');
      setUser(res.data);
      setToken(authToken);
      setShowLogin(false);
      fetchWorkspaces();
    } catch {
      logout();
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/workspaces');
      setWorkspaces(res.data);
      if (res.data.length > 0) {
        setCurrentWorkspace(res.data[0]);
        fetchProjects(res.data[0].id);
        fetchStats(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async (workspaceId: string) => {
    try {
      const res = await api.get(`/projects?workspaceId=${workspaceId}`);
      if (res.data.length > 0) {
        const project = res.data[0];
        setColumns(project.columns || []);
        fetchTasks(project.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async (projectId: string) => {
    try {
      const res = await api.get(`/tasks?projectId=${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async (workspaceId: string) => {
    try {
      const res = await api.get(`/activity/stats?workspaceId=${workspaceId}`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, token: authToken } = res.data;
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      setShowLogin(false);
      fetchWorkspaces();
      toast.success('Welcome back!');
    } catch {
      toast.error('Invalid credentials');
    }
  };

  const handleTaskMove = useCallback((taskId: string, columnId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId } : t))
    );
  }, []);

  const handleTaskCreate = useCallback((task: any) => {
    setTasks((prev) => [...prev, task]);
    emitTaskCreate?.(task);
  }, [emitTaskCreate]);

  const handleTaskDelete = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.style.background = darkMode ? '#ffffff' : '#0f1115';
    document.body.style.color = darkMode ? '#000000' : '#ffffff';
  };

  if (showLogin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f1115 0%, #1a1f35 100%)' }}>
        <Toaster position="top-center" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--bg-secondary)', padding: 48, borderRadius: 16, width: 400, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: 'var(--accent)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24, fontWeight: 700 }}>TF</div>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Welcome to TaskFlow</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Portfolio Edition - SQLite Powered</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 15 }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 15 }}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: 12, background: 'var(--accent)', border: 'none', borderRadius: 8, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Sign In
            </button>
          </form>
          
          <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-tertiary)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Demo: <strong>demo@taskflow.app</strong> / <strong>demo123</strong></p>
          </div>
          
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['⚡ Real-time', '📊 Analytics', '🔍 Search', '🎨 Modern UI'].map((tag) => (
              <span key={tag} style={{ padding: '4px 12px', background: 'var(--bg-tertiary)', borderRadius: 12, fontSize: 12, color: 'var(--text-secondary)' }}>{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside style={{ width: 260, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>TF</div>
            <div>
              <div style={{ fontWeight: 700 }}>TaskFlow</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Portfolio Edition</div>
            </div>
          </div>
          
          {currentWorkspace && (
            <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Current Workspace</div>
              <div style={{ fontWeight: 600, marginTop: 4 }}>{currentWorkspace.name}</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: 16 }}>
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" page="dashboard" current={currentPage} onClick={setCurrentPage} />
          <NavItem icon={<FolderKanban size={18} />} label="Kanban Board" page="board" current={currentPage} onClick={setCurrentPage} badge={tasks.filter(t => t.columnId === 'col-2').length} />
          <NavItem icon={<BarChart3 size={18} />} label="Analytics" page="analytics" current={currentPage} onClick={setCurrentPage} />
          <NavItem icon={<Users size={18} />} label="Team" page="team" current={currentPage} onClick={setCurrentPage} badge={3} />
          <NavItem icon={<Settings size={18} />} label="Settings" page="settings" current={currentPage} onClick={setCurrentPage} />
        </nav>

        <div style={{ padding: 16, borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={logout}>
            <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user?.email}</div>
            </div>
            <LogOut size={16} color="var(--text-secondary)" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ height: 64, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h2 style={{ fontWeight: 600 }}>{currentPage === 'dashboard' ? 'Dashboard' : 'Kanban Board'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--bg-tertiary)', borderRadius: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <Command size={14} />
              <span>Ctrl+K to search</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setShowShortcuts(true)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 8 }}>
              <Keyboard size={20} />
            </button>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 8 }}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 8, position: 'relative' }}>
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, width: 300, maxHeight: 400, overflow: 'auto', zIndex: 100 }}
                  >
                    <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ fontWeight: 600 }}>Notifications</span>
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>No notifications</div>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} style={{ padding: 12, borderBottom: '1px solid var(--border-color)' }}>{n.message}</div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          {currentPage === 'dashboard' ? (
            <Dashboard key="dashboard" onNavigate={setCurrentPage} />
          ) : (
            <motion.div
              key="board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <KanbanBoard
                tasks={tasks}
                columns={columns}
                onTaskMove={handleTaskMove}
                onTaskCreate={handleTaskCreate}
                onTaskDelete={handleTaskDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 32, width: 400, maxHeight: '80vh', overflow: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Keyboard Shortcuts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <ShortcutItem keys={['Ctrl', 'K']} description="Search tasks" />
                <ShortcutItem keys={['Ctrl', '1']} description="Go to Dashboard" />
                <ShortcutItem keys={['Ctrl', '2']} description="Go to Board" />
                <ShortcutItem keys={['?']} description="Show shortcuts" />
                <ShortcutItem keys={['Esc']} description="Close modal" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, page, current, onClick, badge }: any) {
  const isActive = page === current;
  return (
    <button
      onClick={() => onClick(page)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 8,
        border: 'none',
        background: isActive ? 'var(--accent)' : 'transparent',
        color: isActive ? 'white' : 'var(--text-secondary)',
        cursor: 'pointer',
        marginBottom: 4,
        fontSize: 14,
        fontWeight: 500,
        transition: 'all 0.2s',
      }}
    >
      {icon}
      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
      {badge > 0 && (
        <span style={{ padding: '2px 8px', background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-tertiary)', borderRadius: 12, fontSize: 12 }}>{badge}</span>
      )}
    </button>
  );
}

function ShortcutItem({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{description}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {keys.map((key) => (
          <kbd key={key} style={{ padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}>{key}</kbd>
        ))}
      </div>
    </div>
  );
}
