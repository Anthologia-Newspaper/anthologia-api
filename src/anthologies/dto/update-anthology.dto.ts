import { PartialType } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

import { CreateAnthologyDto } from './create-anthology.dto';

export class UpdateAnthologyDto extends PartialType(CreateAnthologyDto) {
  @IsInt({ each: true })
  addArticles: number[];

  @IsInt({ each: true })
  removeArticles: number[];
}
