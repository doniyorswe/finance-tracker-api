import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { JwtPayload } from './auth.types.js';

/**
 * Himoyalangan route'lar uchun: `@UseGuards(AuthGuard)`
 *
 * "Authorization: Bearer <token>" header'ini o'qiydi, tokenni tekshiradi
 * va payload'ni `request.user` ga yozadi (keyin @CurrentUser() bilan olinadi).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('token_missing');
    }

    try {
      request.user = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      // imzo noto'g'ri yoki muddati o'tgan
      throw new UnauthorizedException('token_invalid');
    }
    return true;
  }
}

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}
