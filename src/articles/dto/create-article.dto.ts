import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  draft: boolean;

  @IsInt()
  @Transform(({ value }) => +value)
  topic: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle: string | undefined;

  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    if (value) return +value;
  })
  anthology: number | undefined;

  @IsOptional()
  @IsString()
  cid: string;
}
