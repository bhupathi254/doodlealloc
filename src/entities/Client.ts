import { IUser } from './User';

export interface IClient{
    _id:string;
    name:string;
    contacts:Array<IUser>
}