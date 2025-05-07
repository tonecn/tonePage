import { Controller, Get, Injectable, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getMe() {
        return 'ok';
    }
}
