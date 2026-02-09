import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './ws-jwt.guard';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private onlineUsers = new Map<string, { socketId: string; user: any }>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Remove user from online list
    for (const [userId, data] of this.onlineUsers.entries()) {
      if (data.socketId === client.id) {
        this.onlineUsers.delete(userId);
        this.broadcastPresence(userId, 'offline');
        break;
      }
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join-workspace')
  handleJoinWorkspace(client: Socket, payload: { workspaceId: string; user: any }) {
    const { workspaceId, user } = payload;
    
    client.join(`workspace-${workspaceId}`);
    this.onlineUsers.set(user.userId, { socketId: client.id, user });
    
    // Broadcast user joined
    this.server.to(`workspace-${workspaceId}`).emit('user-joined', {
      userId: user.userId,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    // Send online users list
    const workspaceUsers = Array.from(this.onlineUsers.values())
      .map(u => u.user);
    client.emit('online-users', workspaceUsers);

    this.broadcastPresence(user.userId, 'online');
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('task-moved')
  handleTaskMoved(client: Socket, payload: { taskId: string; columnId: string; user: any }) {
    const { taskId, columnId, user } = payload;
    
    // Broadcast to all users in workspace except sender
    client.broadcast.emit('task-updated', {
      type: 'moved',
      taskId,
      columnId,
      user: { id: user.userId, email: user.email },
      timestamp: new Date().toISOString(),
    });

    // Also update activity feed
    this.server.emit('activity', {
      type: 'task_moved',
      message: `${user.email} moved a task`,
      timestamp: new Date().toISOString(),
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('task-created')
  handleTaskCreated(client: Socket, payload: { task: any; user: any }) {
    const { task, user } = payload;
    
    client.broadcast.emit('task-created', {
      task,
      user: { id: user.userId, email: user.email },
      timestamp: new Date().toISOString(),
    });

    this.server.emit('activity', {
      type: 'task_created',
      message: `${user.email} created "${task.title}"`,
      timestamp: new Date().toISOString(),
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing')
  handleTyping(client: Socket, payload: { isTyping: boolean; user: any }) {
    client.broadcast.emit('user-typing', {
      userId: payload.user.userId,
      isTyping: payload.isTyping,
    });
  }

  private broadcastPresence(userId: string, status: 'online' | 'offline') {
    this.server.emit('presence-update', {
      userId,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  // Called by other services to emit events
  emitToWorkspace(workspaceId: string, event: string, data: any) {
    this.server.to(`workspace-${workspaceId}`).emit(event, data);
  }

  getOnlineUsersCount(): number {
    return this.onlineUsers.size;
  }
}
