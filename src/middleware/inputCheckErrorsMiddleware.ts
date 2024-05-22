import {Request, Response, NextFunction} from "express";
import {ValidationError, validationResult} from "express-validator";

export const inputCheckErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    // Проверяем наличие ошибок валидации
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error: ValidationError) => {
            return {
                message: error.msg, // Получаем сообщение об ошибке из объекта error
                field: error.param
            };
        });
        return res.status(400).json({errorsMessages: errorMessages});
    }
    return next();
};