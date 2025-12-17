import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListDto } from '../dto/admin-user/list.dto';
import { CreateDto } from '../dto/admin-user/create.dto';
import { UserService } from 'src/user/user.service';
import { UpdateDto } from '../dto/admin-user/update.dto';
import { UpdatePasswordDto } from '../dto/admin-user/update-password.dto';
import { RemoveUserDto } from '../dto/admin-user/remove.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/auth/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('admin/user')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AdminUserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async list(@Query() listDto: ListDto) {
    return this.userService.list(listDto.page, listDto.pageSize);
  }

  @Get(':userId')
  async get(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.userService.findOne({ userId });
  }

  @Post()
  async create(@Body() createDto: CreateDto) {
    return this.userService.create({
      ...createDto,
      ...(createDto.password &&
        (() => {
          const salt = this.userService.generateSalt();
          return {
            salt,
            password_hash: this.userService.hashPassword(
              createDto.password,
              salt,
            ),
          };
        })()),
    });
  }

  @Put(':userId')
  async update(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() updateDto: UpdateDto,
  ) {
    return this.userService.update(userId, updateDto);
  }

  @Delete(':userId')
  async delete(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Query() dto: RemoveUserDto,
  ) {
    return this.userService.delete(userId, dto.soft);
  }

  @Post(':userId/password')
  async setPassword(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.setPassword(userId, updatePasswordDto.password);
  }
}
