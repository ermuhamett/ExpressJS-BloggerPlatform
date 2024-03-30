import {NextFunction, Request, Response} from "express";
export const fieldCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const expectedFields = ['name', 'description', 'websiteUrl'];
    // Проверяем наличие всех ожидаемых полей в теле запроса
    for (let field of expectedFields) {
        if (!req.body.hasOwnProperty(field)) {
            return res.status(400).json({ errorsMessages: [{ message: `${field} was not provided`, field: field }] });
        }
    }
    return next()
}