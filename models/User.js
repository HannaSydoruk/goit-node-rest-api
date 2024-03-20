import { Schema, model } from "mongoose";
import { handleServerError, setUpdateSettings } from "./hooks.js";

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
    }

}, { versionKey: false, timestamps: true });

userSchema.post("save", handleServerError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handleServerError);

const User = model("user", userSchema);

export default User;