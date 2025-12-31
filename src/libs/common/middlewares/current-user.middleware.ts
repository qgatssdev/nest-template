import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Config } from 'src/config';
import { UserRepository } from 'src/modules/auth/repository/user.repository';

// Extend Request interface to include user property
interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  @Inject()
  private readonly userRepository: UserRepository;

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers['authorization'];

      if (!authorizationHeader) {
        return next();
      }

      const [tokenType, token] = authorizationHeader.split(' ');

      if (tokenType !== 'Bearer' || !token) {
        return next();
      }

      const decoded = jwt.verify(token, Config.JWT_SECRET) as {
        id: string;
        email: string;
      };

      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      if (user) {
        req.user = user;
      }
    } catch (error) {
      console.log('Current user middleware error:', error.message);
    }

    next();
  }
}
