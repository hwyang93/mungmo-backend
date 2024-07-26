import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'seq' })
  seq: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Timestamp;

  @Column({ type: 'datetime', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Timestamp;

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', select: false })
  deletedAt: Timestamp;
}