import {Request, Response} from "express";
import {ILoginInputModel} from "../db/auth-db-type";
import {userMongoRepository} from "../users/userMongoRepository";
import {bcryptService} from "../common/adapters/bcrypt.service";

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
            res.sendStatus(204)
        }
    }
}