import {Router} from "express";
import {body, CustomValidator} from "express-validator";
import {authMiddleware} from "../middleware/authMiddleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {getUsersController} from "./controllers/getUsersController";
import {createUserController} from "./controllers/createUserController";
import {deleteUserController} from "./controllers/deleteUserController";
import {userMongoRepository} from "./userMongoRepository";
export const usersRouter = Router()

export const fieldsForUsers = {
    login: 'login',
    password: 'password',
    email: 'email'
}
const userExistsValidator:CustomValidator = async (value:string, { req }) => {
    const existingUser = await userMongoRepository.findByLoginOrEmail(value);
    if (existingUser) {
        if(existingUser.emailConfirmation.isConfirmed){
            return Promise.reject('User with this login/email already exists and confirmed');
        }
        return Promise.reject('User with this login/email already exists')
    }
};
const userLoginValidator = body(fieldsForUsers.login)
    .trim().notEmpty().withMessage('Login cannot be empty').bail()
    .isString().withMessage('Login must be a string').bail()
    .isLength({min: 3, max: 10}).withMessage('Login must be at most 10 characters long').bail()
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Invalid Login format').bail()
    .custom(userExistsValidator);

const userPasswordValidator=body(fieldsForUsers.password)
    .trim().notEmpty().withMessage('Password cannot be empty').bail()
    .isString().withMessage('Password must be a string').bail()
    .isLength({min: 6, max: 20}).withMessage('Password must be at most 20 characters long').bail()

const userEmailValidator=body(fieldsForUsers.email)
    .trim().notEmpty().withMessage('Email cannot be empty').bail()
    .isString().withMessage('Email must be a string').bail()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Invalid Email format').bail()
    .custom(userExistsValidator);

export const userInputValidator=[
    userLoginValidator,
    userPasswordValidator,
    userEmailValidator,
]
//Зарефакторил
usersRouter.get("/", authMiddleware, getUsersController)
usersRouter.post("/", authMiddleware, userInputValidator, inputCheckErrorsMiddleware, createUserController)
usersRouter.delete("/:id",authMiddleware, deleteUserController)