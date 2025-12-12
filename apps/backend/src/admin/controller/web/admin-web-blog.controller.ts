import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateBlogDto } from 'src/admin/dto/admin-web/create-blog.dto';
import { SetBlogPasswordDto } from 'src/admin/dto/admin-web/set-blog-password.dto';
import { UpdateBlogDto } from 'src/admin/dto/admin-web/update-blog.dto';
import { Role } from 'src/auth/role.enum';
import { BlogService } from 'src/blog/blog.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';

@Controller('/admin/web/blog')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Admin)
export class AdminWebBlogController {
  constructor(private readonly adminWebBlogService: BlogService) {}

  @Get()
  async list() {
    return this.adminWebBlogService.list({
      withAll: true,
    });
  }

  @Post()
  async create(@Body() dto: CreateBlogDto) {
    return this.adminWebBlogService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.adminWebBlogService.update(id, dto);
  }

  @Post(':id/password')
  async setPassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: SetBlogPasswordDto,
  ) {
    return this.adminWebBlogService.setPassword(id, dto.password);
  }

  @Get(':id')
  async get(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.adminWebBlogService.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.adminWebBlogService.remove(id);
  }
}
