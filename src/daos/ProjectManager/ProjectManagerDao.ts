import ProjectManager, { IProjectManager } from '@entities/ProjectManager';
import UserDao from '@daos/User/UserDao';
import { IUser } from '@entities/User';

export interface IProjectManagerDao{
    getOne: (_id: IProjectManager['_id']) => Promise<IProjectManager | null>;
    getAll: (query: any) => Promise<{projectManagers:IProjectManager[], count:number}>;
    add: (projectManager: IProjectManager) => Promise<void>;
    update: (projectManager: IProjectManager) => Promise<void>;
}

class ProjectManagerDao implements IProjectManagerDao{

    /**
     * 
     * @param _id 
     */
    public async getOne(_id: IProjectManager['_id']): Promise<IProjectManager | null>{
        const result = await ProjectManager.findById(_id);
        return result as any;
    };

    /**
     * 
     * @param query = {page:number, limit:number, sortBy:number, search:string}
     */
    public async getAll(query: any) : Promise<{ projectManagers: IProjectManager[]; count: number; }>{
        query = Object.assign({page:1, limit:10, sortBy:'asc', sortKey:'createdAt', search:'', status:[1, 2, 3, 4]}, query);
        const match = !!query.search ? {
            match:{
                firstName: {
                    $regex: query.search,
                    $options: 'ixs'
                },
                lastName: {
                    $regex: query.search,
                    $options: 'ixs'
                }
            }
        } : {};
        const sortBy = query.sortBy === 'asc' ? '+' : '-';
        const rows = await ProjectManager.find({
            status: query.status
        }).populate({
            path:'userId',
            ...match
        }).skip(+query.page-1).limit(+query.limit).sort(`${sortBy}${query.sortBy}`);
        const count = await ProjectManager.find({
            status: query.status
        }).populate({
            path: 'userId',
            ...match
        }).countDocuments();
        return {rows, count} as any
    }

    /**
     * 
     * @param projectManager 
     */
    public async add(projectManager: IProjectManager) : Promise<void> {
        await new ProjectManager(projectManager).save();
        return null as any;
    };

    /** */
    public async update(projectManager: IProjectManager) : Promise<void>{

    };
    
}
export default ProjectManagerDao;