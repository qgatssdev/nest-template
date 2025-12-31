import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Config } from 'src/config';
import { UserRepository } from 'src/modules/auth/repository/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private readonly userRepository: UserRepository;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const [tokenType, token] = authorizationHeader.split(' ');

    if (tokenType !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const decoded = jwt.verify(token, Config.JWT_SECRET) as {
        id: string;
        email: string;
      };

      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user) {
        return false;
      }

      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('You are not authorized');
    }
  }
}
