import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AddressService } from './address.service';
import { WebResponse } from 'src/model/web.model';
import { AddressResponse, CreateAddressRequest, DeleteAddressRequest, GetAddressRequest, UpdateAddressRequest } from 'src/model/address.model';
import { Auth } from 'src/common/auth.decorator';
import { request } from 'http';
import { User } from '@prisma/client';

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
    constructor(
        private addressSerice: AddressService
    ){}

    @Post()
    @HttpCode(201)
    async create(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Body() request: CreateAddressRequest
    ): Promise<WebResponse<AddressResponse>> {
        request.contactId = contactId
        const result = await this.addressSerice.create(user, request)
        return {
            message: "Create Address Success",
            data: result
        }
    }

    @Get('/:addressId')
    @HttpCode(200)
    async get(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
    ): Promise<WebResponse<AddressResponse>> {
        const request: GetAddressRequest = {
            contactId,
            addressId
        }
        const result = await this.addressSerice.get(user, request)
        return {
            message: "Get Address Success",
            data: result
        }
    }

    @Put('/:addressId')
    @HttpCode(200)
    async update(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
        @Body() request: UpdateAddressRequest
    ): Promise<WebResponse<AddressResponse>> {
        request.id = addressId,
        request.contactId = contactId
        const result = await this.addressSerice.update(user, request)
        return {
            message: "Update Address Success",
            data: result
        }
    }

    @Delete('/:addressId')
    @HttpCode(200)
    async delete(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
    ): Promise<WebResponse<AddressResponse>> {
        const request: DeleteAddressRequest = {
            contactId,
            addressId
        }
        await this.addressSerice.delete(user, request)
        return {
            message: "Delete Address Success",
        }
    }

    @Get()
    @HttpCode(200)
    async list(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
    ): Promise<WebResponse<AddressResponse[]>> {
        const result = await this.addressSerice.list(user, contactId)
        return {
            message: "Get List Address Success",
            data: result
        }
    }
}
