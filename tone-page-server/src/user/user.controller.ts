import { Controller, Get, Injectable, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getMe(@Request() req) {
        const { user } = req;
        if (!user || !user.userId) {
            throw new UnauthorizedException('Unauthorized');
        }
        return this.userService.findOne({ userId: user.userId });
    }
}
