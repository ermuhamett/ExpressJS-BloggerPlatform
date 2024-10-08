import 'reflect-metadata';
import {UserCommandRepository} from "../users/userCommandRepository";
import {UserQueryRepository} from "../users/userQueryRepository";
import {UserService} from "../users/user-service";
import {UserController} from "../users/userController";
import {AuthService} from "../auth/auth-service";
import {SessionCommandRepository} from "../auth/session/sessionCommandRepository";
import {AuthController} from "../auth/authController";
import {SecurityQueryRepository} from "../security/securityQueryRepository";
import {SecurityService} from "../security/securityService";
import {SecurityController} from "../security/securityController";
import {SecurityCommandRepository} from "../security/securityCommandRepository";
import {BlogCommandRepository} from "../blogs/blogCommandRepository";
import {BlogQueryRepository} from "../blogs/blogQueryRepository";
import {PostQueryRepository} from "../posts/postQueryRepository";
import {BlogService} from "../blogs/blog-service";
import {BlogController} from "../blogs/blogController";
import {PostCommandRepository} from "../posts/postCommandRepository";
import {CommentCommandRepository} from "../comments/commentCommandRepository";
import {CommentQueryRepository} from "../comments/commentQueryRepository";
import {PostService} from "../posts/post-service";
import {CommentService} from "../comments/comment-service";
import {PostController} from "../posts/postController";
import {CommentController} from "../comments/commentController";
import {Container} from "inversify";

export const container=new Container()
//USERS
container.bind(UserCommandRepository).to(UserCommandRepository)
container.bind(UserQueryRepository).to(UserQueryRepository)
container.bind(UserService).to(UserService)
container.bind(UserController).to(UserController)
//export const userCommandRepository=new UserCommandRepository()
//export const userQueryRepository=new UserQueryRepository()
//export const userService=new UserService(userCommandRepository)
//export const userController=new UserController(userService,userCommandRepository,userQueryRepository)
//SECURITY
container.bind(SecurityQueryRepository).to(SecurityQueryRepository)
container.bind(SecurityCommandRepository).to(SecurityCommandRepository)
container.bind(SecurityService).to(SecurityService)
container.bind(SecurityController).to(SecurityController)
//export const securityQueryRepository=new SecurityQueryRepository()
//export const securityCommandRepository=new SecurityCommandRepository()
//export const securityService = new SecurityService(securityCommandRepository,securityQueryRepository);
//export const securityController = new SecurityController(securityService,securityQueryRepository);
//AUTH
container.bind(SessionCommandRepository).to(SessionCommandRepository)
container.bind(AuthService).to(AuthService)
container.bind(AuthController).to(AuthController)
//export const sessionCommandRepository=new SessionCommandRepository()
//export const authService=new AuthService(userService,userCommandRepository,userQueryRepository,sessionCommandRepository)
//export const authController=new AuthController(authService)
///BLOGS
container.bind(BlogCommandRepository).to(BlogCommandRepository)
container.bind(BlogQueryRepository).to(BlogQueryRepository)
container.bind(PostCommandRepository).to(PostCommandRepository)
container.bind(PostQueryRepository).to(PostQueryRepository)
container.bind(BlogService).to(BlogService)
container.bind(PostService).to(PostService)
container.bind(BlogController).to(BlogController)
/*export const blogCommandRepository=new BlogCommandRepository()
export const blogQueryRepository=new BlogQueryRepository()
export const postCommandRepository=new PostCommandRepository()
export const postQueryRepository=new PostQueryRepository()
export const blogService=new BlogService(blogCommandRepository)
export const postService=new PostService(blogQueryRepository,postCommandRepository)
export const blogController=new BlogController(blogService,blogQueryRepository,postQueryRepository,postService)*/
///POSTS
container.bind(CommentCommandRepository).to(CommentCommandRepository)
container.bind(CommentQueryRepository).to(CommentQueryRepository)
container.bind(CommentService).to(CommentService)
container.bind(PostController).to(PostController)
/*export const commentCommandRepository=new CommentCommandRepository()
export const commentQueryRepository=new CommentQueryRepository()
export const commentService=new CommentService(commentCommandRepository,commentQueryRepository)
export const postController=new PostController(postService,commentService,postQueryRepository,commentQueryRepository)*/
///COMMENTS
container.bind(CommentController).to(CommentController)
//export const commentController=new CommentController(commentService,commentQueryRepository)

