import { IsString, IsUrl } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUrl()
  image: string;
}
