import { HttpException, Inject, Injectable, Post } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston'
import { ValidationService } from 'src/common/validation.service';
import { ContactResponse, CreateContactRequest, SearchContactRequest, toContactArrayResponse, toContactResponse, UpdateContactRequest } from 'src/model/contact.model';
import { Contact, User } from '@prisma/client';
import { ContactValidation } from './contact.validation';
import { WebResponse } from 'src/model/web.model';

@Injectable()
export class ContactService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService
    ){}

    async checkContactExist(contactId: number, username: string): Promise<Contact> {
        const contact = await this.prismaService.contact.findUnique({
            where:{
                id: contactId,
                username: username
            }
        })

        if(!contact){
            throw new HttpException("Contact is not found", 404)
        }
        
        return contact
    }

    async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {
        this.logger.debug(`Create new contact for ${user} with data ${JSON.stringify(request)}`)

        const contactRequest = this.validationService.validate(ContactValidation.CREATE, request)

        const data = {
            ...contactRequest,
            username: user.username
        }
        const contact = await this.prismaService.contact.create({
            data: data
        })

        return toContactResponse(contact)
    }

    async get(user: User, contactId: number): Promise<ContactResponse> {
        this.logger.debug(`Get contact with id ${contactId} for ${user}`)

        const contact = await this.checkContactExist(contactId, user.username)
        return toContactResponse(contact)
    }

    async update(user: User, request: UpdateContactRequest): Promise<ContactResponse> {
        this.logger.debug(`Update contact with id ${request.id} for ${user} and data ${JSON.stringify(request)}}`)

        const contactRequest: UpdateContactRequest = this.validationService.validate(ContactValidation.UPDATE, request)

        let contact = await this.checkContactExist(contactRequest.id, user.username)
        contact = await this.prismaService.contact.update({
            where: {
                id: contactRequest.id,
                username: user.username
            },
            data: contactRequest
        })

        return toContactResponse(contact)
    }

    async delete(user: User, contactId: number): Promise<ContactResponse> {
        this.logger.debug(`Delete contact with id ${contactId} for ${user}`)

        let contact = await this.checkContactExist(contactId, user.username)
        contact = await this.prismaService.contact.delete({
            where: {
                id: contactId,
                username: user.username
            }
        })

        return toContactResponse(contact)
    }

    async search(user: User, request: SearchContactRequest): Promise<WebResponse<ContactResponse[]>> {
        this.logger.debug(`Searching contacts for ${user} with data ${JSON.stringify(request)}`)

        const searchRequest: SearchContactRequest = this.validationService.validate(ContactValidation.SEARCH, request)
        const filters = []

        if(searchRequest.name){
            // add name filter
            filters.push({
                OR: [
                    {
                        firstName: {
                            contains: searchRequest.name
                        }
                    },
                    {
                        lastName: {
                            contains: searchRequest.name
                        }
                    }
                ]
            })
        }
        if(searchRequest.email){
            // add email filter
            filters.push({
                email: {
                    contains: searchRequest.email
                }
            })
        }
        if(searchRequest.phone){
            // add phone filter
            filters.push({
                phone: {
                    contains: searchRequest.phone
                }
            })
        }

        console.log(searchRequest)

        const skip = (searchRequest.page - 1) * searchRequest.size
        const contacts = await this.prismaService.contact.findMany({
            where: {
                username: user.username,
                AND: filters
            },
            take:searchRequest.size,
            skip: skip,
        })

        const total = await this.prismaService.contact.count({
            where: {
                username: user.username,
                AND: filters
            }
        })

        return {
            message: "Search List Contact Success",
            data: toContactArrayResponse(contacts),
            paging: {
                currentPage: searchRequest.page,
                size: searchRequest.size,
                totalPage: Math.ceil(total/searchRequest.size)
            }
        }
    }
}
