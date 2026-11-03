import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type SearchType = 'all' | 'posts' | 'communities' | 'tags';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string, type: SearchType) {
    const q = query.trim();
    if (!q) return { query: q, type, posts: [], communities: [], users: [], tags: [] };

    const [posts, communities, users, tags] = await Promise.all([
      type === 'communities' || type === 'tags' ? [] : this.prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 25,
        include: {
          author: { select: { id: true, email: true, profile: true } },
          community: { select: { name: true, slug: true } },
          likes: { select: { id: true, userId: true } },
        },
      }),
      type === 'posts' || type === 'tags' ? [] : this.prisma.community.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { topics: { has: q.toLowerCase() } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 25,
      }),
      type === 'posts' || type === 'communities' || type === 'tags' ? [] : this.prisma.user.findMany({
        where: {
          profile: {
            OR: [
              { displayName: { contains: q, mode: 'insensitive' } },
              { username: { contains: q, mode: 'insensitive' } },
            ],
          },
        },
        take: 10,
        select: { id: true, profile: true },
      }),
      this.extractTags(q),
    ]);

    return { query: q, type, posts, communities, users, tags };
  }

  async trendingTags() {
    const [posts, communities] = await Promise.all([
      this.prisma.post.findMany({
        where: { published: true, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        select: { title: true, content: true },
        take: 1000,
      }),
      this.prisma.community.findMany({
        select: { topics: true },
        take: 500,
      }),
    ]);
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of this.tagsFromText(`${post.title} ${post.content}`)) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    for (const community of communities) {
      for (const topic of community.topics) {
        const tag = this.normalizeTag(topic);
        if (tag) counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort(([, first], [, second]) => second - first)
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }));
  }

  private async extractTags(query: string) {
    const normalized = this.normalizeTag(query);
    if (!normalized) return [];
    const trending = await this.trendingTags();
    return trending.filter(({ tag }) => tag.includes(normalized));
  }

  private tagsFromText(text: string) {
    return [...new Set((text.match(/#[a-z0-9_]+/gi) ?? []).map((tag) => this.normalizeTag(tag)).filter(Boolean))];
  }

  private normalizeTag(value: string) {
    const tag = value.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9_]/g, '');
    return tag ? `#${tag}` : '';
  }
}
