import {Router} from "express";
import {body} from "express-validator";
import {authMiddleware} from "../middleware/authMiddleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {userService} from "./user-service";
import {getUsersController} from "./controllers/getUsersController";


export const usersRouter = Router()

export const fieldsForUsers = {
    login: 'login',
    password: 'password',
    email: 'email'
}

const userLoginValidator = body(fieldsForUsers.login)
    .trim().notEmpty().withMessage('Login cannot be empty').bail()
    .isString().withMessage('Login must be a string').bail()
    .isLength({min: 3, max: 10}).withMessage('Login must be at most 10 characters long').bail()
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Invalid Login format').bail();

const userPasswordValidator=body(fieldsForUsers.password)
    .trim().notEmpty().withMessage('Password cannot be empty').bail()
    .isString().withMessage('Password must be a string').bail()
    .isLength({min: 6, max: 20}).withMessage('Password must be at most 20 characters long').bail()

const userEmailValidator=body(fieldsForUsers.email)
    .trim().notEmpty().withMessage('Email cannot be empty').bail()
    .isString().withMessage('Email must be a string').bail()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Invalid Email format').bail();

export const userInputValidator=[
    userLoginValidator,
    userPasswordValidator,
    userEmailValidator,
]
usersRouter.get("/", authMiddleware, getUsersController)
usersRouter.post("/", authMiddleware, userInputValidator, inputCheckErrorsMiddleware, userService.createUser)
usersRouter.delete("/:id",authMiddleware, userService.deleteUser)