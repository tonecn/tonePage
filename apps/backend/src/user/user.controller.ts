import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req) {
    const { user } = req;
    return this.userService.findOne({ userId: user.userId });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('password')
  async update(@Request() req, @Body() dto: UpdateUserPasswordDto) {
    return this.userService.setPassword(req.user.userId, dto.password);
  }
}
