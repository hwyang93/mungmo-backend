import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChatGroup } from './ChatGroup';

@Entity({ name: 'chat' })
export class Chat extends BaseEntity {
  @Column({ type: 'int', name: 'chat_group_seq' })
  chatGroupSeq: number;

  @Column({ type: 'int', name: 'question' })
  question: number;

  @Column({ type: 'int', name: 'answer' })
  answer: number;

  @ManyToOne(() => Chat)
  @JoinColumn([{ name: 'chat_group_seq' }])
  chatGroup: ChatGroup;
}
