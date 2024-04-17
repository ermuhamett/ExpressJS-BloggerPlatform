import {IUserDbMongo} from "./user-db-type";
import {WithId} from "mongodb";

export interface ILoginInputModel{
    loginOrEmail:string,
    password:string
}

export interface ILoginSuccessModel {
    accessToken:string
}

export interface IMeViewModel {
    email:string
    login:string
    userId:string
}

export interface IEmailConfirmationModel {
    isConfirmed: boolean;
    confirmationCode: string;
    expirationDate: Date;
}

export interface IUserAccountDbModel extends IUserDbMongo{
    emailConfirmation:IEmailConfirmationModel
}