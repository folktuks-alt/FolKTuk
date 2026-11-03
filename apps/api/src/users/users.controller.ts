import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../identity/guards/jwt-auth.guard';
import { UserActivityQueryDto } from './dto/user-activity-query.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/activity')
  @UseGuards(JwtAuthGuard)
  getActivity(
    @Req() request: AuthenticatedRequest,
    @Query() query: UserActivityQueryDto,
  ) {
    return this.usersService.getActivity(request.user.userId, query);
  }

  @Get(':id/profile')
  getPublicProfile(
    @Param('id') id: string,
    @Query() query: UserActivityQueryDto,
  ) {
    return this.usersService.getPublicProfile(id, query);
  }
}
