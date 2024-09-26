import { Type } from 'class-transformer';
import { ArticleEntity } from 'src/articles/entities/Article.entity';
import { UserEntity } from 'src/user/entities/User.entity';

export class CommentEntity {
  id: number;
  createdAt: Date;
  @Type(() => UserEntity)
  author: UserEntity;
  authorId: number;
  @Type(() => ArticleEntity)
  article: ArticleEntity;
  articleId: number;
  content: string;
  @Type(() => CommentEntity)
  replies: CommentEntity[];
  @Type(() => CommentEntity)
  replyTo?: CommentEntity;
  replyToId?: number;
}
