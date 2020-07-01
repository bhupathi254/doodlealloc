import User, { IUser } from '@entities/User';

export interface IUserDao {
    getOne: (email: string) => Promise<IUser | null>;
    getAll: (query: any) => Promise<{ users: IUser[], count: number }>;
    add: (user: IUser) => Promise<IUser>;
    update: (user: IUser) => Promise<void>;
    delete: (id: number) => Promise<void>;
    login: (user: IUser) => Promise<any>;
    getById: (id: IUser['_id']) => Promise<IUser>;
}

class UserDao implements IUserDao {

    /**
     * @param email
     */
    public async getOne(email: string): Promise<IUser | null> {
        // TODO
        const user = await User.findOne({ email });
        return user as any;
    }

    /**
     * 
     * @param query 
     */
    public async getById(id: IUser['_id']): Promise<IUser>{
        const user = await User.findById(id).select('-password');
        return user as any;
    }


    /**
     *
     */
    public async getAll(query: any): Promise<{ users: IUser[], count: number }> {
        // TODO
        const { page, limit, search, sortBy } = query;
        const users = await User.find({}).skip(page * limit).limit(limit).sort(`-${sortBy}`);
        const count = await User.countDocuments({});
        return {users, count} as any;
    }


    /**
     *
     * @param user
     */
    public async add(user: IUser): Promise<IUser> {
        // TODO
        const result = await new User(user).save();
        return result as IUser;
    }


    /**
     *
     * @param user
     */
    public async update(user: IUser): Promise<void> {
        // TODO
        return {} as any;
    }


    /**
     *
     * @param id
     */
    public async delete(id: number): Promise<void> {
        // TODO
        return {} as any;
    }

    /**
     * @param login object
     */
    public async login(user: IUser): Promise<any> {
        const { email, password } = user;
        const object = await this.getOne(email);
        if (!!object && object.validatePassword(password)) {
            const token = object.generateJwt();
            return { token, _id: object._id };
        }
        return false;
    }
}

export default UserDao;
