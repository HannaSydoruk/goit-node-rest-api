import exp from "constants";
import Contact from "../models/Contact.js";

export const getAllContacts = (ownerId) => Contact.find().where("owner").equals(ownerId);

export const getOneContact = (id, ownerId) => Contact.findById(id).where("owner").equals(ownerId);

export const addContact = data => Contact.create(data);

export const updateContact = (id, ownerId, data) =>
    Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true }).where("owner").equals(ownerId);

export const removeContact = (id, ownerId) => Contact.findByIdAndDelete(id).where("owner").equals(ownerId);

export const updateStatusContact = (id, ownerId, data) =>
    Contact.findByIdAndUpdate(id, { 'favorite': data.favorite }, { new: true, runValidators: true }).where("owner").equals(ownerId);
