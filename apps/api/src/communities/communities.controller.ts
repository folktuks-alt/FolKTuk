import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../identity/guards/jwt-auth.guard';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { CommunityPostQueryDto } from './dto/community-post-query.dto';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateCommunityDto,
  ) {
    return this.communitiesService.create(request.user.userId, dto);
  }

  @Get()
  findAll() {
    return this.communitiesService.findAll();
  }

  @Get('joined')
  @UseGuards(JwtAuthGuard)
  findJoined(@Req() request: AuthenticatedRequest) {
    return this.communitiesService.findJoined(request.user.userId);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @Query() query: CommunityPostQueryDto,
  ) {
    return this.communitiesService.findByIdentifier(id, query);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  join(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.communitiesService.join(request.user.userId, id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  leave(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.communitiesService.leave(request.user.userId, id);
  }

}
