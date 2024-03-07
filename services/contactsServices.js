import exp from "constants";
import Contact from "../models/Contact.js";

export const getAllContacts = () => Contact.find();

export const getOneContact = id => Contact.findById(id);

export const addContact = data => Contact.create(data);

export const updateContact = (id, data) =>
    Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const removeContact = id => Contact.findByIdAndDelete(id);

export const updateStatusContact = (id, data) =>
    Contact.findByIdAndUpdate(id, { 'favorite': data.favorite }, { new: true, runValidators: true });
