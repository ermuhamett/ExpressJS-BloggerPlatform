import {ObjectId} from "mongodb";

export interface IUserInputModel{
    login:string,
    password:string,
    email:string,
}

export interface IUserOutputModel {
    id:string,
    login:string,
    email:string,
    createdAt:string
}

export interface IUserDbMongo {
    login:string,
    email:string,
    passwordHash:string,
    createdAt:string
}