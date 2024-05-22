import {NextFunction, Request, Response} from "express";
import {jwtService} from "../common/adapters/jwt.service";
import {userMongoQueryRepository} from "../users/userMongoQueryRepository";
import {ObjectId} from "mongodb";
import {JwtPayload} from "jsonwebtoken";
export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const {refreshToken} = req.cookies
    try {
        if (!refreshToken) {
            return res.status(401).send('refresh session has expired')
        }
        const tokenPayload = await jwtService.verifyToken(refreshToken) as JwtPayload
        if (!tokenPayload) {
            return res.status(401).send('Not authorized in cookie')
        }
        // Проверяем, существует ли пользователь, связанный с refreshToken
        const user = await userMongoQueryRepository.find(new ObjectId(tokenPayload.userId));
        if (!user) {
            return res.status(401).send('Not authorized')
        }
        return next();
    } catch (error) {
        return res.status(401).send(error);
    }
}