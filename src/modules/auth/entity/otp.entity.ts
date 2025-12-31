import { OtpType } from 'src/libs/common/constants';
import { BaseEntity } from 'src/libs/core/base/BaseEntity';
import { User } from 'src/modules/auth/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Otp extends BaseEntity {
  @Column()
  code: string;
  @Column({ type: 'enum', enum: OtpType })
  type: OtpType;

  @Column({ nullable: false })
  expiresAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
