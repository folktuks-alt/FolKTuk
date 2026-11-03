import { Test } from '@nestjs/testing';
import { ReactionsService } from './reactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { PostsGateway } from '../posts/posts.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { describe, expect, it, jest } from '@jest/globals';

describe('ReactionsService', () => {
  it('toggles a post like and emits the authoritative count', async () => {
    const prisma = {
      post: { findUnique: jest.fn().mockResolvedValue({ id: 'p1', authorId: 'owner' }) },
      postLike: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({ id: 'l1' }),
        count: jest.fn().mockResolvedValue(7),
      },
      postReaction: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
    };
    const gateway = { emitPostLiked: jest.fn(), emitNotification: jest.fn() };
    const notifications = { create: jest.fn().mockResolvedValue({ id: 'n1' }) };
    const module = await Test.createTestingModule({
      providers: [
        ReactionsService,
        { provide: PrismaService, useValue: prisma },
        { provide: PostsGateway, useValue: gateway },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();

    await module.get(ReactionsService).likePost('actor', 'p1');
    expect(gateway.emitPostLiked).toHaveBeenCalledWith('p1', 7);
    expect(notifications.create).toHaveBeenCalledWith('owner', 'actor', 'LIKE', 'p1');
  });
});
