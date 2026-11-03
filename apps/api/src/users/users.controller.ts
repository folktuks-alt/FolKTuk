import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Query,
  Req,
  UseGuards,
  Delete,
  Post,
} from '@nestjs/common';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../identity/guards/jwt-auth.guard';
import { UserActivityQueryDto } from './dto/user-activity-query.dto';
import { UsersService } from './users.service';
import { UpdateProfileDto } from '../identity/dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  follow(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.usersService.follow(request.user.userId, id);
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  unfollow(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.usersService.unfollow(request.user.userId, id);
  }

  @Get(':id/follow')
  @UseGuards(JwtAuthGuard)
  followStatus(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.usersService.getFollowStatus(request.user.userId, id);
  }

  @Get(':id/followers')
  getFollowers(@Param('id') id: string) {
    return this.usersService.getFollowers(id);
  }

  @Get(':id/following')
  getFollowing(@Param('id') id: string) {
    return this.usersService.getFollowing(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(request.user.userId, dto);
  }

  @Get('me/activity')
  @UseGuards(JwtAuthGuard)
  getActivity(
    @Req() request: AuthenticatedRequest,
    @Query() query: UserActivityQueryDto,
  ) {
    return this.usersService.getActivity(request.user.userId, query);
  }

  @Get(':id')
  getProfile(
    @Param('id') id: string,
    @Query() query: UserActivityQueryDto,
  ) {
    return this.usersService.getPublicProfile(id, query);
  }

  @Get(':id/profile')
  getPublicProfile(
    @Param('id') id: string,
    @Query() query: UserActivityQueryDto,
  ) {
    return this.usersService.getPublicProfile(id, query);
  }
}
