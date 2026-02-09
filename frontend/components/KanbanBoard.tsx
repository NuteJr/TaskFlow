'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MoreHorizontal, Plus, Trash2, User } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import api from '../lib/api';
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

export function KanbanBoard({ tasks, columns, onTaskMove, onTaskCreate, onTaskDelete }: any) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { emitTaskMove } = useSocket();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const columnId = over.id as string;
      
      // Optimistic update
      onTaskMove(taskId, columnId);
      
      // API call
      api.patch(`/tasks/${taskId}`, { columnId })
        .then(() => {
          emitTaskMove(taskId, columnId);
          toast.success('Task moved!');
        })
        .catch(() => toast.error('Failed to move task'));
    }
  };

  const handleCreateTask = async (columnId: string) => {
    if (!newTaskTitle.trim()) return;

    try {
      const res = await api.post('/tasks', {
        title: newTaskTitle,
        columnId,
        priority: 'medium',
      });
      
      onTaskCreate(res.data);
      setNewTaskColumn(null);
      setNewTaskTitle('');
      toast.success('Task created!');
    } catch {
      toast.error('Failed to create task');
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: 16, padding: 24, overflowX: 'auto', minHeight: 'calc(100vh - 64px)' }}>
        {columns.map((column: Column) => (
          <DroppableColumn key={column.id} column={column}>
            <ColumnHeader column={column} taskCount={tasks.filter((t: Task) => t.columnId === column.id).length} />
            
            <div style={{ padding: 12, minHeight: 100 }}>
              {tasks
                .filter((t: Task) => t.columnId === column.id)
                .map((task: Task) => (
                  <DraggableTask key={task.id} task={task} onDelete={onTaskDelete} />
                ))}
              
              {newTaskColumn === column.id ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8, marginTop: 8 }}
                >
                  <input
                    type="text"
                    placeholder="Task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTask(column.id)}
                    autoFocus
                    style={{ width: '100%', marginBottom: 8, padding: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 4, color: 'var(--text-primary)' }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleCreateTask(column.id)} style={{ flex: 1, padding: 8, background: 'var(--accent)', border: 'none', borderRadius: 4, color: 'white', cursor: 'pointer' }}>Add</button>
                    <button onClick={() => setNewTaskColumn(null)} style={{ padding: 8, background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 4, color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={() => setNewTaskColumn(column.id)}
                  style={{ width: '100%', padding: 12, background: 'transparent', border: '1px dashed var(--border-color)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}
                >
                  <Plus size={16} />
                  Add Task
                </button>
              )}
            </div>
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <TaskCard task={tasks.find((t: Task) => t.id === activeId)} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function DroppableColumn({ children, column }: { children: React.ReactNode; column: Column }) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 300,
        background: isOver ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        borderRadius: 12,
        flexShrink: 0,
        border: isOver ? '2px dashed var(--accent)' : '1px solid transparent',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </div>
  );
}

function ColumnHeader({ column, taskCount }: { column: Column; taskCount: number }) {
  const colors: any = {
    gray: '#6b7280',
    blue: '#3b82f6',
    yellow: '#eab308',
    green: '#22c55e',
    red: '#ef4444',
    purple: '#a855f7',
  };

  return (
    <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[column.color] || colors.gray }} />
        <span style={{ fontWeight: 600 }}>{column.name}</span>
        <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 12, fontSize: 12, color: 'var(--text-secondary)' }}>{taskCount}</span>
      </div>
      <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}

function DraggableTask({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors: any = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        layoutId={task.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
          padding: 14,
          marginBottom: 10,
          cursor: 'grab',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: priorityColors[task.priority], fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>{task.priority}</span>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <MoreHorizontal size={14} />
          </button>
        </div>
        
        <div style={{ fontWeight: 500, marginBottom: 8 }}>{task.title}</div>
        
        {task.description && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{task.description}</div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {task.dueDate && (
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={12} />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
          
          {task.assignees && task.assignees.length > 0 && (
            <div style={{ display: 'flex', gap: -4 }}>
              {task.assignees.map((a, i) => (
                <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, marginLeft: i > 0 ? -8 : 0, border: '2px solid var(--bg-tertiary)' }}>
                  <User size={12} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ position: 'absolute', top: 32, right: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: 8, zIndex: 10, minWidth: 120 }}
            >
              <button onClick={() => { onDelete(task.id); setShowMenu(false); }} style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <Trash2 size={14} />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function TaskCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  return (
    <div style={{
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--accent)',
      borderRadius: 8,
      padding: 14,
      opacity: isDragging ? 0.8 : 1,
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      transform: 'rotate(2deg)',
    }}>
      <div style={{ fontWeight: 600 }}>{task?.title}</div>
    </div>
  );
}
