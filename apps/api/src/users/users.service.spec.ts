import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PostsGateway } from '../posts/posts.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('UsersService', () => {
  let service: UsersService;
  const prisma = {
    profile: { update: jest.fn() },
    user: { findUnique: jest.fn() },
    follow: { findUnique: jest.fn(), upsert: jest.fn(), deleteMany: jest.fn(), findMany: jest.fn(), count: jest.fn() },
    $transaction: jest.fn(),
  };
  const gateway = { emitNotification: jest.fn() };
  const notifications = { create: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        { provide: PostsGateway, useValue: gateway },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();
    service = module.get(UsersService);
  });

  it('updates and returns the sanitized profile', async () => {
    prisma.profile.update.mockResolvedValue({});
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1', email: 'a@example.com', createdAt: new Date(),
      profile: { username: 'alex', displayName: 'Alex', bio: 'Hello', avatarUrl: null, bannerUrl: null },
    });

    await expect(service.updateProfile('u1', { displayName: 'Alex' })).resolves.toMatchObject({
      id: 'u1',
      profile: { displayName: 'Alex' },
    });
    expect(prisma.profile.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: 'u1' },
      data: { displayName: 'Alex' },
    }));
  });

  it('creates a follow, increments the target count, and notifies the target', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u2' });
    prisma.follow.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ followerId: 'u1', followingId: 'u2' });
    prisma.follow.upsert.mockResolvedValue({});
    prisma.$transaction.mockResolvedValue([{}, 4]);
    notifications.create.mockResolvedValue({ id: 'n1', type: 'FOLLOW' });

    await expect(service.follow('u1', 'u2')).resolves.toEqual({ following: true, followerCount: 4 });
    expect(notifications.create).toHaveBeenCalledWith('u2', 'u1', 'FOLLOW', 'u1');
    expect(gateway.emitNotification).toHaveBeenCalledWith('u2', { id: 'n1', type: 'FOLLOW' });
  });

  it('removes a follow and returns the decremented count', async () => {
    prisma.follow.deleteMany.mockResolvedValue({ count: 1 });
    prisma.follow.findUnique.mockResolvedValue(null);
    prisma.$transaction.mockResolvedValue([null, 3]);

    await expect(service.unfollow('u1', 'u2')).resolves.toEqual({ following: false, followerCount: 3 });
  });
});
