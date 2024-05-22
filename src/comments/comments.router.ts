import {Router} from "express";
import {body} from "express-validator";
import {authLikeFlow, jwtMiddleware} from "../middleware/jwtMiddleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {checkCommentExistence, checkCommentOwnership} from "../middleware/commentCheckMiddleware";
import {container} from "../main/composition-root";
import {isLikeValidation} from "../common/validations";
import {CommentController} from "./commentController";

export const commentsRouter = Router();
const commentController=container.resolve<CommentController>(CommentController)

export const fieldsForComments = {
    content: 'content'
}
const commentContentValidator = body(fieldsForComments.content)
    .trim().notEmpty().withMessage('Content cannot be empty').bail()
    .isString().withMessage('Content must be a string').bail()
    .isLength({min: 20, max: 300}).withMessage('The length of the content should be from 15 to 300 characters').bail();

export const commentInputValidator = [commentContentValidator]

commentsRouter.put('/:commentId', jwtMiddleware, commentInputValidator, inputCheckErrorsMiddleware,checkCommentExistence,checkCommentOwnership, commentController.updateCommentById.bind(commentController))
commentsRouter.delete('/:commentId', jwtMiddleware, checkCommentExistence,checkCommentOwnership, commentController.deleteCommentById.bind(commentController))
commentsRouter.put('/:commentId/like-status',jwtMiddleware,isLikeValidation(),checkCommentExistence, commentController.updateCommentLikeStatus.bind(commentController))
commentsRouter.get('/:id',authLikeFlow,commentController.getCommentById.bind(commentController))