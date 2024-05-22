import {Router} from "express";
import {body} from "express-validator";
import {jwtMiddleware} from "../middleware/jwtMiddleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {checkCommentExistence, checkCommentOwnership} from "../middleware/commentCheckMiddleware";
import {commentController} from "../main/composition-root";
export const commentsRouter = Router();

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
commentsRouter.get('/:id', commentController.getCommentById.bind(commentController))