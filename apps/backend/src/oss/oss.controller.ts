import { Controller, Get, UseGuards } from '@nestjs/common';
import { OssService } from './oss.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthUser, CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) { }

  @UseGuards(AuthGuard)
  @Get('sts')
  async getStsToken(@CurrentUser() user: AuthUser) {
    const { userId } = user;
    return {
      ...(await this.ossService.getStsToken(`${userId}`)),
      userId,
    };
  }
}
