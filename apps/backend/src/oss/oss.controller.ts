import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { OssService } from './oss.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) { }

  @UseGuards(AuthGuard)
  @Get('sts')
  async getStsToken(@Request() req) {
    const { userId } = req.user;
    return {
      ...(await this.ossService.getStsToken(`${userId}`)),
      userId,
    };
  }
}
