import {NextFunction, Request, Response} from "express";
import {IRateLimitModel} from "../types/auth-db-type";
import {RateLimitMongooseModel} from "../db/mongoose/models";
export const rateLimitMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    const currentTime=new Date();
    const rateLimitData:IRateLimitModel={
        ip:req.ip ?? 'no_ip',
        url: req.originalUrl,
        date: currentTime,
    }
    await RateLimitMongooseModel.create(rateLimitData)
    // Calculate the timestamp for the start of the last 10 seconds
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const urlSessions = await RateLimitMongooseModel.countDocuments({
        ip: rateLimitData.ip,
        url: rateLimitData.url,
        date: { $gte: tenSecondsAgo },
    })
    if (urlSessions > 5) {
        return res.sendStatus(429)// Больше 5 запросов от одного IP
    }
    return next()
}