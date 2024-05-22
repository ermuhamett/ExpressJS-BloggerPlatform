import {Request, Response, NextFunction} from "express";
import {CommentQueryRepository} from "../comments/commentQueryRepository";
import {container} from "../main/composition-root";

const commentQueryRepository=container.resolve<CommentQueryRepository>(CommentQueryRepository)
// Middleware для проверки существования комментария
export const checkCommentExistence = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    //const commentQueryRepository=new CommentQueryRepository()
    const comment = await commentQueryRepository.find(commentId);
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    // Передаем комментарий в объект запроса для дальнейшего использования в других middleware
    req.comment = comment;//Пойдее можно и не поставить его в request но пусть будет
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