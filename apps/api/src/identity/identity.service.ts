import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class IdentityService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    // Check if email or username already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const existingProfile = await this.prisma.profile.findUnique({
      where: { username: dto.username },
    });

    if (existingProfile) {
      throw new ConflictException('Username already taken');
    }

    // Create User and Profile together in a transaction
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: dto.passwordHash,
        profile: {
          create: {
            username: dto.username,
            displayName: dto.displayName,
            bio: dto.bio,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return user;
  }
}
