import nodemailer from "nodemailer"
import {SETTINGS} from "../../main/settings";
import {mailTemplates} from "./mail.templates";
import {MailOptions} from "nodemailer/lib/sendmail-transport";

const transport=nodemailer.createTransport({
    service:"mail.ru",
    auth:{
        user:SETTINGS.SMTP_USER,
        pass:SETTINGS.SMTP_PASSWORD
    },
    secure: true, // Использовать SSL
});
export const emailService = {
    async sendRegistrationEmail(userEmail:string, confirmationCode:string){
        const emailTemplate=mailTemplates.getRegistrationMailTemplate(userEmail,confirmationCode)
        return await this.sendEmail(emailTemplate)
    },
    async sendPasswordRecoveryEmail(userEmail:string, recoveryCode:string){
        const emailTemplate=mailTemplates.getPasswordRecoveryMailTemplate(userEmail, recoveryCode)
        return await this.sendEmail(emailTemplate)
    },
    async sendEmail(emailTemplate:MailOptions) {
        return await transport.sendMail(emailTemplate)
    },
}