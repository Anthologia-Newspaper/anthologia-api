import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  draft: boolean;

  @IsInt()
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
  anthology: number | undefined;

  @IsOptional()
  @IsString()
  cid: string;
}
