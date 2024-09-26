import { Type } from 'class-transformer';

export class DailyStatsEntity {
  date: Date;
  count: number;
  toDate: number;

  constructor(partial: Partial<DailyStatsEntity>) {
    Object.assign(this, partial);
  }
}

export class StatsEntity {
  @Type(() => DailyStatsEntity)
  dailyStats: DailyStatsEntity[];
}
