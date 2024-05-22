import {NextFunction, Request, Response} from "express";
import {jwtService} from "../common/adapters/jwt.service";
import {userMongoQueryRepository} from "../users/userMongoQueryRepository";
import {ObjectId} from "mongodb";
import {JwtPayload} from "jsonwebtoken";
import {TokenMongoRepository} from "../auth/token/tokenMongoRepository";
export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const {refreshToken} = req.cookies
    //console.log(refreshToken)
    try {
        if (!refreshToken) {
            return res.status(401).send('refresh token has expired')
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
        // Если токен является старым и невалидным, удаляем его из базы данных
        /*const tokenData = await TokenMongoRepository.findTokenByUser(tokenPayload.userId);
        console.log(tokenData)
        if (tokenData && !tokenData.isValid) {
            //await TokenMongoRepository.invalidateToken(tokenData.userId);
            return res.status(401).send('Expired or invalid refresh token');
        }*/
        // Продолжаем выполнение запроса
        return next();
    } catch (error) {
        return res.status(401).send(error);
    }
}