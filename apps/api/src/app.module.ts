import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IdentityModule } from './identity/identity.module';

@Module({
  imports: [PrismaModule, IdentityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
