import {Request, Response} from "express";
import {IMeViewModel} from "../../types/auth-db-type";
export const currentUserController = async(req:Request, res:Response<IMeViewModel>) => {
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