import { Router, Request, Response, response } from "express";
import { validate, paginatedSchema, createProjectManager, isProjectManagerId } from '@shared/validation';
import { BAD_REQUEST, OK, CREATED } from 'http-status-codes';
import ProjectManager, { IProjectManager } from '@entities/ProjectManager';
import ProjectManagerDao from '@daos/ProjectManager/ProjectManagerDao';
import { IUserRequest, isUser, isValidUser } from '../shared/request';
import { roles } from '@shared/constants';
import UserDao from '@daos/User/UserDao';

const router = Router();
const projectManagerDao = new ProjectManagerDao();
const userDao = new UserDao()
/**
 * Get all Project Manager GET /api/projectManagers/all
 */
router.get('/all', isValidUser('Admin'), validate(paginatedSchema, 'query'), async (req: Request, res: Response) => {
    try {
        const { page, limit, search, sortBy } = req.query;
        const result = await projectManagerDao.getAll({ page, limit, search, sortBy });
        return res.status(OK).json(result);
    } catch (error) {
        console.log(error);
        return res.status(BAD_REQUEST).json({ error })
    }
});

/**
 * 
 */
router.post('/add', isValidUser('Admin'), validate(createProjectManager, 'body'), async (req: IUserRequest, res: Response) => {
    try {
        const { user, doj, status } = req.body;
        const { _id } = await userDao.add(user);
        const createdBy = req.user ? req.user._id : null;
        await projectManagerDao.add({ userId: _id, doj, status, createdBy } as IProjectManager);
        return res.status(CREATED).end();
    } catch (error) {
        return res.status(BAD_REQUEST).json({ error });
    }
})

router.get('/:projectManagerId', isValidUser('Admin'), async ({ params: { projectManagerId } }, res: Response) => {
    try {
        const projectManager = await projectManagerDao.getOne(projectManagerId);
        return res.status(OK).json(projectManager);
    } catch (error) {
        return res.status(BAD_REQUEST).json({ error });
    }
})

router.put('/:projectManagerId', isValidUser('Admin'), validate(createProjectManager, 'body'), async ({ params: { projectManagerId }, body }, res: Response) => {
    try {
        const { user, doj, status } = body;
        await userDao.update(user._id, user);
        const pm = { doj, status } as IProjectManager;
        projectManagerDao.update(projectManagerId, pm);
        return res.status(OK).end();
    } catch (error) {
        return res.status(BAD_REQUEST).json({ error });
    }
})

router.delete('/', isValidUser('Admin'), async ({ query, user }: IUserRequest, res) => {
    try {
        return res.status(OK).json({ query, user });
    } catch (error) {
        return res.status(BAD_REQUEST).json({ error });
    }
})

export default router;