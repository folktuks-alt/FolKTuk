import { Module } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [IdentityModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
