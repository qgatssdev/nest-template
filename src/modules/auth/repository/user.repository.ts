import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from '../entity/user.entity';
import { BaseRepository } from 'src/libs/core/base/base.repository';

export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(entityManager.getRepository(User));
  }
}
