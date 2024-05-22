import {Router} from "express";
import {authMiddleware} from "../middleware/authMiddleware";
import {body} from "express-validator";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {postInputValidatorNoBlogId} from "../posts/posts.router";
import {blogController} from "../main/composition-root";

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
//Внедрено DI и добавлено Composition Root
blogsRouter.post("/", authMiddleware, blogInputValidator, inputCheckErrorsMiddleware, blogController.createBlog.bind(blogController))
blogsRouter.get("/:blogId/posts", blogController.getPostsByBlog.bind(blogController))
blogsRouter.get("/:id", blogController.getBlogById.bind(blogController))
blogsRouter.get("/", blogController.getBlogs.bind(blogController))
blogsRouter.post("/:blogId/posts", authMiddleware, postInputValidatorNoBlogId, inputCheckErrorsMiddleware, blogController.createPostByBlog.bind(blogController))
blogsRouter.put("/:id", authMiddleware, blogInputValidator, inputCheckErrorsMiddleware, blogController.updateBlog.bind(blogController))
blogsRouter.delete("/:id", authMiddleware, blogController.deleteBlog.bind(blogController))