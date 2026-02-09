'use client';

import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, MoreHorizontal, Trash2, User, Filter, SortAsc } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import api from '../../lib/api';
import { useWorkspace } from '../../stores/workspace';
import toast from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  columnId: string;
  assignees?: string[];
  dueDate?: string;
}

interface Column {
  id: string;
  name: string;
  color: string;
}

export default function BoardPage() {
  const { currentWorkspace } = useWorkspace();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const { emitTaskMove } = useSocket();

  useEffect(() => {
    if (currentWorkspace) {
      fetchData();
    }
  }, [currentWorkspace]);

  const fetchData = async () => {
    try {
      const projectsRes = await api.get(`/projects?workspaceId=${currentWorkspace.id}`);
      if (projectsRes.data.length > 0) {
        const project = projectsRes.data[0];
        setColumns(project.columns || []);
        const tasksRes = await api.get(`/tasks?projectId=${project.id}`);
        setTasks(tasksRes.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load board data');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const columnId = over.id as string;
      
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, columnId } : t));
      
      try {
        await api.patch(`/tasks/${taskId}`, { columnId });
        emitTaskMove?.(taskId, columnId);
        toast.success('Task moved!');
      } catch {
        toast.error('Failed to move task');
        fetchData();
      }
    }
  };

  const handleCreateTask = async (columnId: string) => {
    if (!newTaskTitle.trim()) return;
    
    try {
      const projectsRes = await api.get(`/projects?workspaceId=${currentWorkspace.id}`);
      const projectId = projectsRes.data[0]?.id;
      
      const res = await api.post('/tasks', {
        title: newTaskTitle,
        projectId,
        workspaceId: currentWorkspace.id,
        columnId,
        priority: 'medium',
      });
      
      setTasks(prev => [...prev, res.data]);
      setNewTaskColumn(null);
      setNewTaskTitle('');
      toast.success('Task created!');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading board...</div>;
  }

  const priorityColors: any = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
  const columnColors: any = { gray: '#6b7280', blue: '#3b82f6', yellow: '#eab308', green: '#22c55e', red: '#ef4444', purple: '#a855f7' };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Kanban Board</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Drag and drop tasks to organize your work</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <Filter size={16} /> Filter
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <SortAsc size={16} /> Sort
          </button>
        </div>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', minHeight: 'calc(100vh - 200px)' }}>
          {columns.map((column) => (
            <ColumnComponent key={column.id} column={column} tasks={tasks.filter(t => t.columnId === column.id)} columnColors={columnColors} priorityColors={priorityColors} newTaskColumn={newTaskColumn} setNewTaskColumn={setNewTaskColumn} newTaskTitle={newTaskTitle} setNewTaskTitle={setNewTaskTitle} onCreateTask={handleCreateTask} onDeleteTask={handleDeleteTask} />
          ))}
        </div>
        <DragOverlay>
          {activeId ? <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)', borderRadius: 8, padding: 14, opacity: 0.8 }}>{tasks.find(t => t.id === activeId)?.title}</div> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function ColumnComponent({ column, tasks, columnColors, priorityColors, newTaskColumn, setNewTaskColumn, newTaskTitle, setNewTaskTitle, onCreateTask, onDeleteTask }: any) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div ref={setNodeRef} style={{ width: 300, background: isOver ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', borderRadius: 12, flexShrink: 0, border: isOver ? '2px dashed var(--accent)' : '1px solid var(--border-color)', transition: 'all 0.2s' }}>
      <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: columnColors[column.color] || columnColors.gray }} />
          <span style={{ fontWeight: 600 }}>{column.name}</span>
          <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 12, fontSize: 12, color: 'var(--text-secondary)' }}>{tasks.length}</span>
        </div>
      </div>

      <div style={{ padding: 12, minHeight: 100 }}>
        {tasks.map((task: Task) => <TaskCard key={task.id} task={task} priorityColors={priorityColors} onDelete={onDeleteTask} />)}
        
        {newTaskColumn === column.id ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8, marginTop: 8 }}>
            <input type="text" placeholder="Task title..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onCreateTask(column.id)} autoFocus style={{ width: '100%', marginBottom: 8, padding: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 4, color: 'var(--text-primary)' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onCreateTask(column.id)} style={{ flex: 1, padding: 8, background: 'var(--accent)', border: 'none', borderRadius: 4, color: 'white', cursor: 'pointer' }}>Add</button>
              <button onClick={() => setNewTaskColumn(null)} style={{ padding: 8, background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 4, color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
            </div>
          </motion.div>
        ) : (
          <button onClick={() => setNewTaskColumn(column.id)} style={{ width: '100%', padding: 12, background: 'transparent', border: '1px dashed var(--border-color)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            <Plus size={16} /> Add Task
          </button>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, priorityColors, onDelete }: { task: Task; priorityColors: any; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: task.id });
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div ref={setNodeRef} {...listeners} {...attributes} layoutId={task.id} whileHover={{ scale: 1.02 }} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: 14, marginBottom: 10, cursor: 'grab', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: priorityColors[task.priority], fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>{task.priority}</span>
        <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <MoreHorizontal size={14} />
        </button>
      </div>
      <div style={{ fontWeight: 500, marginBottom: 8 }}>{task.title}</div>
      {task.description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{task.description}</div>}
      
      <AnimatePresence>
        {showMenu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', top: 32, right: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: 8, zIndex: 10 }}>
            <button onClick={() => { onDelete(task.id); setShowMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13 }}>
              <Trash2 size={14} /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
