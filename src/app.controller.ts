import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  getInfo() {
    return { name: 'financetracker-backend', status: 'ok' };
  }
}
