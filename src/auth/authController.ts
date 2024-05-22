import {Request, Response} from "express";
import {AuthService} from "./auth-service";
import {IMeViewModel, INewPasswordRecoveryInputModel, IPasswordRecoveryInputModel} from "../types/auth-db-type";
import {ResultStatus} from "../types/result.type";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {
    constructor(@inject(AuthService) readonly authService: AuthService) {}
    async loginCheck(req: Request, res: Response) {
        const deviceName = req.headers['user-agent'] ?? 'Your device'
        const ip = req.ip ?? 'no_ip'
        const user = await this.authService.loginUser(req.body)
        if (!user) {
            return res.sendStatus(401)
        }
        const tokens = await this.authService.createPairTokens(user._id.toString(), deviceName, ip)
        if (!tokens) {
            return res.sendStatus(401)
        }
        res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})// Установка куки с refreshToken
        return res.status(200).send({accessToken: tokens.accessToken})
    }
    async refreshToken(req: Request, res: Response) {
        const oldRefreshToken = req.cookies.refreshToken;
        this.authService.updatePairTokens(oldRefreshToken)
            .then(({accessToken, refreshToken}) => {
                res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true});
                return res.status(200).send({accessToken});
            })
            .catch((error: Error) => {
                // Если произошла ошибка при обновлении токенов, отправляем статус 401
                return res.status(401).send({error: error.message});
            });
    }
    async logoutController(req: Request, res: Response) {
        const refreshTokenFromCookie = req.cookies.refreshToken;
        if (!refreshTokenFromCookie) {
            return res.status(401).send('Refresh session is missing')
        }
        return this.authService.logoutUser(refreshTokenFromCookie)
            .then(() => {
                res.clearCookie('refreshToken');
                return res.sendStatus(204);
            })
            .catch((error: Error) => {
                return res.status(401).send({error: error.message});
            });
    }
    async registerUser(req: Request, res: Response){
        const registerUser=await this.authService.registerUser(req.body)
        if(!registerUser) return res.sendStatus(400)
        return res.sendStatus(204)
    }
    async registrationConfirmation(req:Request, res:Response){
        const result=await this.authService.confirmEmail(req.body.code)
        if(result){
            res.sendStatus(204)
        } else{
            res.sendStatus(400)
        }
    }
    async emailResending(req:Request, res:Response){
        const registerUser=await this.authService.resendingEmail(req.body.email)
        if(registerUser){
            res.sendStatus(204)
        } else{
            res.sendStatus(400)
        }
    }
    async currentUser(req:Request, res:Response){
        // Проверяем, есть ли пользователь в объекте запроса
        const user = req.user!;
        // Предполагается, что у пользователя есть поля email, login и userId
        const currentUser: IMeViewModel = {
            email: user.email,
            login: user.login,
            userId: user.id.toString() // Предполагается, что у пользователя есть поле userId
        };
        return res.status(200).json(currentUser);
    }
    async sendPasswordRecoveryEmail(req:Request<{},{},IPasswordRecoveryInputModel>, res:Response){
        const result=await this.authService.sendPasswordRecoveryEmail(req.body.email)
        if(result.status===ResultStatus.Success){
            return res.sendStatus(204)
        } else{
            console.error(`Status:${result.status}, Message:${result.data?.errorsMessages}`)
            return res.sendStatus(204)
        }
    }
    async recoverUserPassword(req:Request<{},{},INewPasswordRecoveryInputModel>, res:Response){
        const recoveryResult=await this.authService.recoverUserPassword(req.body.newPassword, req.body.recoveryCode)
        if(recoveryResult.status===ResultStatus.BadRequest){
            return res.status(400).send(recoveryResult.data)
        } else{
            return res.sendStatus(204)
        }
    }
}