import { Controller, Get, Query } from "@nestjs/common";
import { AdminUserService } from "../service/admin-user.service";
import { ListDto } from "../dto/admin-user/list.dto";

@Controller('admin/user')
export class AdminUserController {

    constructor(
        private readonly adminUserService: AdminUserService,
    ) { }

    @Get()
    async list(
        @Query() listDto: ListDto
    ) {
        return this.adminUserService.getUser(listDto.page, listDto.pageSize);
    }
}