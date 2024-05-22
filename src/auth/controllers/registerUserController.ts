import {Request, Response} from "express";
import {AuthService} from "../auth-service";
export const registerUserController = async(req:Request, res:Response) => {
    const registerUser=await AuthService.registerUser(req.body)
    if(!registerUser) return res.sendStatus(400)
    return res.sendStatus(204)
}
/*export class CustomError {
    constructor(private message: string, private field: string) {
    }
    getErr(): OutputErrorsType{
        return  {
            errorsMessages: [{message: this.message, field: this.field }]
        }
    }
}*/