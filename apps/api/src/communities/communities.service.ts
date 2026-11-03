import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { CommunityPostQueryDto } from './dto/community-post-query.dto';

@Injectable()
export class CommunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(creatorId: string, dto: CreateCommunityDto) {
    const existing = await this.prisma.community.findFirst({
      where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
    });

    if (existing) {
      throw new ConflictException(
        existing.name === dto.name
          ? 'Community name already exists'
          : 'Community slug already exists',
      );
    }

    return this.prisma.$transaction(async (transaction) => {
      const community = await transaction.community.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          topics: dto.topics ?? [],
          creatorId,
        },
      });

      await transaction.communityMember.create({
        data: {
          userId: creatorId,
          communityId: community.id,
          role: 'ADMIN',
        },
      });

      return community;
    });
  }

  findAll() {
    return this.prisma.community.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findJoined(userId: string) {
    return this.prisma.communityMember.findMany({
      where: { userId },
      include: { community: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdentifier(identifier: string, query: CommunityPostQueryDto) {
    const community = await this.prisma.community.findFirst({
      where: { OR: [{ id: identifier }, { slug: identifier }] },
      include: { _count: { select: { members: true } } },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    const where = {
      communityId: community.id,
      published: true,
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
      ...community,
      memberCount: community._count.members,
      posts: {
        data,
        total,
        page: query.page,
        limit: query.limit,
      },
    };
  }

  async join(userId: string, communityId: string) {
    await this.ensureCommunity(communityId);

    return this.prisma.communityMember.upsert({
      where: { userId_communityId: { userId, communityId } },
      create: { userId, communityId, role: 'MEMBER' },
      update: {},
    });
  }

  async leave(userId: string, communityId: string) {
    await this.ensureCommunity(communityId);

    await this.prisma.communityMember.deleteMany({
      where: { userId, communityId },
    });
  }

  private async ensureCommunity(id: string) {
    const community = await this.prisma.community.findUnique({ where: { id } });

    if (!community) {
      throw new NotFoundException('Community not found');
    }
  }
}
