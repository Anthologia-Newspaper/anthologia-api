import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { IsMeOrUserId } from 'src/decorators/validators/IsMeOrUserId';

export class GetArticlesQueryParams {
  @ApiProperty({
    name: 'author',
    type: 'number or me',
    required: false,
  })
  @IsOptional()
  @IsMeOrUserId()
  author?: number | 'me';

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsInt()
  topic?: number;

  @IsOptional()
  @IsString()
  isLiked?: string;

  @IsOptional()
  @IsInt()
  anthologyId?: number;

  @IsOptional()
  @IsString()
  q?: string;
}
