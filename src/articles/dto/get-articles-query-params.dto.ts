import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class GetArticlesQueryParamsDto {
  @IsOptional()
  @IsInt()
  authorId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  draft?: boolean;

  @IsOptional()
  @IsInt()
  topicId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isLiked?: boolean;

  @IsOptional()
  @IsInt()
  anthologyId?: number;

  @IsOptional()
  @IsString()
  q?: string;
}
