import 'reflect-metadata';
import {NextFunction, Response} from "express";
import {Request} from "express"
import {jwtService} from "../common/adapters/jwt.service";
import {UserQueryRepository} from "../users/userQueryRepository";
//import {authService, userQueryRepository} from "../main/composition-root";
import {SETTINGS} from "../main/settings";
import {JwtPayload} from "jsonwebtoken";
import {container} from "../main/composition-root";

const userQueryRepository=container.resolve<UserQueryRepository>(UserQueryRepository)
//Вместо с контейнерами может потребоваться импорт reflect-metadata
export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const tokenData = await jwtService.verifyToken(token);
        if (tokenData && typeof tokenData !== 'string') {
            const userId = tokenData.userId;
            if (!userId) {
                return res.sendStatus(401);
            }
            const user = await userQueryRepository.findForOutput(userId);
            if (!user) {
                return res.sendStatus(401);
            }
            req.user = user;
            return next();
        }
    } catch (error) {
        console.error("Error verifying session:", error);
        return res.sendStatus(401);
    }
    return res.sendStatus(401);
}

export const authLikeFlow=async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const authHeader = req.header("authorization")?.split(" "); // Получаем значение поля в заголовке
        if (authHeader) {
            const authMethod = authHeader[0]; // получаем метод из заголовка
            const authInput = authHeader[1]; // получаем значение для авторизации из заголовка
            if (authMethod === SETTINGS.AUTH_METHODS.bearer) { // If authorisation method is BEARER
                const tokenData = await jwtService.verifyToken(authInput) as JwtPayload;
                if (tokenData) {
                    const user = await userQueryRepository.findForOutput(tokenData.userId);
                    if (user) {
                        req.userId = user.id;
                        req.user = user
                    }
                }
            }
        }
        next();
    }
    catch (error) {
        console.error('Error in getCommentTokenMiddelware:', error);
        // Если произошла ошибка, просто передаем управление следующему middleware
        return next();
    }
}
