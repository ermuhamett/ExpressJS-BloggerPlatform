import mongoose, {HydratedDocument} from "mongoose";
import {BlogDbTypeMongo} from "../../types/blog-db-type";
import {SETTINGS} from "../../main/settings";
import {AuthSessionSchema, BlogsSchema, CommentsSchema, PostsSchema, RateLimitSchema, UsersSchema} from "./schemas";
import {PostDbTypeMongo} from "../../types/post-db-type";
import {ICommentDbMongo} from "../../types/comment-db-type";
import {IRateLimitModel, ISessionInfo, IUserAccountDbModel} from "../../types/auth-db-type";
export const BlogsMongooseModel=mongoose.model<BlogDbTypeMongo>(SETTINGS.BLOG_COLLECTION_NAME, BlogsSchema)
export const PostsMongooseModel=mongoose.model<PostDbTypeMongo>(SETTINGS.POST_COLLECTION_NAME, PostsSchema)
export const CommentsMongooseModel=mongoose.model<ICommentDbMongo>(SETTINGS.COMMENT_COLLECTION_NAME, CommentsSchema)
export const UsersMongooseModel=mongoose.model<IUserAccountDbModel>(SETTINGS.USER_COLLECTION_NAME, UsersSchema)
export const RateLimitMongooseModel=mongoose.model<IRateLimitModel>(SETTINGS.LIMIT_COLLECTION_NAME,RateLimitSchema)
export const AuthSessionMongooseModel=mongoose.model<ISessionInfo>(SETTINGS.SESSION_COLLECTION_NAME, AuthSessionSchema)
