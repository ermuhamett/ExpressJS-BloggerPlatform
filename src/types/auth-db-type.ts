import {IUserDbMongo} from "./user-db-type";
import {WithId} from "mongodb";

export interface ILoginInputModel{
    loginOrEmail:string,
    password:string
}
export interface IRateLimitModel {
    ip:string,
    url:string,
    date:Date
}
export interface ISessionInfo{
    userId:string,
    deviceId:string,
    deviceName:string,
    ip:string,
    createdAt:number,
    expirationDate:number
}
export interface IMeViewModel {
    email:string
    login:string
    userId:string
}

export interface IEmailConfirmationModel {
    isConfirmed: boolean;
    confirmationCode: string;
    confirmationCodeExpirationDate:Date,
    passwordRecoveryCode?:string,
    passwordRecoveryCodeExpirationDate?:Date,
    isPasswordRecoveryConfirmed?:boolean
}

export interface IUserAccountDbModel extends  IUserDbMongo{
    emailConfirmation:IEmailConfirmationModel
}
export interface INewPasswordRecoveryInputModel {
    newPassword:string;
    recoveryCode:string;
}

export interface IPasswordRecoveryInputModel {
    email:string
}