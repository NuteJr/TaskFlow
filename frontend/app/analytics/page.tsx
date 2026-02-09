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
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import api from '../../lib/api';
import { useWorkspace } from '../../stores/workspace';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function AnalyticsPage() {
  const { currentWorkspace, stats, setStats } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (currentWorkspace) {
      fetchStats();
    }
  }, [currentWorkspace]);

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

  const taskStatusData = {
    labels: ['Backlog', 'To Do', 'In Progress', 'Done'],
    datasets: [{
      data: [
        stats?.tasksByStatus?.backlog || 0,
        stats?.tasksByStatus?.todo || 0,
        stats?.tasksByStatus?.in_progress || 0,
        stats?.tasksByStatus?.done || 0,
      ],
      backgroundColor: ['#6b7280', '#3b82f6', '#eab308', '#22c55e'],
      borderWidth: 0,
    }],
  };

  const priorityData = {
    labels: ['Low', 'Medium', 'High', 'Urgent'],
    datasets: [{
      label: 'Tasks by Priority',
      data: [
        stats?.tasksByPriority?.find((p: any) => p.priority === 'low')?.count || 0,
        stats?.tasksByPriority?.find((p: any) => p.priority === 'medium')?.count || 0,
        stats?.tasksByPriority?.find((p: any) => p.priority === 'high')?.count || 0,
        stats?.tasksByPriority?.find((p: any) => p.priority === 'urgent')?.count || 0,
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#dc2626'],
      borderRadius: 4,
    }],
  };

  const velocityData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Completed Tasks',
      data: [12, 19, 15, 25],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Loading analytics...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Track your team's productivity and progress</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: timeRange === range ? 'var(--accent)' : 'var(--bg-secondary)',
                color: timeRange === range ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<CheckCircle2 size={24} />} title="Completion Rate" value={`${stats?.completionRate || 0}%`} trend="+5%" color="#10b981" />
        <StatCard icon={<TrendingUp size={24} />} title="Velocity" value="18" trend="tasks/week" color="#4f46e5" />
        <StatCard icon={<Clock size={24} />} title="Avg. Lead Time" value="2.4" trend="days" color="#f59e0b" />
        <StatCard icon={<AlertCircle size={24} />} title="Blocked" value="3" trend="tasks" color="#ef4444" />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <ChartCard title="Tasks by Status" icon={<BarChart3 size={20} />}>
          <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
            <Pie data={taskStatusData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </ChartCard>

        <ChartCard title="Tasks by Priority" icon={<AlertCircle size={20} />}>
          <Bar data={priorityData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
        </ChartCard>

        <ChartCard title="Team Velocity" icon={<TrendingUp size={20} />}>
          <Line data={velocityData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
        </ChartCard>

        <ChartCard title="Productivity Insights" icon={<Users size={20} />}>
          <div style={{ padding: 20 }}>
            <InsightItem label="Most productive day" value="Tuesday" />
            <InsightItem label="Peak hours" value="10 AM - 2 PM" />
            <InsightItem label="Tasks per member" value="12.5 avg" />
            <InsightItem label="Sprint completion" value="94%" />
          </div>
        </ChartCard>
      </div>

      {/* Team Performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24, background: 'var(--bg-secondary)', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Users size={20} />
          <h3 style={{ fontWeight: 600 }}>Team Performance</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <TeamMember name="Alex Doe" tasksCompleted={24} avatar="AD" />
          <TeamMember name="Jane Smith" tasksCompleted={19} avatar="JS" />
          <TeamMember name="John Wilson" tasksCompleted={31} avatar="JW" />
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, color }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ padding: 8, background: `${color}20`, borderRadius: 8, color }}>{icon}</div>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{title}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{trend}</div>
    </motion.div>
  );
}

function ChartCard({ title, icon, children }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {icon}
        <h3 style={{ fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ height: 250 }}>{children}</div>
    </motion.div>
  );
}

function InsightItem({ label, value }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function TeamMember({ name, tasksCompleted, avatar }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--bg-tertiary)', borderRadius: 8 }}>
      <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>{avatar}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{tasksCompleted} tasks completed</div>
      </div>
      <div style={{ width: 50, height: 4, background: 'var(--bg-secondary)', borderRadius: 2 }}>
        <div style={{ width: '80%', height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
      </div>
    </div>
  );
}
