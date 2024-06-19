import { IsInt, IsString } from 'class-validator';

export class CreateAnthologyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt({ each: true })
  articles: number[];
}
