import { Test } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { describe, expect, it, jest } from '@jest/globals';

describe('NotificationsService', () => {
  it('persists typed events and filters notifications by recipient', async () => {
    const created = { id: 'n1', recipientId: 'u1', actorId: 'u2', type: 'FOLLOW', targetId: 'u2' };
    const prisma = {
      notification: {
        create: jest.fn().mockResolvedValue(created),
        findMany: jest.fn().mockResolvedValue([created]),
        count: jest.fn().mockResolvedValue(1),
      },
    };
    const module = await Test.createTestingModule({
      providers: [NotificationsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    const service = module.get(NotificationsService);

    await expect(service.create('u1', 'u2', 'FOLLOW', 'u2')).resolves.toEqual(created);
    await expect(service.findForUser('u1')).resolves.toMatchObject({ data: [created], unreadCount: 1 });
    expect(prisma.notification.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { recipientId: 'u1' } }));
  });
});
