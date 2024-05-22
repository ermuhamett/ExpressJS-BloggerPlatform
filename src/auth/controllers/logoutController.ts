import {Request, Response} from "express";
import {AuthService} from "../auth-service";
export const logoutController = async (req: Request, res: Response) => {
    const refreshTokenFromCookie  = req.cookies.refreshToken;
    if (!refreshTokenFromCookie ) {
        return res.status(401).send('Refresh session is missing')
    }
    return AuthService.logoutUser(refreshTokenFromCookie)
        .then(() => {
            res.clearCookie('refreshToken');
            return res.sendStatus(204);
        })
        .catch((error: Error) => {
            return res.status(401).send({ error: error.message });
        });
}