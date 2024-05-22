import {Request, Response} from "express";
import {jwtService} from "../../common/adapters/jwt.service";
import {TokenMongoRepository} from "../token/tokenMongoRepository";
import {delay} from "../../utils/timer";
import {JwtPayload} from "jsonwebtoken";
import {TokenService} from "../token/token-service";
import {ObjectId} from "mongodb";

export const refreshTokenController = async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken;
    try {
        const tokenPayload = await jwtService.decodeToken(oldRefreshToken) as JwtPayload
        //console.log(tokenPayload.userId)
        const tokenData = await TokenMongoRepository.findTokenByUser(tokenPayload.userId);
        if (!tokenData) {
            return res.status(401).send('Refresh token not exist');
        }
        //TODO доработать logout с проверкой
        if(tokenData.createdAt!==tokenPayload.iat?.toString()){
            return res.status(401).send(`${JSON.stringify(tokenPayload)} ${JSON.stringify(tokenData)}`)
        }
        console.log(tokenPayload.userId);
        // Создаем два пар токенов:access и refresh токены
        const newAccessToken = await jwtService.createJwtToken(tokenPayload.userId);
        const newRefreshToken = await jwtService.createRefreshToken(tokenPayload.userId);
        const refreshTokenPayload = await jwtService.decodeToken(newRefreshToken) as { userId: ObjectId, iat: number };
        await TokenMongoRepository.deleteOldToken(tokenPayload.userId)
        await TokenService.addTokenInfo(refreshTokenPayload.userId, refreshTokenPayload.iat)/// Добавление refreshToken в базу данных
        //await TokenService.addTokenInfo(newTokenPayload.userId)
        //await TokenMongoRepository.updateToken(tokenPayload.userId)
        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true});
        return res.status(200).send({accessToken: newAccessToken});
    } catch (error) {
        // Если произошла ошибка при обновлении токенов, отправляем статус 502
        return res.sendStatus(502);
    }
}