import {IUserInputModel} from "../../src/types/user-db-type";
import {IUserAccountDbModel} from "../../src/types/auth-db-type";
import {add} from "date-fns/add";

export const createUserData=():IUserInputModel=>{
    return{
      login:'lsgds-13',
      email:'mytestemail@gmail.com',
      password:'123456'
    }
}
///$2b$10$/jq9rwqCc7gR2tme/3M6aOQ
export const createTestUserFromDb=(options:{code?:string, isConfirmed?:boolean}):IUserAccountDbModel=>{
    const{code, isConfirmed}=options
    const confirmationCode = '85df285f-d68b-4edf-9f75-6af82dfd643e';
    const expirationDate = add(new Date(), { hours: 1, minutes: 30 });
    return {
        login: 'lsgds-13',
        email: 'mytestemail@gmail.com',
        passwordHash: '$2b$10$/jq9rwqCc7gR2tme/3M6aOQ',
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            confirmationCode: code ?? confirmationCode,
            expirationDate: expirationDate,
            isConfirmed: isConfirmed ?? false,
        },
    }
}