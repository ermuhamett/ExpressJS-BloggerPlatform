import {SETTINGS} from "../../main/settings";

export const mailTemplates = {
    getRegistrationMailTemplate(userEmail: string, confirmationCode: string) {
        return {
            from: `BloggerPlatform <${SETTINGS.SMTP_USER}>`,
            to: userEmail,
            subject: 'Verify your registration on "BloggerPlatform"',
            html: `<h1>Thanks for your registration on "BloggerPlatform"</h1>
             <p>To finish registration please follow the link:
                 <a href='https://google.com?code=${confirmationCode}'>complete registration</a>
             </p>`,
        };
    },
    getPasswordRecoveryMailTemplate(userEmail: string, confirmationCode: string) {
        return {
            from: `BloggerPlatform <${SETTINGS.SMTP_USER}>`,
            to: userEmail,
            subject: 'Password recovery for "BloggerPlatform"',
            html: `<h1>Recovery your password on "BloggerPlatform"</h1>
             <p>To finish password recovery please follow the link:
                 <a href='https://google.com/password-recovery?recoveryCode=${confirmationCode}'>recovery password</a>
             </p>
             <p>
                If you have not registreted at "Blogs inc. JoyMe" just ignore this message
             </p>`,
        };
    },
}