import mongoose, { Schema, Document, Types } from 'mongoose';
import { IMileStone } from './MileStone';
import { IUser } from './User';

export interface ITask extends Document {
    mileStoneId: IMileStone['_id'];
    title: string;
    description: string;
    parentId: ITask['_id'];
    sequence: number;
    estimatedHours: number;
    hoursBurned: number;
    approvedHours: number;
    isApproved: boolean;
    assingedBy: IUser['_id'];
    assingedTo: IUser['_id'];
    status: number;
    allocatedAt: Date
};

const TaskSchema = new Schema({
    mileStoneId: {
        type: Types.ObjectId,
        ref: 'MileStone'
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    parentId:{
        type: Types.ObjectId,
        ref: 'Task'
    },
    sequence:{
        type: Number
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4] //1:Active 2:Inactive 3:deleted 4:Completed
    },
    estimatedHours: {
        type: Number
    },
    hoursBurned: {
        type: Number
    },
    approvedHours:{
        type: Number
    },
    isApproved:{
        type: Boolean
    },
    assingedBy:{
        type: Types.ObjectId,
        ref: 'User'
    },
    assingedTo:{
        type: Types.ObjectId,
        ref: 'User'
    },
    allocatedAt: {
        type: Date
    }
});
export default mongoose.model<ITask>('Task', TaskSchema);
