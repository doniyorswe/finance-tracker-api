import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('create-admin')
  async createAdmin() {
    return this.authService.createAdmin();
  }
}
