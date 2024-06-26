import { Schema, model } from "mongoose";
import { handleServerError, setUpdateSettings } from "./hooks.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    avatarURL: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
})

contactSchema.post("save", handleServerError);

contactSchema.pre("findOneAndUpdate", setUpdateSettings);

contactSchema.post("findOneAndUpdate", handleServerError);

const Contact = model("contact", contactSchema);

export default Contact;