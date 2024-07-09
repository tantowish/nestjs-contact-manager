import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { LoginUserRequest, RegisterUserRequest, toUserResponse, UpdateUserRequest, UserResponse } from 'src/model/user.model';
import { Logger } from 'winston'
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService
    ){

    }
    async register(request: RegisterUserRequest): Promise<UserResponse>{
        this.logger.debug(`Register new user ${JSON.stringify(request)}`)
        const registerRequest: RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER, request)

        const checkUsername = await this.prismaService.user.count({
            where: {
                username: registerRequest.username
            }
        })

        if(checkUsername !== 0){
            throw new HttpException('Username already exists', 400)
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10)

        const user = await this.prismaService.user.create({
            data: registerRequest
        })

        return toUserResponse(user)
    }

    async login(request: LoginUserRequest): Promise<UserResponse>{
        this.logger.debug(`Login user ${JSON.stringify(request)}`)
        const loginRequest: LoginUserRequest = this.validationService.validate(UserValidation.LOGIN, request)

        let user = await this.prismaService.user.findUnique({
            where: {
                username: loginRequest.username
            }
        })

        if(!user){
            throw new HttpException('Username or password is invalid', 401)
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)
        if(!isPasswordValid){
            throw new HttpException('Username or password is invalid', 401)
        }

        user = await this.prismaService.user.update({
            where: {
                username: user.username
            }, 
            data: {
                token: randomUUID()
            }
        })

        return toUserResponse(user)
    }

    async get(user: User): Promise<UserResponse>{
        this.logger.debug(`Get user ${user}`)
        return toUserResponse(user)
    }

    async update(user: User, request: UpdateUserRequest): Promise<UserResponse>{
        this.logger.debug(`Update user ${JSON.stringify(request)}`)

        const updateRequest: UpdateUserRequest = this.validationService.validate(UserValidation.UPDATE, request)

        if(updateRequest.name){
            user.name = updateRequest.name
        }

        if(updateRequest.password){
            user.password = await bcrypt.hash(updateRequest.password, 10)
        }

        const updatedUser = await this.prismaService.user.update({
            where: {
                username: user.username
            },
            data: user
        })

        return toUserResponse(updatedUser)
    }

    async logout(user: User): Promise<UserResponse>{
        this.logger.debug(`Logout user ${user}`)
        const logoutUser = await this.prismaService.user.update({
            where: {
                username: user.username
            },
            data: {
                token: null
            }
        })

        return toUserResponse(logoutUser)
    }
}
