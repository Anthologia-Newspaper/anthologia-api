import { Exclude, Expose } from 'class-transformer';

export class UserEntity {
  id: number;
  createdAt: Date;
  username: string;
  profilePicCid: string;

  @Expose()
  get profilePicUrl(): string {
    return `${process.env.IPFS_GATEWAY}/${this.profilePicCid}`;
  }

  @Exclude()
  password: string;

  @Exclude()
  roles: string[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
