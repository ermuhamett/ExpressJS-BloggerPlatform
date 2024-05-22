import nodemailer from "nodemailer"
import {SETTINGS} from "../../main/settings";
export const emailService = {
    async sendEmail(email:string, confirmationCode:string) {
      let transport=nodemailer.createTransport({
          service:"mail.ru",
          auth:{
              user:SETTINGS.SMTP_USER,
              pass:SETTINGS.SMTP_PASSWORD
        }
      });
      let info=await transport.sendMail({
          from:`Ermuhamet <${SETTINGS.SMTP_USER}>`,
          to:email,
          subject:'Confirm registration',
          html:` <h1>Thank for your registration</h1>
                 <p>To finish registration please follow the link below:
                 <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                </p>`,
      })
    }
}