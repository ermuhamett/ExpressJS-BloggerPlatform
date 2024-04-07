import {NextFunction, Response} from "express";
import {Request} from "express"
import {jwtService} from "../common/adapters/jwt.service";
import {userMongoRepository} from "../users/userMongoRepository";
export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }
    const token = req.headers.authorization.split(' ')[1];
    const tokenData = await jwtService.verifyToken(token);
    if (tokenData && typeof tokenData !== 'string'){
        const userId = tokenData.userId;
        if (userId) { // Добавляем проверку на null
            const user =  await userMongoRepository.findForOutput(userId);
            req.user = user
            return next();
        } else {
            return res.sendStatus(401); // Если userId равен null, возвращаем ошибку 401
        }
    }
    return res.send(401)
}
