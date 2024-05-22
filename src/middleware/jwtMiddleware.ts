import {NextFunction, Response} from "express";
import {Request} from "express"
import {jwtService} from "../common/adapters/jwt.service";
import {userMongoQueryRepository} from "../users/userMongoQueryRepository";

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
            const user = await userMongoQueryRepository.findForOutput(userId);
            if (!user) {
                return res.sendStatus(401);
            }
            req.user = user;
            return next();
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.sendStatus(401);
    }
    return res.sendStatus(401);
}
