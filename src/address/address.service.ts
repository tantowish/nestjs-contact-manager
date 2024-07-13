import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AddressValidation } from './address.validation';
import { Address, User } from '@prisma/client';
import {
  AddressResponse,
  CreateAddressRequest,
  DeleteAddressRequest,
  GetAddressRequest,
  toAddressArrayResponse,
  toAddressResponse,
  UpdateAddressRequest,
} from 'src/model/address.model';
import { ValidationService } from 'src/common/validation.service';
import { ContactService } from 'src/contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private contactService: ContactService,
  ) {}

  async checkAddressExist(
    addressId: number,
    contactId: number,
    username: string,
  ): Promise<Address> {
    await this.contactService.checkContactExist(contactId, username);

    const address = await this.prismaService.address.findUnique({
      where: {
        id: addressId,
        contactId: contactId,
      },
    });

    if (!address) {
      throw new HttpException('Address is not found', 404);
    }

    return address;
  }

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `Create new address for contactId ${request.contactId} with data ${JSON.stringify(request)}`,
    );

    const addressRequest: CreateAddressRequest =
      this.validationService.validate(AddressValidation.CREATE, request);

    await this.contactService.checkContactExist(
      addressRequest.contactId,
      user.username,
    );

    const address = await this.prismaService.address.create({
      data: addressRequest,
    });

    return toAddressResponse(address);
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    this.logger.debug(
      `Get address with contactId ${request.contactId} for addressId ${request.contactId}`,
    );

    const addressRequest: GetAddressRequest = this.validationService.validate(
      AddressValidation.GET,
      request,
    );

    const address = await this.checkAddressExist(
      addressRequest.addressId,
      addressRequest.contactId,
      user.username,
    );
    return toAddressResponse(address);
  }

  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `Update address for id ${request.id} with data ${JSON.stringify(request)}`,
    );

    const addressRequest: UpdateAddressRequest =
      this.validationService.validate(AddressValidation.UPDATE, request);

    let address = await this.checkAddressExist(
      addressRequest.id,
      addressRequest.contactId,
      user.username,
    );
    address = await this.prismaService.address.update({
      where: {
        id: addressRequest.id,
        contactId: addressRequest.contactId,
      },
      data: addressRequest,
    });

    return toAddressResponse(address);
  }

  async delete(
    user: User,
    request: DeleteAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `Delete address with contactId ${request.contactId} for addressId ${request.contactId}`,
    );

    const addressRequest: DeleteAddressRequest =
      this.validationService.validate(AddressValidation.DELETE, request);

    let address = await this.checkAddressExist(
      addressRequest.addressId,
      addressRequest.contactId,
      user.username,
    );
    address = await this.prismaService.address.delete({
      where: {
        id: addressRequest.addressId,
        contactId: addressRequest.contactId,
      },
    });

    return toAddressResponse(address);
  }

  async list(user: User, contactId: number): Promise<AddressResponse[]> {
    this.logger.debug(`Get list address with contactId ${contactId}`);

    await this.contactService.checkContactExist(contactId, user.username);
    const addresses = await this.prismaService.address.findMany({
      where: {
        contactId: contactId,
      },
    });

    return toAddressArrayResponse(addresses);
  }
}
