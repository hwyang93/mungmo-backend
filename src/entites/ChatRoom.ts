import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Chat } from './Chat';

@Entity({ name: 'chat_room' })
export class ChatRoom extends BaseEntity {
  @Column({ type: 'varchar', length: 10, name: 'status' })
  status: string;

  @Column({ type: 'int', name: 'user_seq' })
  userSeq: number;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'user_seq' }])
  user: User;

  @OneToMany(() => Chat, chat => chat.chatRoom)
  chats: Chat[];
}
