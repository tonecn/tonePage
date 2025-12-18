import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const { user } = req;
    return this.userService.findById(user.userId);
  }

  @UseGuards(AuthGuard)
  @Put('password')
  async update(@Request() req, @Body() dto: UpdateUserPasswordDto) {
    return this.userService.setPassword(req.user.userId, dto.password);
  }
}
