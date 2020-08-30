import express, { Request, Response, NextFunction } from "express"
import { IUser } from "@entities/User";
import UserDao from '@daos/User/UserDao';
import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from 'http-status-codes';

export interface IUserRequest extends Request {
    user?: IUser
}

export const isValidUser = (...userTypes: (string)[]) => {
    return (req: IUserRequest, res: Response, next: NextFunction) => {
        const userDao = new UserDao();
        const token = `${req.headers['authorization']}`;
        const auth = token.includes('Bearer ') && token.split('Bearer ')[1];
        if (auth) {
            jwt.verify(auth, `${process.env.API_KEY}`, async function (err, payload: any) {
                if (!!payload && '_id' in payload) {
                    const user = await userDao.getById(payload._id);
                    const role = user.role;
                    console.log(role);
                    if (!!user && userTypes.includes(role)) {
                        req.user = user;
                        next();
                    } else {
                        return res.status(UNAUTHORIZED).json({ message: 'Unauthorized user' });
                    }
                } else {
                    return res.status(UNAUTHORIZED).json({ message: 'Unauthorized user' });
                }
            });
        } else {
            return res.status(UNAUTHORIZED).json({ message: 'Unauthorized user' });
        }
    }
}
export const isUser = (handler: (req: IUserRequest, res: express.Response, next?: express.NextFunction) => any) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const userDao = new UserDao();
            const token = `${req.headers['authorization']}`;
            const auth = token.includes('Bearer ') && token.split('Bearer ')[1];
            if (auth) {
                jwt.verify(auth, `${process.env.API_KEY}`, async function (err, payload: any) {
                    if (!!payload && '_id' in payload) {
                        const requestWrapper: IUserRequest = <IUserRequest>req;
                        const user = await userDao.getById(payload._id);
                        if (!!user) {
                            requestWrapper.user = user;
                            return handler(requestWrapper, res, next);
                        }
                    }
                });
            }
            console.log('test')
            return res.status(UNAUTHORIZED).json({ message: 'Unauthorized user' });
        } catch (error) {
            next(error);
        }
    }
}
/*
declare global{
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}*/