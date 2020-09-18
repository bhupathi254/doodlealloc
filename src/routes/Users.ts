import { Request, Response, Router } from 'express';

import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import UserDao from '@daos/User/UserDao';
import { paramMissingError } from '@shared/constants';

import { loginSchema, createUser, paginatedSchema, validate } from '@shared/validation';
import { isUser } from '@shared/request';
import { decipher } from '@shared/functions';
// Init shared
const router = Router();
const userDao = new UserDao();


/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', validate(paginatedSchema, 'query'), async (req: Request, res: Response) => {
    const result = await userDao.getAll(req.query);
    return res.status(OK).json(result);
});


/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', validate(createUser, 'body'), async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        await userDao.add(user);
        return res.status(CREATED).end();
    } catch (error) {
        console.log(error)
        return res.status(BAD_REQUEST).json({ error })
    }
});


/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update/:id', async (req: Request, res: Response) => {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    user.id = Number(user.id);
    //await userDao.update(user);
    return res.status(OK).end();
});


/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    await userDao.delete(Number(id));
    return res.status(OK).end();
});

/******************************************************************************
 *                    Get User - "GET /api/users/get/:id"
 ******************************************************************************/

router.get('/get/:id', isUser, async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    const user = await userDao.getById(id);
    if (!!user) {
        return res.status(OK).json(user);
    }
    return res.status(BAD_REQUEST).json({ message: 'User not found' });
})

/******************************************************************************
*                    Get User - "GET /api/users/profile"
******************************************************************************/

router.get('/profile', isUser, async (req: Request, res: Response) => {
    /*if(req.user && '_id' in req.user){
        const user = await userDao.getById(req.user._id);
        if (!!user) {
            return res.status(OK).json(user);
        }
    }*/
    return res.status(BAD_REQUEST).json({ message: 'User not found' });
})

/******************************************************************************
 *                    Login - "POST /api/users/login"
 ******************************************************************************/

router.post('/login', validate(loginSchema, 'body'), async (req: Request, res: Response) => {
    try {
        const { login } = req.body;
        let {password} = login;
        password = decipher(password);
        const user = await userDao.login({...login, password});
        if (user) {
            return res.status(OK).json(user);
        }
        return res.status(BAD_REQUEST).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.log(error, 'ette')
        return res.status(BAD_REQUEST).json({ error })
    }
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
