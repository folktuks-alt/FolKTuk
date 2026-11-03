import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './dto/post-query.dto';
import { PostsGateway } from './posts.gateway';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postsGateway: PostsGateway,
  ) {}

  async create(authorId: string, dto: CreatePostDto) {
    const newPost = await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId,
        published: dto.published ?? true,
      },
    });
    this.postsGateway.emitPostCreated(newPost);
    return newPost;
  }

  async findPublished(query: PostQueryDto) {
    const where = {
      published: true,
      ...(query.authorId ? { authorId: query.authorId } : {}),
      ...(query.communityId ? { communityId: query.communityId } : {}),
      ...(query.topic
        ? {
            OR: [
              { title: { contains: query.topic, mode: 'insensitive' as const } },
              { content: { contains: query.topic, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const orderBy =
      query.sort === 'popular'
        ? { likes: { _count: 'desc' as const } }
        : { createdAt: 'desc' as const };
    const posts = await this.prisma.post.findMany({
      where,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy,
      take: query.limit + 1,
      include: {
        author: { select: { id: true, email: true, profile: true } },
        community: { select: { name: true, slug: true } },
        likes: { select: { id: true, userId: true } },
        reactions: { select: { id: true, userId: true, type: true } },
      },
    });
    const hasNextPage = posts.length > query.limit;
    const items = hasNextPage ? posts.slice(0, query.limit) : posts;

    return {
      items,
      nextCursor: hasNextPage ? items[items.length - 1].id : null,
    };
  }

  async trending() {
    const posts = await this.prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { title: true, content: true },
    });
    const counts = new Map<string, number>();
    for (const post of posts) {
      const tags = `${post.title} ${post.content}`.match(/#[a-z0-9_]+/gi) ?? [];
      for (const tag of new Set(tags.map((value) => value.toLowerCase()))) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort(([, first], [, second]) => second - first)
      .slice(0, 8)
      .map(([topic, count]) => ({ topic, count }));
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, authorId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.prisma.post.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, authorId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({ where: { id } });
  }
}
