import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { hashPassword, verifyPassword } from './password-hasher';

@Injectable()
export class IdentityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
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

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: await hashPassword(dto.password),
        profile: {
          create: {
            username: dto.username,
            displayName: dto.displayName,
            bio: dto.bio,
          },
        },
      },
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true,
        profile: true,
      },
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier },
          { profile: { username: dto.identifier } },
        ],
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        status: true,
        createdAt: true,
        profile: true,
      },
    });

    if (
      !user ||
      user.status !== 'ACTIVE' ||
      !user.passwordHash ||
      !(await verifyPassword(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash: _passwordHash, ...authenticatedUser } = user;
    const accessToken = await this.jwtService.signAsync({
      userId: user.id,
      email: user.email,
      username: user.profile?.username,
    });

    return {
      user: authenticatedUser,
      accessToken,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { userId },
      data: dto,
    });
  }
}
