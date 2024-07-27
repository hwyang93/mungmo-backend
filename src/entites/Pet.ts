import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'pet' })
export class Pet extends BaseEntity {
  @Column({ type: 'varchar', length: 60, name: 'name', comment: '이름' })
  name: string;

  @Column({ type: 'varchar', length: 50, name: 'breed', comment: '견종' })
  breed: string;

  @Column({ type: 'double', name: 'weight', comment: '무게' })
  weight: number;

  @Column({ type: 'int', name: 'birth', comment: '출생년도' })
  birth: number;

  @Column({ type: 'varchar', length: 2000, name: 'etc', comment: '기타정보' })
  etc: string;

  @Column({ type: 'int', name: 'walking_goal', comment: '산책목표', nullable: true })
  walkingGoal: number;

  @Column({ type: 'int', name: 'user_seq', select: false })
  userSeq: number;

  @OneToOne(() => User, User => User.pet)
  @JoinColumn([{ name: 'user_seq' }])
  user: User;
}
