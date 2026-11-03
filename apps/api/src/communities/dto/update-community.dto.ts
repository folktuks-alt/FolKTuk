import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCommunityDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Slug cannot be empty.' })
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
