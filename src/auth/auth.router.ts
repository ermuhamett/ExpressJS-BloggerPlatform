import {Router} from "express";
import {jwtMiddleware} from "../middleware/jwtMiddleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {fieldsForUsers, userInputValidator} from "../users/users.router";
import {body, CustomValidator} from "express-validator";
import {authRefreshTokenMiddleware} from "../middleware/authRefreshTokenMiddleware";
import {isEmailValidation, notEmptyString, passwordRecoveryValidation} from "../common/validations";
import {rateLimitMiddleware} from "../middleware/rateLimitMiddleware";
import {container} from "../main/composition-root";
import {AuthController} from "./authController";
import {UserQueryRepository} from "../users/userQueryRepository";

export const authRouter = Router()
const authController=container.resolve<AuthController>(AuthController)
const userQueryRepository=container.resolve<UserQueryRepository>(UserQueryRepository)

const isUserExist: CustomValidator = async (value: string, {req}) => {
    const existingUser = await userQueryRepository.findByLoginOrEmail(value);
    if (!existingUser) {
        return Promise.reject('User with this email not exist');
    }
    if (existingUser.emailConfirmation.isConfirmed) {
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
        let user = await userQueryRepository.findUserByConfirmationCode(code)
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
const loginOrEmailValidation = notEmptyString('loginOrEmail')
const passwordValidation = notEmptyString('password')
const loginOrEmailValidator = [
    loginOrEmailValidation,
    passwordValidation
]
//Логиним User и получаем пару токенов
authRouter.post("/login", rateLimitMiddleware, loginOrEmailValidator,inputCheckErrorsMiddleware, authController.loginCheck.bind(authController))
//получаем новую пару токенов
authRouter.post("/refresh-token", authRefreshTokenMiddleware, authController.refreshToken.bind(authController))
//выход и очистка токенов
authRouter.post("/logout", authRefreshTokenMiddleware, authController.logoutController.bind(authController))
//создаем и регистрируем пользователя
authRouter.post("/registration",rateLimitMiddleware, userInputValidator, inputCheckErrorsMiddleware, authController.registerUser.bind(authController))
//отправка письма с кодом подтверждения
authRouter.post("/registration-confirmation",rateLimitMiddleware, registrationConfirmationValidator, inputCheckErrorsMiddleware, authController.registrationConfirmation.bind(authController))
//повторная отправка email
authRouter.post("/registration-email-resending",rateLimitMiddleware, registrationEmailValidator, inputCheckErrorsMiddleware, authController.emailResending.bind(authController))
//письмо на почту с кодом для обновления пароля
authRouter.post("/password-recovery",rateLimitMiddleware, isEmailValidation(), authController.sendPasswordRecoveryEmail.bind(authController))
//обновляем пароль
authRouter.post("/new-password",rateLimitMiddleware,passwordRecoveryValidation(), authController.recoverUserPassword.bind(authController))
//получаем инфо о текущем пользователе
authRouter.get("/me", jwtMiddleware, authController.currentUser.bind(authController))