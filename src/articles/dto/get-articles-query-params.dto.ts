import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class GetArticlesQueryParamsDto {
  @IsOptional()
  @IsInt()
  authorId?: number;

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
