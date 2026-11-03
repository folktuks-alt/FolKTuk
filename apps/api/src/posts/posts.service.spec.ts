import { Test } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { PostsGateway } from './posts.gateway';
import { describe, expect, it, jest } from '@jest/globals';

describe('PostsService', () => {
  let service: PostsService;
  let prisma: { post: { create: jest.Mock; findMany: jest.Mock; count: jest.Mock }; $transaction: jest.Mock };
  let gateway: { emitPostCreated: jest.Mock };

  beforeEach(async () => {
    prisma = {
      post: { create: jest.fn(), findMany: jest.fn(), count: jest.fn() },
      $transaction: jest.fn(),
    };
    gateway = { emitPostCreated: jest.fn() };
    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PrismaService, useValue: prisma },
        { provide: PostsGateway, useValue: gateway },
      ],
    }).compile();
    service = module.get(PostsService);
  });

  it('creates a post and broadcasts it', async () => {
    const post = { id: 'p1', title: 'Hello', content: 'World', authorId: 'u1' };
    prisma.post.create.mockResolvedValue(post);

    await expect(service.create('u1', { title: 'Hello', content: 'World' })).resolves.toEqual(post);
    expect(prisma.post.create).toHaveBeenCalledWith({
      data: { title: 'Hello', content: 'World', authorId: 'u1', published: true },
    });
    expect(gateway.emitPostCreated).toHaveBeenCalledWith(post);
  });

  it('returns a paged published feed', async () => {
    const posts = [{ id: 'p1' }];
    prisma.$transaction.mockResolvedValue([posts, 1]);

    prisma.post.findMany.mockResolvedValue(posts);

    await expect(service.findPublished({ limit: 10, sort: 'latest' })).resolves.toEqual({
      items: posts, nextCursor: null,
    });
    expect(prisma.post.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { published: true }, take: 11,
    }));
  });

  it('uses the cursor and returns the last item as nextCursor when another page exists', async () => {
    const posts = Array.from({ length: 3 }, (_, index) => ({ id: `p${index + 1}` }));
    prisma.post.findMany.mockResolvedValue(posts);

    await expect(service.findPublished({ cursor: 'p0', limit: 2, sort: 'latest' })).resolves.toEqual({
      items: posts.slice(0, 2), nextCursor: 'p2',
    });
    expect(prisma.post.findMany).toHaveBeenCalledWith(expect.objectContaining({
      cursor: { id: 'p0' }, skip: 1, take: 3,
    }));
  });
});
