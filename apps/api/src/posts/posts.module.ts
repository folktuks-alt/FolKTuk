import { Module } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module';
import { PostsController } from './posts.controller';
import { PostsGateway } from './posts.gateway';
import { PostsService } from './posts.service';

@Module({
  imports: [IdentityModule],
  controllers: [PostsController],
  providers: [PostsService, PostsGateway],
  exports: [PostsGateway],
})
export class PostsModule {}
