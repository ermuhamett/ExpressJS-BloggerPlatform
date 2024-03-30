import {Router} from "express";
import {authMiddleware} from "../middleware/authMiddleware";
import {body} from "express-validator";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {blogService} from "./blog-service";
import {SortDirection} from "mongodb";
import {postInputValidator, postInputValidatorNoBlogId} from "../posts/posts.router";
import {getPostsByBlogController} from "./controllers/getPostsByBlogController";
import {getBlogsController} from "./controllers/getBlogsController";
import {getBlogController} from "./controllers/getBlogController";

export const blogsRouter = Router()
export const fieldsForBlogs = {
    name: 'name',
    description: 'description',
    websiteUrl: 'websiteUrl'
}

const blogNameValidator = body(fieldsForBlogs.name)
    .trim().notEmpty().withMessage('Name cannot be empty').bail()
    .isString().withMessage('Name must be a string').bail()
    .isLength({min: 1, max: 15}).withMessage('Name must be at most 15 characters long').bail();

const blogDescriptionValidator = body(fieldsForBlogs.description)
    .isString().withMessage('Description must be a string').bail()
    .isLength({max: 500}).withMessage('Description must be at most 500 characters long').bail();

const blogWebsiteUrlValidator = body(fieldsForBlogs.websiteUrl)
    .isString().withMessage('Website URL must be a string').bail()
    .isLength({max: 100}).withMessage('Website URL must be at most 100 characters long').bail()
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('Invalid Website URL format').bail();

export const blogInputValidator = [
    blogWebsiteUrlValidator,
    blogNameValidator,
    blogDescriptionValidator,
];


export const ADMIN_AUTH = 'admin:qwerty'

blogsRouter.post("/", authMiddleware, blogInputValidator, inputCheckErrorsMiddleware, blogService.createBlog)
blogsRouter.get("/:blogId/posts", getPostsByBlogController)
blogsRouter.get("/:id", getBlogController)
blogsRouter.get("/", getBlogsController)
blogsRouter.post("/:blogId/posts", authMiddleware, postInputValidatorNoBlogId, inputCheckErrorsMiddleware, blogService.createPost)
blogsRouter.put("/:id", authMiddleware, blogInputValidator, inputCheckErrorsMiddleware, blogService.updateBlogById)
blogsRouter.delete("/:id", authMiddleware, blogService.deleteBlogById)