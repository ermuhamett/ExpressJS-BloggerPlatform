import {Router} from "express";
import {createPostController} from "./controllers/createPostController";
import {getPostController} from "./controllers/getPostController";
import {body} from "express-validator";
import {authMiddleware} from "../middleware/authMiddleware";
import {getPostsController} from "./controllers/getPostsController";
import {updatePostController} from "./controllers/updatePostController";
import {deletePostController} from "./controllers/deletePostController";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {blogMongoRepository} from "../blogs/blogMongoRepository";
import {ObjectId} from "mongodb";


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
        const blog = await blogMongoRepository.find(new ObjectId(blogId));
        if (!blog) {
            throw new Error('Blog not found');
        }
        return true;
    });

const postInputValidator = [
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
];

export const ADMIN_AUTH = 'admin:qwerty'

postsRouter.post("/", authMiddleware, postInputValidator, inputCheckErrorsMiddleware, createPostController)
postsRouter.get("/:id", getPostController)
postsRouter.get("/", getPostsController)
postsRouter.put("/:id", authMiddleware, postInputValidator, inputCheckErrorsMiddleware, updatePostController)
postsRouter.delete("/:id", authMiddleware, deletePostController)