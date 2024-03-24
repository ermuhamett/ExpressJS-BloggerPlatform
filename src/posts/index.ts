import {Router} from "express";
import {body, query} from "express-validator";
import {authMiddleware} from "../middleware/authMiddleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {blogMongoRepository} from "../blogs/blogMongoRepository";
import {ObjectId} from "mongodb";
import {postService} from "./post-service";


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

export const postInputValidator = [
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
];

export const postInputValidatorNoBlogId=[
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator
]

export const ADMIN_AUTH = 'admin:qwerty'

postsRouter.post("/", authMiddleware, postInputValidator, inputCheckErrorsMiddleware, postService.createPost)
postsRouter.get("/:id", postService.getPost)
postsRouter.get("/", postService.getPosts)
postsRouter.put("/:id", authMiddleware, postInputValidator, inputCheckErrorsMiddleware, postService.updatePost)
postsRouter.delete("/:id", authMiddleware, postService.deletePost)