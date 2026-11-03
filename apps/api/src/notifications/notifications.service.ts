import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    recipientId: string,
    actorId: string,
    type: 'LIKE' | 'COMMENT' | 'FOLLOW',
    targetId: string,
  ) {
    return this.prisma.notification.create({
      data: { recipientId, actorId, type, targetId },
      include: { actor: { select: { id: true, profile: true } } },
    });
  }

  findForUser(recipientId: string) {
    return this.prisma.notification.findMany({
      where: { recipientId },
      include: { actor: { select: { id: true, profile: true } } },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }).then(async (items) => ({
      data: items,
      unreadCount: await this.prisma.notification.count({ where: { recipientId, read: false } }),
    }));
  }

  async markRead(id: string, recipientId: string) {
    const notification = await this.prisma.notification.findFirst({ where: { id, recipientId } });
    if (!notification) throw new NotFoundException('Notification not found');
    return this.prisma.notification.update({ where: { id }, data: { read: true } });
  }

  markAllRead(recipientId: string) {
    return this.prisma.notification.updateMany({ where: { recipientId, read: false }, data: { read: true } });
  }
}
