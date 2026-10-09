import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { Role } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtPayload } from './auth.types.js';
import { RegisterDto } from './dto/register.dto.js';

const userSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  role: true,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('invalid_credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: Role.user,
      },
      select: userSelect,
    });

    const jwtPayload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwt.signAsync(jwtPayload);

    return { user, accessToken };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async createAdmin() {
    const email = 'admin@gmail.com';
    const password = await bcrypt.hash('12345678', 10);

    return this.prisma.user.upsert({
      where: { email },
      update: { password, role: Role.admin },
      create: { email, password, name: 'Admin', role: Role.admin },
      select: userSelect,
    });
  }
}
