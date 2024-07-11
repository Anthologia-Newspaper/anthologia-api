import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsBoolean()
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
