import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserActivityQueryDto } from './dto/user-activity-query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicProfile(userId: string, query: UserActivityQueryDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        profile: {
          select: {
            username: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
        },
        communityMemberships: {
          include: { community: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const postPage = await this.getPosts(userId, query, true);

    return {
      ...user,
      posts: postPage,
    };
  }

  async getActivity(userId: string, query: UserActivityQueryDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        profile: {
          select: {
            username: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
        },
        communityMemberships: {
          include: { community: true },
          orderBy: { createdAt: 'desc' },
        },
        postLikes: {
          include: { post: true },
          orderBy: { createdAt: 'desc' },
        },
        commentLikes: {
          include: { comment: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      posts: await this.getPosts(userId, query, false),
    };
  }

  private async getPosts(
    authorId: string,
    query: UserActivityQueryDto,
    publishedOnly: boolean,
  ) {
    const where = {
      authorId,
      ...(publishedOnly ? { published: true } : {}),
    };
    const skip = (query.page - 1) * query.limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data,
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
