import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin() {
    const admin = await this.prisma.admin.findFirst({
      where: { email: 'admin@gmail.com' },
    });
    if (admin) {
      return admin;
    }
    return await this.prisma.admin.create({
      data: {
        email: 'admin@gmail.com',
        password: '12345678',
        name: 'Admin',
      },
    });
  }

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findFirst({
      where: { email, password },
    });
    if (!admin) {
      throw new BadRequestException('invalid_credentials');
    }
    return admin;
  }
}
