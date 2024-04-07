import {Router} from "express";
import {commentService} from "./comment-service";
import {body} from "express-validator";
import {jwtMiddleware} from "../middleware/jwtMiddleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {getCommentController} from "./controllers/getCommentController";
import {checkCommentExistence, checkCommentOwnership} from "../middleware/commentCheckMiddleware";


export const commentsRouter = Router();

export const fieldsForComments = {
    content: 'content'
}
const commentContentValidator = body(fieldsForComments.content)
    .trim().notEmpty().withMessage('Content cannot be empty').bail()
    .isString().withMessage('Content must be a string').bail()
    .isLength({min: 20, max: 300}).withMessage('The length of the content should be from 15 to 300 characters').bail();

export const commentInputValidator = [commentContentValidator]

commentsRouter.put('/:commentId', jwtMiddleware, commentInputValidator, inputCheckErrorsMiddleware,checkCommentExistence,checkCommentOwnership, commentService.updateCommentById)
commentsRouter.delete('/:commentId', jwtMiddleware, checkCommentExistence,checkCommentOwnership, commentService.deleteCommentById)
commentsRouter.get('/:id', getCommentController)