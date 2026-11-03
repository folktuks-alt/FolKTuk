import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PostQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? 10 : Number(value)))
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  communityId?: string;

  @IsOptional()
  @IsIn(['latest', 'popular'])
  sort: 'latest' | 'popular' = 'latest';

  @IsOptional()
  @IsString()
  topic?: string;
}
