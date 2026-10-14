import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';

const userSelect = {
  id: true,
  fullName: true,
  createdAt: true,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { full_name: fullName, telegram_user_id: telegramUserId } = dto;

    const user = await this.prisma.user.findUnique({
      where: { telegramUserId },
    });

    if (user) {
      return {
        token: this.jwt.sign({ sub: user.id }),
        user,
      };
    }

    const newUser = await this.prisma.user.create({
      data: {
        fullName,
        telegramUserId,
      },
      select: userSelect,
    });

    return {
      token: this.jwt.sign({ sub: newUser.id }),
      user: newUser,
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
