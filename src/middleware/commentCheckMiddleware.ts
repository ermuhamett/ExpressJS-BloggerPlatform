import {Request, Response, NextFunction} from "express";
import {commentQueryMongoRepository} from "../comments/commentQueryMongoRepository";
import {ObjectId} from "mongodb";

// Middleware для проверки существования комментария
export const checkCommentExistence = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const comment = await commentQueryMongoRepository.find(new ObjectId(commentId));
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    // Передаем комментарий в объект запроса для дальнейшего использования в других middleware
    req.comment = comment;
    next();
}

// Middleware для проверки принадлежности комментария текущему пользователю
export const checkCommentOwnership = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id; // Предположим, что информация о пользователе находится в req.user
    const comment = req.comment; // Получаем комментарий из объекта запроса
    if (!comment) {
        // Если комментарий не был найден в предыдущем middleware, возвращаем ошибку
        res.sendStatus(404);
        return;
    }
    if (comment.commentatorInfo.userId !== userId.toString()) {
        res.sendStatus(403);
        return;
    }
    next();
}