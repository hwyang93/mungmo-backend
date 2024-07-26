import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'chat_group' })
export class ChatGroup extends BaseEntity {
  @Column({ type: 'int', name: 'user_seq' })
  userSeq: number;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'user_seq' }])
  user: User;
}
