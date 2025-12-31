import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/libs/core/base/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true, type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;
}
