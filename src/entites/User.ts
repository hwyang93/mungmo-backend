import { BaseEntity } from './BaseEntity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Pet } from './Pet';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 60, name: 'name', comment: '이름', select: false })
  name: string;

  @Column({ type: 'varchar', length: 50, name: 'email', comment: '이메일' })
  email: string;

  @Column({ type: 'varchar', length: 15, name: 'phone', comment: '전화번호', nullable: true, select: false })
  phone: string;

  @Column({ type: 'int', name: 'social_login_type', comment: '소셜 로그인 타입' })
  socialLoginType: number;

  @OneToOne(() => Pet, Pet => Pet.user)
  pet: Pet;
}
