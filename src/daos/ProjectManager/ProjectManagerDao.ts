import ProjectManager, { IProjectManager } from '@entities/ProjectManager';
import UserDao from '@daos/User/UserDao';
import { IUser } from '@entities/User';
import { Types } from 'mongoose';
export interface IProjectManagerDao {
    getOne: (_id: IProjectManager['_id']) => Promise<IProjectManager | null>;
    getAll: (query: any) => Promise<{ projectManagers: [any], count: number }>;
    add: (projectManager: IProjectManager) => Promise<void>;
    update: (_id: IProjectManager['_id'], projectManager: IProjectManager) => Promise<void>;
}

class ProjectManagerDao implements IProjectManagerDao {

    /**
     * 
     * @param _id 
     */
    public async getOne(_id: IProjectManager['_id']): Promise<IProjectManager | null> {
        console.log(_id)
        const pm = await ProjectManager.aggregate([{
            $match: {
                _id: Types.ObjectId(_id)
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $unwind: {
                path: '$user'
            }
        }, {
            $project: {
                _id: 1,
                doj: 1,
                status:1, 
                'user._id': 1,
                'user.email': 1,
                'user.contactNumber': 1,
                'user.firstName': 1,
                'user.lastName': 1,
                'user.gender': 1,
                'user.dob': 1
            }
        }]);
        if (pm.length) {
            return pm[0] as any
        }
        return null;
    };

    /**
     * 
     * @param query = {page:number, limit:number, sortBy:number, search:string}
     */
    public async getAll(query: any): Promise<{ projectManagers: [any]; count: number; }> {
        query = Object.assign({ page: 1, limit: 10, sortBy: 'asc', sortKey: 'createdAt', search: '', status: ['Active','Inactive'] }, query);
        const match = !!query.search ? [{
            $match: {
                $or: [{
                    'user.firstName': {
                        $regex: query.search,
                        $options: 'ixs'
                    }
                },
                {
                    'user.lastName': {
                        $regex: query.search,
                        $options: 'ixs'
                    }
                }, {
                    'user.email': {
                        $regex: query.search,
                        $options: 'ixs'
                    }
                }, {
                    'user.contactNumber': {
                        $regex: query.search,
                        $options: 'ixs'
                    }
                }]
            }
        }] : [];
        const sortBy = query.sortBy === 'asc' ? 1 : -1;
        const countArr = await ProjectManager.aggregate([{
            $match: {
                status: {
                    $in: query.status
                }
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $unwind: {
                path: '$user'
            }
        }, ...match, {
            $count: "count"
        }]);
        const rows = await ProjectManager.aggregate([{
            $match: {
                status: {
                    $in: query.status
                }
            }
        }, {
            $match: {
                status: { $in: query.status },
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $unwind: {
                path: '$user'
            }
        }, ...match, {
            $sort: { [query.sortKey]: sortBy }
        }, {
            $skip: +query.page - 1
        }, {
            $limit: +query.limit
        }]);
        return { rows, count: countArr.length ? countArr[0].count : 0 } as any
    }

    /**
     * 
     * @param projectManager 
     */
    public async add(projectManager: IProjectManager): Promise<void> {
        await new ProjectManager(projectManager).save();
        return null as any;
    };

    /** */
    public async update(_id: IProjectManager['_id'], projectManager: IProjectManager): Promise<void> {
        console.log(projectManager)
        await ProjectManager.findByIdAndUpdate({ _id }, projectManager);
        return null as any;
    };

}
export default ProjectManagerDao;