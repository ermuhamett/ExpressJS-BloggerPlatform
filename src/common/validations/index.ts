import {body} from "express-validator";
import {ObjectId} from "mongodb";
import {UsersMongooseModel} from "../../db/mongoose/models";
import {inputCheckErrorsMiddleware} from "../../middleware/inputCheckErrorsMiddleware";
import {LikeStatuses} from "../../types/like-db-type";

export const stringWithLengthValidation = (field: string, options: { max: number, min: number }) => {
    const {min, max} = options

    return body(field)
        .isString().withMessage('Must be string').trim().bail()
        .isLength({min, max}).withMessage(`Not more than ${max} symbols, not less that ${min}`).bail()
}
export const isValidId = (id: string) => ObjectId.isValid(id)
export const notEmptyString = (field: string, message?: string) => {
    return body(field)
        .trim().notEmpty().withMessage('Should not be an a empty string').bail()
        .isString().withMessage('Should be a string').bail()
}
const validLikeValues = [LikeStatuses.LIKE, LikeStatuses.DISLIKE, LikeStatuses.NONE]
async function validateLikeInput(likeStatus:unknown) {
    ///Кастомная валидация для проверки значения лайков который приходит с фронта
    const isLikeStatusValid=typeof likeStatus==='string' && validLikeValues.includes(likeStatus as LikeStatuses)
    if (!isLikeStatusValid) {
        throw new Error(`Invalid like status`)
    }
}
const likeInputValidation=notEmptyString('likeStatus').custom(validateLikeInput).withMessage('Not a like status enum')
const emailRecoveryValidation=notEmptyString('email').matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Invalid Email format').bail()
const recoveryCodeValidation=notEmptyString('recoveryCode')
const newPasswordValidation=stringWithLengthValidation('newPassword', {min:6,max:20})

export const isEmailValidation=()=>[emailRecoveryValidation,inputCheckErrorsMiddleware]
export const passwordRecoveryValidation=()=>[recoveryCodeValidation, newPasswordValidation, inputCheckErrorsMiddleware]
//Запускаем цепочку проверки для значений который приходит с фронта. Первый это валидатор, второй функция для валидации
export const isLikeValidation=()=>[likeInputValidation, inputCheckErrorsMiddleware]