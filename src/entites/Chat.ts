import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChatRoom } from './ChatRoom';

@Entity({ name: 'chat' })
export class Chat extends BaseEntity {
  @Column({ type: 'int', name: 'chat_room_seq' })
  chatRoomSeq: number;

  @Column({ type: 'int', name: 'user_seq' })
  userSeq: number;

  @Column({ type: 'varchar', name: 'question' })
  question: string;

  @Column({ type: 'text', name: 'answer' })
  answer: string;

  @ManyToOne(() => ChatRoom, chatRoom => chatRoom.chats)
  @JoinColumn([{ name: 'chat_room_seq' }])
  chatRoom: ChatRoom;
}
