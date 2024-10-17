import { Anthology, Comment, Event, Topic, User } from '@prisma/client';
import { Type } from 'class-transformer';
import { AnthologyEntity } from 'src/anthologies/entities/Anthology.entity';
import { CommentEntity } from 'src/comments/entities/Comments.entity';
import { DailyStatsEntity } from 'src/statistics/entities/Statistics.entity';
import { TopicEntity } from 'src/topics/entities/Topic.entity';
import { UserEntity } from 'src/user/entities/User.entity';

export class ArticleEntity {
  id: number;
  title: string;
  subtitle: string | null;
  @Type(() => TopicEntity)
  topic: Topic;
  topicId: number;
  @Type(() => UserEntity)
  author: User;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  cid: string | null;
  content: string;
  draft: boolean;
  @Type(() => AnthologyEntity)
  anthology?: Anthology[];
  viewCounter: number;
  likeCounter: number;
  @Type(() => DailyStatsEntity)
  dailyStats?: Event[];
  @Type(() => CommentEntity)
  comments?: Comment[];

  constructor(partial: Partial<ArticleEntity>) {
    Object.assign(this, partial);
  }
}
