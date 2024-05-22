import {IUserInputModel} from "../../src/types/user-db-type";
import {IUserAccountDbModel} from "../../src/types/auth-db-type";
import {add} from "date-fns/add";
import {UsersMongooseModel} from "../../src/db/mongoose/models";

export const createUserData=():IUserInputModel=>{
    return{
      login:'lsgds-13',
      email:'mytestemail@gmail.com',
      password:'123456'
    }
}
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
            confirmationCodeExpirationDate: expirationDate,
            isConfirmed: isConfirmed ?? false,
        },
    }
}

export const createTestUserWithMongoose=(options: { code?: string, isConfirmed?: boolean }): IUserAccountDbModel => {
    const { code, isConfirmed } = options;
    const confirmationCode = '85df285f-d68b-4edf-9f75-6af82dfd643e';
    const expirationDate = add(new Date(), { hours: 1, minutes: 30 });

    // Создаем экземпляр модели Mongoose
    const user = new UsersMongooseModel({
        login: 'lsgds-13',
        email: 'mytestemail@gmail.com',
        passwordHash: '$2b$10$/jq9rwqCc7gR2tme/3M6aOQ',
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            confirmationCode: code ?? confirmationCode,
            confirmationCodeExpirationDate: expirationDate,
            isConfirmed: isConfirmed ?? false,
        },
    });

    // Добавляем метод save к экземпляру модели
    user.save = jest.fn().mockResolvedValue(user);

    return user;
};