//import {IUserDbMongo} from "./user-db-type";
// declare global {
//     namespace Express {
//         export interface Request {
//             userId: IUserDbMongo | null
//         }
//     }
// }

///TODO Mime v3 установить
import {IUserDbMongo, IUserOutputModel} from "./user-db-type";
import {ICommentDbMongo, ICommentOutputModel} from "./comment-db-type";

export declare module 'express-serve-static-core' {
    interface Request {
        user: IUserOutputModel | null;
        comment?:ICommentDbMongo | null;
    }
}