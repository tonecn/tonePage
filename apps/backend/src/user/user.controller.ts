import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthUser, CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: AuthUser) {
    return this.userService.findById(user.userId);
  }

  @UseGuards(AuthGuard)
  @Put('password')
  async update(@CurrentUser() user: AuthUser, @Body() dto: UpdateUserPasswordDto) {
    return this.userService.setPassword(user.userId, dto.password);
  }
}
