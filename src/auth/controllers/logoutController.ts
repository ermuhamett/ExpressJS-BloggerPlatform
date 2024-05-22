import {Request, Response} from "express";
import {TokenMongoRepository} from "../token/tokenMongoRepository";
import {jwtService} from "../../common/adapters/jwt.service";
import {JwtPayload} from "jsonwebtoken";

export const logoutController = async (req: Request, res: Response) => {
    const refreshTokenFromCookie  = req.cookies.refreshToken;
    if (!refreshTokenFromCookie ) {
        return res.status(401).send('Refresh token is missing')
    }
    try {
        const refreshTokenPayload = await jwtService.decodeToken(refreshTokenFromCookie ) as JwtPayload
        // Проверяем наличие refreshToken в базе данных
        const tokenData = await TokenMongoRepository.findTokenByUser(refreshTokenPayload.userId);
        if (!tokenData) {
            return res.status(401).send('Refresh token not found');
        }
        // Преобразуем временные метки в числовой формат для сравнения
        const refreshTokenCreatedAt = refreshTokenPayload.iat ? parseInt(String(refreshTokenPayload.iat)) : undefined;
        const tokenCreatedAt = parseInt(tokenData.createdAt);
        // Проверяем, совпадают ли времена создания refreshToken из cookies и из базы данных
        if(refreshTokenCreatedAt!==tokenCreatedAt){
            // Времена создания не совпадают
            return res.status(401).send('Invalid refresh token');
        }
        await TokenMongoRepository.deleteOldToken(refreshTokenPayload.userId);
        res.clearCookie('refreshToken');// Удаление куки с refreshToken
        return res.sendStatus(204); // Успешный выход без содержимого
    } catch (error) {
        return res.status(401).send(error);
    }
}