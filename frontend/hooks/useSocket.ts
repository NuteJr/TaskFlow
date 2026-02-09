'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../stores/auth';
import { useWorkspace } from '../stores/workspace';
import toast from 'react-hot-toast';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { user, token } = useAuth();
  const { addActivity, setOnlineUsers, currentWorkspace } = useWorkspace();

  useEffect(() => {
    if (!token || !user || !currentWorkspace) return;

    const socket = io('http://localhost:3001', {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Connected to real-time server');
      socket.emit('join-workspace', {
        workspaceId: currentWorkspace.id,
        user: { userId: user.id, email: user.email },
      });
    });

    socket.on('user-joined', (data) => {
      toast.success(`${data.email} joined`, { duration: 2000 });
    });

    socket.on('online-users', (users) => {
      setOnlineUsers(users.map((u: any) => u.email));
    });

    socket.on('task-updated', (data) => {
      toast.success(`Task moved by ${data.user.email}`, { duration: 2000 });
      addActivity(data);
    });

    socket.on('task-created', (data) => {
      toast.success(`New task by ${data.user.email}`, { duration: 2000 });
      addActivity(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user, currentWorkspace, addActivity, setOnlineUsers]);

  const emitTaskMove = (taskId: string, columnId: string) => {
    socketRef.current?.emit('task-moved', {
      taskId,
      columnId,
      user: { userId: user?.id, email: user?.email },
    });
  };

  const emitTaskCreate = (task: any) => {
    socketRef.current?.emit('task-created', {
      task,
      user: { userId: user?.id, email: user?.email },
    });
  };

  return { socket: socketRef.current, emitTaskMove, emitTaskCreate };
}
