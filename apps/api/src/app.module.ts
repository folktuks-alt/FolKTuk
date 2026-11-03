import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { IdentityModule } from './identity/identity.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CommunitiesModule } from './communities/communities.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    IdentityModule,
    PostsModule,
    CommentsModule,
    ReactionsModule,
    CommunitiesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
