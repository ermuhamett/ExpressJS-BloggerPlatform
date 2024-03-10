import {Router} from "express";
import {createPostController} from "./createPostController";
import {getPostController} from "./getPostController";
import {body} from "express-validator";
import {postRepository} from "./postRepository";
import {authMiddleware} from "../middleware/authMiddleware";
import {getPostsController} from "./getPostsController";
import {updatePostController} from "./updatePostController";
import {deletePostController} from "./deletePostController";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {blogRepository} from "../blogs/blogRepository";


export const postsRouter = Router()

export const fieldsForPosts = {
    title: 'title',
    shortDescription: 'shortDescription',
    content: 'content',
    blogId: 'blogId'
}

const postTitleValidator = body(fieldsForPosts.title)
    .trim().notEmpty().withMessage('Title cannot be empty').bail()
    .isString().withMessage('Title must be a string').bail()
    .isLength({max: 30}).withMessage('Title must be at most 30 characters long').bail();

const postShortDescriptionValidator = body(fieldsForPosts.shortDescription)
    .trim().notEmpty().withMessage('Title cannot be empty').bail()
    .isString().withMessage('Short Description must be a string').bail()
    .isLength({max: 100}).withMessage('Short Description must be at most 100 characters long').bail();

const postContentValidator = body(fieldsForPosts.content)
    .trim().notEmpty().withMessage('Content cannot be empty').bail()
    .isString().withMessage('Content must be a string').bail()
    .isLength({max: 1000}).withMessage('Content must be at most 1000 characters long').bail()

const postBlogIdValidator = body(fieldsForPosts.blogId)
    .isString().withMessage('BlogId must be a string').bail()
    .custom(async (blogId, { req }) => {
        const blog = await blogRepository.find(blogId);
        if (!blog) {
            throw new Error('Blog not found');
        }
        return true;
    });

const postInputValidator = [
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator
];

export const ADMIN_AUTH = 'admin:qwerty'

postsRouter.post("/", authMiddleware, postInputValidator, inputCheckErrorsMiddleware, createPostController)
postsRouter.get("/:id", getPostController)
postsRouter.get("/", getPostsController)
postsRouter.put("/:id", authMiddleware, postInputValidator, inputCheckErrorsMiddleware, updatePostController)
postsRouter.delete("/:id", authMiddleware, deletePostController)