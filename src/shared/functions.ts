import logger from './Logger';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '@entities/User';
import { UNAUTHORIZED } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import UserDao from '@daos/User/UserDao';

export const pErr = (err: Error) => {
    if (err) {
        logger.error(err);
    }
};


export const getRandomInt = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
/*
export const isUser = (req: Request, res: Response, next: NextFunction) => {
    //passport.authenticate('jwt', {session:false})
    const userDao = new UserDao();
    const token = `${req.headers['authorization']}`;
    const auth = token.includes('Bearer ') && token.split('Bearer ')[1];
    if (auth) {
        jwt.verify(auth, `${process.env.API_KEY}`, { algorithms: ['RS256'] }, async function(err, payload:any){
            if (!!payload && '_id' in payload) {
                const user = await userDao.getById(payload._id);
                req.user = user;
                next();
            } else{
                return res.status(UNAUTHORIZED).json({ message: 'Not authorized user' })
            }
        });
    }
}*/

export const validateJwt = function (token: string): any {
    /*const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: `${process.env.API_KEY}`,
        algorithms: ['RS256']
    };
    const getPayload = async (payload:IUser, done:any) => {
        const userDao = new UserDao();
        let user = await userDao.getById(payload._id);
        if(!!user){
            return done(null, user);
        }
        return done(new Error('User not found'), false);
    }
    passport.use(new Strategy(opts, getPayload));*/
    const auth = token.includes('Bearer ') && token.split('Bearer ')[1];
    if (auth) {
        const user = jwt.verify(auth, `${process.env.API_KEY}`, { algorithms: ['RS256'] })
        return user;
    }
    return '';
}