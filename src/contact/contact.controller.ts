import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Search,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from 'src/model/contact.model';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.create(user, request);
    return {
      message: 'Create Contact Success',
      data: result,
    };
  }

  @Get('/:contactId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.get(user, contactId);
    return {
      message: 'Get Contact Success',
      data: result,
    };
  }

  @Put('/:contactId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: UpdateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    request = {
      ...request,
      id: contactId,
    };
    const result = await this.contactService.update(user, request);
    return {
      message: 'Update Contact Success',
      data: result,
    };
  }

  @Delete('/:contactId')
  @HttpCode(200)
  async delete(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.delete(user, contactId);
    return {
      message: 'Delete Contact Success',
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<WebResponse<ContactResponse[]>> {
    const request: SearchContactRequest = {
      name: name,
      email: email,
      phone: phone,
      page: page || 1,
      size: size || 10,
    };

    const result = this.contactService.search(user, request);
    return result;
  }
}
