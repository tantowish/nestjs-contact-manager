import { Address } from '@prisma/client';

export type AddressResponse = {
  id: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postalCode: string;
};

export type CreateAddressRequest = {
  contactId: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postalCode: string;
};

export type GetAddressRequest = {
  contactId: number;
  addressId: number;
};

export type DeleteAddressRequest = {
  contactId: number;
  addressId: number;
};

export type UpdateAddressRequest = {
  id: number;
  contactId: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postalCode: string;
};

export function toAddressResponse(address: Address): AddressResponse {
  return {
    id: address.id,
    street: address.street,
    city: address.city,
    province: address.province,
    country: address.country,
    postalCode: address.postalCode,
  };
}

export function toAddressArrayResponse(
  addresses: Address[],
): AddressResponse[] {
  return addresses.map((address) => ({
    id: address.id,
    street: address.street,
    city: address.city,
    province: address.province,
    country: address.country,
    postalCode: address.postalCode,
  }));
}
