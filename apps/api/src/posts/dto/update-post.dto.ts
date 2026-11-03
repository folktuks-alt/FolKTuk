import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty.' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Content cannot be empty.' })
  content?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
