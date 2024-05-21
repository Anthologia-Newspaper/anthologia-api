import { IsBoolean } from 'class-validator';

export class UpdateLikeArticleDto {
  @IsBoolean()
  isLiked: boolean;
}
