import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.model';
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from 'src/model/user.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/users')
export class UserController {
    constructor(
        private userService: UserService
    ){

    }

    @Post()
    @HttpCode(201)
    async register(@Body() request: RegisterUserRequest): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.register(request)
        return {
            message: "Register User Success",
            data: result
        }
    }

    @Post('/login')
    @HttpCode(200)
    async login(@Body() request: LoginUserRequest): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.login(request)
        return {
            message: "Login User Success",
            data: result
        }
    }

    @Get()
    @HttpCode(200)
    async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.get(user)
        return {
            message: "Get User Success",
            data: result
        }
    }

    @Patch()
    @HttpCode(200)
    async update(@Auth() user: User, @Body() request: UpdateUserRequest): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.update(user, request)
        return {
            message: "Update User Success",
            data: result
        }
    }

    @Delete()
    @HttpCode(200)
    async logout(@Auth() user: User): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.logout(user)
        return {
            message: "Logout User Success",
            data: result
        }
    }

}
