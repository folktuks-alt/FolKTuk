import { Module } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [IdentityModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
