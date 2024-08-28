import {Router} from "express";
import {body} from "express-validator";
import {authMiddleware} from "../middleware/authMiddleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {ObjectId} from "mongodb";
import {authLikeFlow, jwtMiddleware} from "../middleware/jwtMiddleware";
import {commentInputValidator} from "../comments/comments.router";
import {container} from "../main/composition-root";
import {PostController} from "./postController";
import {BlogQueryRepository} from "../blogs/blogQueryRepository";
import {isLikeValidation} from "../common/validations";
import {checkPostExistence} from "../middleware/postCheckMiddleware";

export const postsRouter = Router()

const postController = container.resolve<PostController>(PostController)
const blogQueryRepository = container.resolve<BlogQueryRepository>(BlogQueryRepository)

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
    .custom(async (blogId, {req}) => {
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
export const postInputValidatorNoBlogId = [
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator
]

postsRouter.post("/", authMiddleware, postInputValidator, inputCheckErrorsMiddleware, postController.createPost.bind(postController))
postsRouter.put("/:postId/like-status", jwtMiddleware, checkPostExistence, isLikeValidation(), postController.updatePostLikeStatus.bind(postController))
postsRouter.get("/:id", authLikeFlow, postController.getPostById.bind(postController))
postsRouter.post("/:postId/comments", jwtMiddleware, commentInputValidator, inputCheckErrorsMiddleware, postController.createCommentByPost.bind(postController))
postsRouter.get("/:postId/comments", authLikeFlow, postController.getCommentsByPost.bind(postController))
postsRouter.get("/", authLikeFlow,postController.getPostsController.bind(postController))
postsRouter.put("/:id", authMiddleware, postInputValidator, inputCheckErrorsMiddleware, postController.updatePost.bind(postController))
postsRouter.delete("/:id", authMiddleware, postController.deletePost.bind(postController))