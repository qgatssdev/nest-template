import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { BaseRepository } from 'src/libs/core/base/base.repository';
import { Otp } from '../entity/otp.entity';

export class OtpRepository extends BaseRepository<Otp> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(entityManager.getRepository(Otp));
  }
}
