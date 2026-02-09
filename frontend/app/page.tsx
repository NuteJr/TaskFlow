'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Activity,
  CheckCircle2,
  FolderKanban,
  LayoutDashboard,
  Search,
  Users,
  Zap,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';
import api from '../lib/api';
import { useWorkspace } from '../stores/workspace';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const { stats, activities, currentWorkspace, setStats } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentWorkspace) {
      fetchStats();
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      api.get(`/tasks/search?q=${searchQuery}&workspaceId=${currentWorkspace?.id}`)
        .then(res => setSearchResults(res.data))
        .catch(console.error);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, currentWorkspace]);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/activity/stats?workspaceId=${currentWorkspace?.id}`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: stats?.tasksPerDay?.map((d: any) => d.date.slice(5)) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Created',
        data: stats?.tasksPerDay?.map((d: any) => d.count) || [5, 8, 3, 12, 7, 2, 4],
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' as const } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's what's happening in your workspace.</p>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: 8 }}>
            <Search size={18} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: 200 }}
            />
          </div>
          
          {showSearch && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, width: 320, maxHeight: 300, overflow: 'auto', zIndex: 100 }}
            >
              {searchResults.map((task: any) => (
                <div key={task.id} style={{ padding: 12, borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <div style={{ fontWeight: 500 }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{task.status}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<LayoutDashboard size={24} color="#4f46e5" />} title="Total Tasks" value={stats?.totalTasks || 0} trend="+12%" color="#4f46e5" />
        <StatCard icon={<CheckCircle2 size={24} color="#10b981" />} title="Completed" value={stats?.completedTasks || 0} trend={`${stats?.completionRate || 0}%`} color="#10b981" />
        <StatCard icon={<FolderKanban size={24} color="#f59e0b" />} title="Projects" value={stats?.totalProjects || 0} trend="Active" color="#f59e0b" />
        <StatCard icon={<Users size={24} color="#8b5cf6" />} title="Team Members" value={stats?.totalMembers || 0} trend="Online" color="#8b5cf6" />
      </div>

      {/* Charts & Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Activity size={20} />
            <h3 style={{ fontWeight: 600 }}>Activity Overview</h3>
          </div>
          <Bar data={chartData} options={chartOptions} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={20} />
            <h3 style={{ fontWeight: 600 }}>Recent Activity</h3>
          </div>
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            {activities.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 32 }}>No recent activity</p>
            ) : (
              activities.slice(0, 10).map((activity, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <Clock size={16} color="var(--text-secondary)" />
                  <div>
                    <p style={{ fontSize: 14 }}>{activity.message}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{new Date(activity.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 24 }}>
        <StatCardDetail icon={<TrendingUp size={20} />} title="Completion Rate" value={`${stats?.completionRate || 0}%`} subtitle="Tasks completed this week" />
        <StatCardDetail icon={<AlertCircle size={20} />} title="High Priority" value={stats?.tasksByPriority?.find((p: any) => p.priority === 'high')?.count || 0} subtitle="Tasks requiring attention" />
        <StatCardDetail icon={<Clock size={20} />} title="Avg. Completion" value="2.5 days" subtitle="Time to complete tasks" />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, color }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, cursor: 'pointer', border: '1px solid transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        {icon}
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: 12 }}>{trend}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{title}</div>
    </motion.div>
  );
}

function StatCardDetail({ icon, title, value, subtitle }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        {icon}
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{title}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{subtitle}</div>
    </motion.div>
  );
}
