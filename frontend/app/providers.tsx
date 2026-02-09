'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Bell,
  Command,
  Keyboard,
  Sun,
  Moon,
  Search,
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../stores/auth';
import { useWorkspace } from '../stores/workspace';
import './globals.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppLayout>{children}</AppLayout>
      <Toaster position="top-right" />
    </>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, setUser, setToken, logout } = useAuth();
  const { currentWorkspace, onlineUsers } = useWorkspace();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && pathname !== '/login') {
      router.push('/login');
    } else if (token && !isAuthenticated) {
      fetchUser(token);
    }
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toast('Search coming soon!', { icon: '🔍' });
      }
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchUser = async (token: string) => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      logout();
      router.push('/login');
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.style.background = darkMode ? '#ffffff' : '#0f1115';
    document.body.style.color = darkMode ? '#000000' : '#ffffff';
  };

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: FolderKanban, label: 'Kanban Board', href: '/board', badge: 3 },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Users, label: 'Team', href: '/team', badge: onlineUsers.length || 3 },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>TF</div>
            <div>
              <div style={{ fontWeight: 700 }}>TaskFlow</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Portfolio</div>
            </div>
          </div>
          
          {currentWorkspace && (
            <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Workspace</div>
              <div style={{ fontWeight: 600, marginTop: 4 }}>{currentWorkspace.name}</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: 16 }}>
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} isActive={pathname === item.href} />
          ))}
        </nav>

        <div style={{ padding: 16, borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={logout}>
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
            <h2 style={{ fontWeight: 600 }}>{navItems.find(n => n.href === pathname)?.label || 'Dashboard'}</h2>
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
                {notifications.length > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </main>

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowShortcuts(false)}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 32, width: 400 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Keyboard Shortcuts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ShortcutItem keys={['Ctrl', 'K']} description="Search tasks" />
              <ShortcutItem keys={['Ctrl', '1']} description="Go to Dashboard" />
              <ShortcutItem keys={['Ctrl', '2']} description="Go to Board" />
              <ShortcutItem keys={['?']} description="Show shortcuts" />
              <ShortcutItem keys={['Esc']} description="Close modal" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon: Icon, label, href, isActive, badge }: any) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 8,
        background: isActive ? 'var(--accent)' : 'transparent',
        color: isActive ? 'white' : 'var(--text-secondary)',
        cursor: 'pointer',
        marginBottom: 4,
        fontSize: 14,
        fontWeight: 500,
        transition: 'all 0.2s',
      }}>
        <Icon size={18} />
        <span style={{ flex: 1 }}>{label}</span>
        {badge > 0 && (
          <span style={{ padding: '2px 8px', background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-tertiary)', borderRadius: 12, fontSize: 12 }}>{badge}</span>
        )}
      </div>
    </Link>
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
