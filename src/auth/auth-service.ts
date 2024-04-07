import {Request, Response} from "express";
import {ILoginInputModel, IMeViewModel} from "../types/auth-db-type";
import {userMongoRepository} from "../users/userMongoRepository";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {jwtService} from "../common/adapters/jwt.service";

export const authService={
    async loginCheck(req:Request<ILoginInputModel>, res:Response){
        const {loginOrEmail, password}=req.body
        const user=await userMongoRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            res.status(401).json({ message: "Username or email not found" });
            return;
        }
        const isCorrectPassword=await bcryptService.checkPassword(password,user.passwordHash)
        if(!isCorrectPassword){
            res.status(401).json({ message: "Incorrect Password" })
            return
        }
        else{
            const token=await jwtService.createToken(user._id.toString())
            res.status(200).send({accessToken:token})
        }
    },
    async currentUser(req:Request, res:Response<IMeViewModel>){
        // Проверяем, есть ли пользователь в объекте запроса
        const user = req.user!;
        // Проверяем, есть ли пользователь
        // if (!currentUser) {
        //     return res.sendStatus(401);
        // }
        // Предполагается, что у пользователя есть поля email, login и userId
        const currentUser: IMeViewModel = {
            email: user.email,
            login: user.login,
            userId: user.id.toString() // Предполагается, что у пользователя есть поле userId
        };
        return res.status(200).json(currentUser);
    }
}