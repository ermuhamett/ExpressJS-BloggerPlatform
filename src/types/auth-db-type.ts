import {IUserDbMongo} from "./user-db-type";
import {WithId} from "mongodb";

export interface ILoginInputModel{
    loginOrEmail:string,
    password:string
}
export interface IAccessTokenAndRefreshToken {
    accessToken:string,
    refreshToken:string
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
    expirationDate: Date;
}

export interface IUserAccountDbModel extends IUserDbMongo{
    emailConfirmation:IEmailConfirmationModel
}