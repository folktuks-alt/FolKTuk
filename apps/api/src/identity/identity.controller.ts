import { Controller, Post, Body } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('users')
  async createUser(@Body() dto: CreateUserDto) {
    return this.identityService.createUser(dto);
  }
}
