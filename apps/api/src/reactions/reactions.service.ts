import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostsGateway } from '../posts/posts.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postsGateway: PostsGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  async likePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.postReaction.deleteMany({
      where: { userId, postId, type: 'DISLIKE' },
    });
    const existingLike = await this.prisma.postLike.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    const like = await this.prisma.postLike.upsert({
      where: { userId_postId: { userId, postId } },
      create: { userId, postId },
      update: {},
    });
    await this.emitPostLikeCount(postId);
    if (!existingLike && post.authorId !== userId) {
      const notification = await this.notificationsService.create(
        post.authorId,
        userId,
        'LIKE',
        postId,
      );
      this.postsGateway.emitNotification(post.authorId, notification);
    }
    return like;
  }

  async unlikePost(userId: string, postId: string) {
    await this.prisma.postLike.deleteMany({ where: { userId, postId } });
    await this.emitPostLikeCount(postId);
  }

  async dislikePost(userId: string, postId: string) {
    await this.ensurePost(postId);
    await this.prisma.postReaction.deleteMany({
      where: { userId, postId, type: 'LIKE' },
    });
    return this.prisma.postReaction.upsert({
      where: { userId_postId_type: { userId, postId, type: 'DISLIKE' } },
      create: { userId, postId, type: 'DISLIKE' },
      update: {},
    });
  }

  async undislikePost(userId: string, postId: string) {
    await this.prisma.postReaction.deleteMany({
      where: { userId, postId, type: 'DISLIKE' },
    });
  }

  private async ensurePost(postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
  }

  private async emitPostLikeCount(postId: string) {
    const count = await this.prisma.postLike.count({ where: { postId } });
    this.postsGateway.emitPostLiked(postId, count);
  }

  async likeComment(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.commentLike.upsert({
      where: { userId_commentId: { userId, commentId } },
      create: { userId, commentId },
      update: {},
    });
  }

  async unlikeComment(userId: string, commentId: string) {
    await this.prisma.commentLike.deleteMany({ where: { userId, commentId } });
  }
}
