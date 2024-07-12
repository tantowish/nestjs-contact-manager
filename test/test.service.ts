import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import * as bcrypt from 'bcrypt'

@Injectable()
export class TestService{
    constructor(
        private prismaService: PrismaService
    ){

    }

    async deleteUser(){
        await this.prismaService.user.deleteMany({
            where: {
                username: "test"
            }
        })
    }

    async createUser(){
        await this.prismaService.user.create({
            data: {
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('test', 10),
                token: 'test'
            }
        })
    }

    async getUser(){
        await this.prismaService.user.findUnique({
            where: {
                username: "test"
            }
        })
    }

    async deleteContact(){
        await this.prismaService.contact.deleteMany({
            where: {
                username: "test"
            }
        })
    }

    async createContact(){
        return await this.prismaService.contact.create({
            data:{
                username: "test",
                firstName: "test",
                lastName: "test",
                email: "test@gmail.com",
                phone: '0811111'
            }
        })
    }
}
