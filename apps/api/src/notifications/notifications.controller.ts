import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, JwtAuthGuard } from '../identity/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findForUser(@Req() request: AuthenticatedRequest) {
    return this.notificationsService.findForUser(request.user.userId);
  }

  @Patch('read-all')
  markAllRead(@Req() request: AuthenticatedRequest) {
    return this.notificationsService.markAllRead(request.user.userId);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.notificationsService.markRead(id, request.user.userId);
  }
}
