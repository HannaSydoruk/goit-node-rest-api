import nodemailer from "nodemailer";
import "dotenv/config";

const { EMAIL_SERVER, EMAIL_SERVER_PASSWORD, EMAIL_FROM } = process.env;

const config = {
    host: EMAIL_SERVER,
    port: 465, // 587, //465,
    secure: true,
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_SERVER_PASSWORD
    }
}

const transport = nodemailer.createTransport(config);

const EMAIL = {
    from: EMAIL_FROM,
    subject: "Contacts API email verification"
}

export const sendVerifyEmail = async (email, verificationToken) => {
    const html = `<a href="http://localhost:3000/api/users/verify/${verificationToken}">Click to verify your email!</a>`
    const emailObj = { ...EMAIL, to: email, html };
    await transport.sendMail(emailObj);
};