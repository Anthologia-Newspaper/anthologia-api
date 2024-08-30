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
  @IsBoolean()
  draft?: boolean;

  @IsOptional()
  @IsInt()
  topicId?: number;

  @IsOptional()
  @IsBoolean()
  isLiked?: boolean;

  @IsOptional()
  @IsInt()
  anthologyId?: number;

  @IsOptional()
  @IsString()
  q?: string;
}
