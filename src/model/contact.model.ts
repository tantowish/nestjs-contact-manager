import { Contact } from '@prisma/client';

export type CreateContactRequest = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type UpdateContactRequest = {
  id: number;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type ContactResponse = {
  id: number;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type SearchContactRequest = {
  name?: string;
  email?: string;
  phone?: string;
  page: number;
  size: number;
};

export function toContactResponse(contact: Contact): ContactResponse {
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
  };
}

export function toContactArrayResponse(contacts: Contact[]): ContactResponse[] {
  return contacts.map((contact) => ({
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
  }));
}
