import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Post } from '@prisma/client';
import type { Comment } from '@prisma/client';

@WebSocketGateway({ cors: { origin: '*' } })
export class PostsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.server = server;
  }

  async handleConnection(socket: Socket) {
    const token = typeof socket.handshake.auth?.token === 'string'
      ? socket.handshake.auth.token
      : undefined;
    if (!token) return;
    try {
      const payload = await this.jwtService.verifyAsync<{ userId: string }>(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'folktuk-dev-secret-key-2026',
      });
      await socket.join(`user:${payload.userId}`);
    } catch {
      socket.disconnect();
    }
  }

  emitPostCreated(post: Post) {
    this.server.emit('post:created', post);
  }

  emitPostLiked(postId: string, count: number) {
    this.server.emit('post:liked', { postId, count });
  }

  emitPostCommented(comment: Comment) {
    this.server.emit('post:commented', comment);
  }

  emitNotification(recipientId: string, notification: unknown) {
    this.server.to(`user:${recipientId}`).emit('notification:received', notification);
  }
}
