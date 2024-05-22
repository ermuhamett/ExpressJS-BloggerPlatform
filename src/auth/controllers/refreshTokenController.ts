import {Request, Response} from "express";
import {AuthService} from "../auth-service";

export const refreshTokenController = async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken;
    AuthService.updatePairTokens(oldRefreshToken)
        .then(({ accessToken, refreshToken }) => {
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
            return res.status(200).send({ accessToken });
        })
        .catch((error: Error) => {
            // Если произошла ошибка при обновлении токенов, отправляем статус 401
            return res.status(401).send({ error: error.message });
        });
}