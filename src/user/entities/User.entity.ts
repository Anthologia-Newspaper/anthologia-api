import { Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserEntity {
  id: number;
  createdAt: Date;
  email: string;
  username: string;
  profilePicCid: string;

  @Expose()
  get profilePicUrl(): string {
    return `${process.env.IPFS_GATEWAY}/${this.profilePicCid}`;
  }

  @Exclude()
  password: string;

  @Exclude()
  roles: Role[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
