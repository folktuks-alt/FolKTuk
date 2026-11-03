import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IdentityService } from './identity.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from './guards/jwt-auth.guard';

@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('register')
  async createUser(@Body() dto: CreateUserDto) {
    return this.identityService.createUser(dto);
  }

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return this.identityService.createUser(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.identityService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() request: AuthenticatedRequest) {
    return request.user;
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.identityService.updateProfile(request.user.userId, dto);
  }
}
