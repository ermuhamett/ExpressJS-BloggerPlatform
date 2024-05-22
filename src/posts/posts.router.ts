import {Router} from "express";
import {body, query} from "express-validator";
import {authMiddleware} from "../middleware/authMiddleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {ObjectId} from "mongodb";
import {jwtMiddleware} from "../middleware/jwtMiddleware";
import {commentInputValidator} from "../comments/comments.router";
import {blogQueryRepository, postController} from "../main/composition-root";

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


//TODO Можно юзануть в валидации в auth registration
const postBlogIdValidator = body(fieldsForPosts.blogId)
    .isString().withMessage('BlogId must be a string').bail()
    .custom(async (blogId, { req }) => {
        const blog = await blogQueryRepository.find(new ObjectId(blogId));
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
//Внедрено DI
postsRouter.post("/", authMiddleware, postInputValidator, inputCheckErrorsMiddleware, postController.createPost.bind(postController))
postsRouter.get("/:id", postController.getPostById.bind(postController))
postsRouter.post("/:postId/comments", jwtMiddleware, commentInputValidator, inputCheckErrorsMiddleware, postController.createCommentByPost.bind(postController))
postsRouter.get("/:postId/comments", postController.getCommentsByPost.bind(postController))
postsRouter.get("/", postController.getPostsController.bind(postController))
postsRouter.put("/:id", authMiddleware, postInputValidator, inputCheckErrorsMiddleware, postController.updatePost.bind(postController))
postsRouter.delete("/:id", authMiddleware, postController.deletePost.bind(postController))