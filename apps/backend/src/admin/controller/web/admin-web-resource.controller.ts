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
import { CreateResourceDto } from 'src/admin/dto/admin-web/create-resource.dto';
import { ResourceListDto } from 'src/admin/dto/admin-web/resource-list.dto';
import { AdminResourceService } from 'src/admin/services/admin.resource.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';

@Controller('/admin/web/resource')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AdminWebResourceController {

  constructor(private readonly resourceService: AdminResourceService) { }

  @Get()
  async list(@Query() query: ResourceListDto) {
    return this.resourceService.findAll(query.page, query.pageSize, query.query);
  }

  @Get(':id')
  async get(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.resourceService.findById(id);
  }

  @Post()
  async create(@Body() data: CreateResourceDto) {
    return this.resourceService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() data: CreateResourceDto,
  ) {
    return this.resourceService.update({
      ...data,
      id,
    });
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.resourceService.delete(id);
  }
}
