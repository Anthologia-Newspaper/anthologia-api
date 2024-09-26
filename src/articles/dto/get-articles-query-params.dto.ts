import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class GetArticlesQueryParamsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    if (value) return +value;
  })
  authorId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  draft?: boolean;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    if (value) return +value;
  })
  topicId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isLiked?: boolean;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    if (value) return +value;
  })
  anthologyId?: number;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    if (value) return +value;
  })
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    if (value) return +value;
  })
  items?: number;
}
