import {Request, Response} from "express";
import {ILoginInputModel} from "../../types/auth-db-type";
import {AuthService} from "../auth-service";
import {jwtService} from "../../common/adapters/jwt.service";
import {TokenMongoRepository} from "../token/tokenMongoRepository";
import {TokenService} from "../token/token-service";
import {JwtPayload} from "jsonwebtoken";

export const loginCheckController = async(req:Request<ILoginInputModel>, res:Response) => {
    const user=await AuthService.loginUser(req.body)
    if(!user){
        return res.sendStatus(401)
    }
    const jwtToken=await jwtService.createJwtToken(user._id.toString())//Простой токен
    const refreshToken=await jwtService.createRefreshToken(user._id.toString())//Refresh токен
    // Получаем информацию о времени создания refreshToken
    const refreshTokenPayload = await jwtService.decodeToken(refreshToken) as JwtPayload | undefined;
    const refreshTokenCreatedAt = refreshTokenPayload?.iat;
    if (refreshTokenCreatedAt !== undefined) {
        await TokenMongoRepository.deleteOldToken(user._id.toString())
        await TokenService.addTokenInfo(user._id, refreshTokenCreatedAt); // Добавление refreshToken в базу данных
    } else {
        console.error('Error obtaining refresh token creation time.');
        return res.status(500).send('Error obtaining refresh token creation time');
    }
    res.cookie('refreshToken',refreshToken,{httpOnly: true,secure: true})// Установка куки с refreshToken
    return res.status(200).send({accessToken:jwtToken})
    //res.status(200).send({accessToken:token})
}