import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema, updateStatusSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const result = await contactsService.getAllContacts(_id);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { id } = req.params;
        const result = await contactsService.getOneContact(id, _id);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { id } = req.params;
        const result = await contactsService.removeContact(id, _id);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { error } = createContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const { _id: owner } = req.user;
        const result = await contactsService.addContact({ ...req.body, owner });

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { error } = updateContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const { _id } = req.user;
        const { id } = req.params;
        const result = await contactsService.updateContact(id, _id, req.body);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }

        res.json(result);

    } catch (error) {
        next(error);
    }
};

export const updateStatusContact = async (req, res, next) => {
    try {
        const { error } = updateStatusSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const { _id } = req.user;
        const { id } = req.params;
        const result = await contactsService.updateStatusContact(id, _id, req.body);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }

        res.json(result);

    } catch (error) {
        next(error);
    }
};
