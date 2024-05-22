import mongoose, {HydratedDocument, Schema} from "mongoose";
import {ICommentatorInfo, ICommentDbMongo} from "../../types/comment-db-type";
import {IUserDbMongo} from "../../types/user-db-type";
import {BlogDbTypeMongo} from "../../types/blog-db-type";
import {PostDbTypeMongo} from "../../types/post-db-type";
import {IEmailConfirmationModel, IRateLimitModel, ISessionInfo, IUserAccountDbModel} from "../../types/auth-db-type";

//Создаем HydratedDocument чтобы получить id
export type BlogDocument = HydratedDocument<BlogDbTypeMongo>
export type PostDocument = HydratedDocument<PostDbTypeMongo>
export type CommentDocument = HydratedDocument<ICommentDbMongo>
export type UserDocument = HydratedDocument<IUserAccountDbModel>
export type LimitDocument = HydratedDocument<IRateLimitModel>
export type SessionDocument = HydratedDocument<ISessionInfo>
///
const CommentatorSchema = new mongoose.Schema<ICommentatorInfo>({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
})
const EmailConfirmationSchema = new mongoose.Schema<IEmailConfirmationModel>({
    isConfirmed: {type: Boolean, required: true},
    confirmationCode: {type: String, required: true},
    confirmationCodeExpirationDate: {type: Date, required: true},
    passwordRecoveryCode: {type: String, required: false},
    passwordRecoveryCodeExpirationDate:  {type: Date, required: false},
    isPasswordRecoveryConfirmed: {type: Boolean, required: false}
}, {_id: false})
export const BlogsSchema = new mongoose.Schema<BlogDbTypeMongo>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String},
    isMembership: {type: Boolean},
})
export const PostsSchema = new mongoose.Schema<PostDbTypeMongo>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogName: {type: String, required: true},
    blogId: {type: String, required: true},
    createdAt: {type: String},
})
export const CommentsSchema = new mongoose.Schema<ICommentDbMongo>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: CommentatorSchema, // Define commentator info schema if needed
    createdAt: {type: String},
})
export const UsersSchema = new mongoose.Schema<IUserAccountDbModel>({
    login: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    createdAt: {type: String},
    emailConfirmation: EmailConfirmationSchema
})
export const RateLimitSchema = new mongoose.Schema<IRateLimitModel>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true},
})

export const AuthSessionSchema = new mongoose.Schema<ISessionInfo>({
    ip: {type: String, required: true},
    deviceId: {type: String, required: true},
    deviceName: {type: String, required: true},
    userId: {type: String, required: true},
    createdAt: {type: Number},
    expirationDate: {type: Number},
})