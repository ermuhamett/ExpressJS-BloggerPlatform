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