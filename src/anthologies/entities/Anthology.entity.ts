import { Type } from 'class-transformer';
import { ArticlesEntity } from 'src/articles/entities/Article.entity';
import { UserEntity } from 'src/user/entities/User.entity';

export class AnthologyEntity {
  id: number;
  @Type(() => UserEntity)
  compiler: UserEntity;
  userId: number;
  @Type(() => ArticlesEntity)
  articles: ArticlesEntity;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AnthologyEntity>) {
    Object.assign(this, partial);
  }
}
