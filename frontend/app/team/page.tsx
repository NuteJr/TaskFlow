'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Mail,
  MoreVertical,
  Shield,
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const teamMembers = [
    { id: 1, name: 'Alex Doe', email: 'alex@example.com', role: 'Owner', status: 'active', tasksCompleted: 24, avatar: 'AD', color: '#4f46e5' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'active', tasksCompleted: 19, avatar: 'JS', color: '#10b981' },
    { id: 3, name: 'John Wilson', email: 'john@example.com', role: 'Member', status: 'active', tasksCompleted: 31, avatar: 'JW', color: '#f59e0b' },
    { id: 4, name: 'Sarah Brown', email: 'sarah@example.com', role: 'Member', status: 'offline', tasksCompleted: 15, avatar: 'SB', color: '#8b5cf6' },
    { id: 5, name: 'Mike Johnson', email: 'mike@example.com', role: 'Guest', status: 'active', tasksCompleted: 8, avatar: 'MJ', color: '#ef4444' },
  ];

  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Team</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Manage your team members and their permissions</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--accent)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 600, cursor: 'pointer' }}
        >
          <UserPlus size={18} />
          Invite Member
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <TeamStat icon={<Users size={20} />} value="5" label="Total Members" color="#4f46e5" />
        <TeamStat icon={<CheckCircle2 size={20} />} value="4" label="Active Now" color="#10b981" />
        <TeamStat icon={<Clock size={20} />} value="127" label="Tasks Completed" color="#f59e0b" />
        <TeamStat icon={<Shield size={20} />} value="2" label="Admins" color="#8b5cf6" />
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 8, maxWidth: 400 }}>
          <Search size={18} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', flex: 1 }}
          />
        </div>
      </div>

      {/* Team List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--bg-secondary)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 50px', padding: '16px 24px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
          <span>Member</span>
          <span>Role</span>
          <span>Status</span>
          <span>Tasks</span>
          <span></span>
        </div>

        {filteredMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 50px', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'white' }}>
                {member.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{member.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{member.email}</div>
              </div>
            </div>

            <div>
              <span style={{ padding: '4px 12px', background: member.role === 'Owner' ? '#4f46e520' : member.role === 'Admin' ? '#10b98120' : '#6b728020', color: member.role === 'Owner' ? '#4f46e5' : member.role === 'Admin' ? '#10b981' : '#6b7280', borderRadius: 12, fontSize: 12, fontWeight: 500 }}>
                {member.role}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: member.status === 'active' ? '#10b981' : '#6b7280' }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{member.status}</span>
            </div>

            <div style={{ fontWeight: 600 }}>{member.tasksCompleted}</div>

            <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <MoreVertical size={18} />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowInviteModal(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 32, width: 400 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Invite Team Member</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Send an invitation to join your workspace</p>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Email Address</label>
              <input type="email" placeholder="colleague@example.com" style={{ width: '100%', padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Role</label>
              <select style={{ width: '100%', padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowInviteModal(false)} style={{ flex: 1, padding: 12, background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
              <button style={{ flex: 1, padding: 12, background: 'var(--accent)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 600, cursor: 'pointer' }}>Send Invite</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function TeamStat({ icon, value, label, color }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color }}>
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</div>
    </motion.div>
  );
}
