import { BaseEntity } from './BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'walk_history' })
export class WalkHistory extends BaseEntity {
  @Column({ type: 'datetime', name: 'started_at' })
  startedAt: string;

  @Column({ type: 'datetime', name: 'ended_at', nullable: true })
  endedAt: string;

  @Column({ type: 'int', name: 'parent_seq', nullable: true })
  parentSeq: number;

  @Column({ type: 'varchar', length: 25, name: 'status' })
  status: string;

  @Column({ type: 'int', name: 'user_seq', select: false })
  userSeq: number;
}
