import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../identity/guards/jwt-auth.guard';
import { ReactionsService } from './reactions.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post('posts/:postId/like')
  likePost(
    @Param('postId') postId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.reactionsService.likePost(request.user.userId, postId);
  }

  @Delete('posts/:postId/like')
  unlikePost(
    @Param('postId') postId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.reactionsService.unlikePost(request.user.userId, postId);
  }

  @Post('posts/:postId/dislike')
  dislikePost(@Param('postId') postId: string, @Req() request: AuthenticatedRequest) {
    return this.reactionsService.dislikePost(request.user.userId, postId);
  }

  @Delete('posts/:postId/dislike')
  undislikePost(@Param('postId') postId: string, @Req() request: AuthenticatedRequest) {
    return this.reactionsService.undislikePost(request.user.userId, postId);
  }

  @Post('comments/:commentId/like')
  likeComment(
    @Param('commentId') commentId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.reactionsService.likeComment(request.user.userId, commentId);
  }

  @Delete('comments/:commentId/like')
  unlikeComment(
    @Param('commentId') commentId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.reactionsService.unlikeComment(request.user.userId, commentId);
  }
}
