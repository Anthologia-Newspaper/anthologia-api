import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAnthologyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsInt({ each: true })
  addArticles: number[];

  @IsInt({ each: true })
  removeArticles: number[];
}
