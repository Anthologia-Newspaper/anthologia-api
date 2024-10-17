import { Expose, Type } from 'class-transformer';
import { ArticleEntity } from 'src/articles/entities/Article.entity';
import { UserEntity } from 'src/user/entities/User.entity';

export class AnthologyEntity {
  id: number;
  @Type(() => UserEntity)
  compiler: UserEntity;
  userId: number;
  @Type(() => ArticleEntity)
  articles: ArticleEntity[];
  @Expose()
  get articleCount(): number {
    return this.articles.length;
  }
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AnthologyEntity>) {
    Object.assign(this, partial);
  }
}
