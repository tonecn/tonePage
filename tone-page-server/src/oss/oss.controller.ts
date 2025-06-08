import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { OssService } from './oss.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('oss')
export class OssController {

    constructor(
        private readonly ossService: OssService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('sts')
    async getStsToken(@Request() req) {
        const { userId, sessionId } = req.user;
        return {
            ...await this.ossService.getStsToken(`${userId}`),
            userId,
        }
    }
}
