import {Router} from "express";
import {jwtMiddleware} from "../middleware/jwtMiddleware";
import {loginCheckController} from "./controllers/loginCheckController";
import {currentUserController} from "./controllers/currentUserController";
import {registerUserController} from "./controllers/registerUserController";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {fieldsForUsers, userInputValidator} from "../users/users.router";
import {emailResendingController} from "./controllers/emailResendingController";
import {confirmRegistrationController} from "./controllers/confirmRegistrationController";
import {body, CustomValidator} from "express-validator";
import {userMongoRepository} from "../users/userMongoRepository";
import {authRefreshTokenMiddleware} from "../middleware/authRefreshTokenMiddleware";
import {refreshTokenController} from "./controllers/refreshTokenController";
import {logoutController} from "./controllers/logoutController";

export const authRouter = Router()

const isUserExist:CustomValidator=async(value:string, { req })=>{
    const existingUser = await userMongoRepository.findByLoginOrEmail(value);
    if(!existingUser){
        return Promise.reject('User with this email not exist');
    }
    if(existingUser.emailConfirmation.isConfirmed){
        return Promise.reject('User with this email already exists and confirmed');
    }
}
const userEmailValidator = body(fieldsForUsers.email)
    .trim().notEmpty().withMessage('Email cannot be empty').bail()
    .isString().withMessage('Email must be a string').bail()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Invalid Email format').bail()
    .custom(isUserExist)
export const registrationEmailValidator = [
    userEmailValidator
]
// Кастомная проверка для подтверждения пользователя по коду
const isUserConfirmed: CustomValidator = async (value: string, {req}) => {
    const code = req.body.code;
    try {
        // Проверяем, существует ли пользователь с заданным кодом
        let user = await userMongoRepository.findUserByConfirmationCode(code)
        if (!user) {
            return Promise.reject('User with this code not exist');// Генерируем ошибку если не найдено
        }
        if (user.emailConfirmation.isConfirmed) {
            return Promise.reject('User already confirmed'); // Если пользователь уже подтвержден, генерируем ошибку
        }
        return Promise.resolve(); // Если пользователь не подтвержден, продолжаем выполнение
    } catch (error) {
        console.error("Error checking user confirmation status:", error);
        return Promise.reject('Failed to check user confirmation status');
    }
};

const registrationConfirmationValidator = [
    body('code').trim().notEmpty().withMessage('Confirmation code cannot be empty').bail()
        .isString().withMessage('Code must be a string').bail()
        .custom(isUserConfirmed) // Добавляем кастомную проверку
];

authRouter.post("/login", loginCheckController)
authRouter.post("/refresh-token", authRefreshTokenMiddleware,refreshTokenController)
authRouter.post("/logout",authRefreshTokenMiddleware,logoutController)
authRouter.post("/registration", userInputValidator, inputCheckErrorsMiddleware, registerUserController)
authRouter.post("/registration-confirmation", registrationConfirmationValidator, inputCheckErrorsMiddleware, confirmRegistrationController)
authRouter.post("/registration-email-resending", registrationEmailValidator, inputCheckErrorsMiddleware, emailResendingController)
authRouter.get("/me", jwtMiddleware, currentUserController)