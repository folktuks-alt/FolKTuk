import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserActivityQueryDto } from './dto/user-activity-query.dto';
import { UpdateProfileDto } from '../identity/dto/update-profile.dto';
import { PostsGateway } from '../posts/posts.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postsGateway: PostsGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getPublicProfile(userId: string, query: UserActivityQueryDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        _count: { select: { followers: true, following: true } },
        profile: {
          select: {
            username: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
            bannerUrl: true,
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
      followerCount: user._count.followers,
      followingCount: user._count.following,
      posts: postPage,
    };
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new NotFoundException('You cannot follow yourself');
    }
    const target = await this.prisma.user.findUnique({ where: { id: followingId } });
    if (!target) throw new NotFoundException('User not found');
    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    await this.prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {},
    });
    if (!existing) {
      const notification = await this.notificationsService.create(followingId, followerId, 'FOLLOW', followerId);
      this.postsGateway.emitNotification(followingId, notification);
    }
    return this.followStatus(followerId, followingId);
  }

  async unfollow(followerId: string, followingId: string) {
    await this.prisma.follow.deleteMany({ where: { followerId, followingId } });
    return this.followStatus(followerId, followingId);
  }

  async getFollowStatus(followerId: string, followingId: string) {
    await this.ensureUser(followingId);
    return this.followStatus(followerId, followingId);
  }

  private async followStatus(followerId: string, followingId: string) {
    const [following, followerCount] = await this.prisma.$transaction([
      this.prisma.follow.findUnique({ where: { followerId_followingId: { followerId, followingId } } }),
      this.prisma.follow.count({ where: { followingId } }),
    ]);
    return { following: Boolean(following), followerCount };
  }

  async getFollowers(userId: string) {
    await this.ensureUser(userId);
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, follower: { select: { id: true, profile: true } } },
    });
  }

  async getFollowing(userId: string) {
    await this.ensureUser(userId);
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, following: { select: { id: true, profile: true } } },
    });
  }

  private async ensureUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) throw new NotFoundException('User not found');
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.prisma.profile.update({
      where: { userId },
      data: dto,
    });

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
            bannerUrl: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
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
            bannerUrl: true,
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
