import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common";
import { ListDto } from "../dto/admin-user/list.dto";
import { CreateDto } from "../dto/admin-user/create.dto";
import { UserService } from "src/user/user.service";
import { UpdateDto } from "../dto/admin-user/update.dto";
import { UpdatePasswordDto } from "../dto/admin-user/update-password.dto";

@Controller('admin/user')
export class AdminUserController {

    constructor(
        private readonly userService: UserService,
    ) { }

    @Get()
    async list(
        @Query() listDto: ListDto
    ) {
        return this.userService.list(listDto.page, listDto.pageSize);
    }

    @Get(':userId')
    async get(
        @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    ) {
        return this.userService.findOne({ userId });
    }

    @Post()
    async create(
        @Body() createDto: CreateDto
    ) {
        return this.userService.create({
            ...createDto,
            ...createDto.password && (() => {
                const salt = this.userService.generateSalt();
                return {
                    salt,
                    password_hash: this.userService.hashPassword(createDto.password, salt),
                }
            })(),
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
    ) {
        return this.userService.delete(userId);
    }

    @Post(':userId/password')
    async setPassword(
        @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
        @Body() updatePasswordDto: UpdatePasswordDto,
    ) {
        return this.userService.setPassword(userId, updatePasswordDto.password);
    }
}