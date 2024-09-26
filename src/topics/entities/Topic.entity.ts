import { Type } from 'class-transformer';
import { ArticleEntity } from 'src/articles/entities/Article.entity';

export class TopicEntity {
  id: number;
  name: string;
  description: string;
  image: string;
  @Type(() => ArticleEntity)
  articles: ArticleEntity;

  constructor(partial: Partial<TopicEntity>) {
    Object.assign(this, partial);
  }
}
