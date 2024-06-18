import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { IsMeOrUserId } from 'src/decorators/validators/IsMeOrUserId';

export class GetArticlesQueryParams {
  @ApiProperty({
    name: 'author',
    type: 'number or me',
    required: false,
  })
  @IsOptional()
  @IsMeOrUserId()
  author?: number | 'me';

  @IsOptional()
  @IsInt()
  topic?: number;

  @IsOptional()
  @IsInt()
  anthologyId?: number;

  @IsOptional()
  @IsString()
  q?: string;
}
