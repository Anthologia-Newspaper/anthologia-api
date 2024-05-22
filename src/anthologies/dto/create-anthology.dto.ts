import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateAnthologyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isPublic: boolean;

  @IsInt({ each: true })
  articles: number[];
}
