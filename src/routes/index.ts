import { Router } from 'express';
import UserRouter from './Users';
import ProjectManagerRouter from './ProjectManager';
// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/project-managers', ProjectManagerRouter);

// Export the base-router
export default router;
