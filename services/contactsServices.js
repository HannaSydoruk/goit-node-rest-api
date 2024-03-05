// import fs from 'fs/promises';
// import path from 'path';
// import { nanoid } from "nanoid";

// const contactsPath = path.resolve("db", "contacts.json");

// export async function getAllContacts() {
//     const data = await fs.readFile(contactsPath);
//     return JSON.parse(data);
// }

// export async function getOneContact(contactId) {
//     const contacts = await getAllContacts();
//     const result = contacts.find(item => item.id === contactId);

//     return result || null;
// }

// export async function removeContact(contactId) {
//     const contacts = await getAllContacts();
//     const index = contacts.findIndex(item => item.id === contactId);
//     if (index === -1) {
//         return null;
//     }
//     const [result] = contacts.splice(index, 1);
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

//     return result;
// }

// export async function addContact(data) {
//     const contacts = await getAllContacts();
//     const newContact = {
//         id: nanoid(),
//         ...data,
//     }
//     contacts.push(newContact);
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//     return newContact;
// }

// export async function updateContact(contactId, data) {
//     const contacts = await getAllContacts();
//     const index = contacts.findIndex(item => item.id === contactId);
//     if (index === -1) {
//         return null;
//     }
//     contacts[index] = { ...contacts[index], ...data };
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//     return contacts[index];
// }

import Contact from "../models/Contact.js";

export const getAllContacts = () => Contact.find();

export const addContact = data => Contact.create(data);