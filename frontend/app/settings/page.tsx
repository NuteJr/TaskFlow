'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Smartphone,
  Save,
  CheckCircle2,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { useAuth } from '../../stores/auth';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState('dark');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, height: 'fit-content' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                marginBottom: 4,
                fontSize: 14,
                fontWeight: 500,
                textAlign: 'left',
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 32 }}>
          {activeTab === 'profile' && <ProfileSettings user={user} />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'appearance' && <AppearanceSettings theme={theme} setTheme={setTheme} />}
          {activeTab === 'security' && <SecuritySettings />}

          {/* Save Button */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            {saved && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981' }}>
                <CheckCircle2 size={18} />
                <span>Saved successfully!</span>
              </motion.div>
            )}
            <button
              onClick={handleSave}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: 'var(--accent)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 600, cursor: 'pointer' }}
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ user }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Profile Information</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div>
          <button style={{ padding: '8px 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)', cursor: 'pointer', marginBottom: 8 }}>
            Change Avatar
          </button>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>JPG, PNG or GIF. Max size 2MB.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>First Name</label>
          <input type="text" defaultValue={user?.firstName} style={{ width: '100%', padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Last Name</label>
          <input type="text" defaultValue={user?.lastName} style={{ width: '100%', padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Email</label>
          <input type="email" defaultValue={user?.email} style={{ width: '100%', padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Bio</label>
          <textarea rows={4} placeholder="Tell us about yourself..." style={{ width: '100%', padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)', resize: 'vertical' }} />
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Notification Preferences</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ToggleItem icon={Mail} title="Email Notifications" description="Receive updates about your tasks via email" defaultChecked />
        <ToggleItem icon={Smartphone} title="Push Notifications" description="Get notified on your mobile device" defaultChecked />
        <ToggleItem icon={Bell} title="Task Assignments" description="When someone assigns you a task" defaultChecked />
        <ToggleItem icon={Bell} title="Due Date Reminders" description="Get reminded before task deadlines" defaultChecked />
        <ToggleItem icon={Bell} title="Team Mentions" description="When someone mentions you in comments" />
        <ToggleItem icon={Globe} title="Weekly Digest" description="Summary of your week's activity" />
      </div>
    </div>
  );
}

function AppearanceSettings({ theme, setTheme }: any) {
  const themes = [
    { id: 'light', label: 'Light', icon: Sun, color: '#fbbf24' },
    { id: 'dark', label: 'Dark', icon: Moon, color: '#4f46e5' },
    { id: 'system', label: 'System', icon: Monitor, color: '#6b7280' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Appearance</h2>
      
      <div style={{ marginBottom: 32 }}>
        <label style={{ display: 'block', marginBottom: 16, fontSize: 14 }}>Theme</label>
        <div style={{ display: 'flex', gap: 16 }}>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              style={{
                flex: 1,
                padding: 20,
                borderRadius: 12,
                border: theme === t.id ? `2px solid ${t.color}` : '2px solid var(--border-color)',
                background: 'var(--bg-tertiary)',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <t.icon size={24} color={t.color} style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 600 }}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 16, fontSize: 14 }}>Accent Color</label>
        <div style={{ display: 'flex', gap: 12 }}>
          {['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
            <button
              key={color}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: color,
                border: 'none',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Security</h2>
      
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Change Password</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Current Password</label>
            <input type="password" style={{ width: '100%', maxWidth: 400, padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>New Password</label>
            <input type="password" style={{ width: '100%', maxWidth: 400, padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Confirm New Password</label>
            <input type="password" style={{ width: '100%', maxWidth: 400, padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: 20, background: '#ef444410', borderRadius: 8, border: '1px solid #ef444430' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ef4444', marginBottom: 8 }}>Danger Zone</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Once you delete your account, there is no going back.</p>
        <button style={{ padding: '10px 20px', background: '#ef4444', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer' }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

function ToggleItem({ icon: Icon, title, description, defaultChecked }: any) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'var(--bg-tertiary)', borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon size={20} color="var(--text-secondary)" />
        <div>
          <div style={{ fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{description}</div>
        </div>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        style={{
          width: 48,
          height: 24,
          borderRadius: 12,
          border: 'none',
          background: checked ? 'var(--accent)' : 'var(--border-color)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute',
          top: 2,
          left: checked ? 26 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'white',
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  );
}
