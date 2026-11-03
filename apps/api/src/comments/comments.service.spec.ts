import { Test } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { PostsGateway } from '../posts/posts.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { describe, expect, it, jest } from '@jest/globals';

describe('CommentsService', () => {
  it('creates an inline comment, broadcasts it, and notifies the post owner', async () => {
    const post = { id: 'p1', authorId: 'owner' };
    const comment = { id: 'c1', postId: 'p1', authorId: 'commenter', content: 'Nice!' };
    const prisma = { post: { findUnique: jest.fn().mockResolvedValue(post) }, comment: { create: jest.fn().mockResolvedValue(comment) } };
    const gateway = { emitPostCommented: jest.fn(), emitNotification: jest.fn() };
    const notifications = { create: jest.fn().mockResolvedValue({ id: 'n1' }) };
    const module = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: PostsGateway, useValue: gateway },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();

    await expect(module.get(CommentsService).create('p1', 'commenter', { content: 'Nice!' })).resolves.toEqual(comment);
    expect(gateway.emitPostCommented).toHaveBeenCalledWith(comment);
    expect(notifications.create).toHaveBeenCalledWith('owner', 'commenter', 'COMMENT', 'p1');
  });

  it('does not notify the author for their own comment', async () => {
    const comment = { id: 'c1', postId: 'p1', authorId: 'owner', content: 'Self note' };
    const prisma = {
      post: { findUnique: jest.fn().mockResolvedValue({ id: 'p1', authorId: 'owner' }) },
      comment: { create: jest.fn().mockResolvedValue(comment) },
    };
    const gateway = { emitPostCommented: jest.fn(), emitNotification: jest.fn() };
    const notifications = { create: jest.fn() };
    const module = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: PostsGateway, useValue: gateway },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();

    await module.get(CommentsService).create('p1', 'owner', { content: 'Self note' });
    expect(notifications.create).not.toHaveBeenCalled();
    expect(gateway.emitNotification).not.toHaveBeenCalled();
  });
});
