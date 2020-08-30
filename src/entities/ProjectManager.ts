import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IProjectManager extends Document {
    userId: IUser['_id'],
    doj: Date,
    status: number,
    createdBy: IUser['_id']
}

const ProjectManagerSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    doj: {
        type: Date
    },
    status:{
        type: String,
        enum: ['Active', 'Inactive', 'Deleted'],
        default: 'Active'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
export default mongoose.model<IProjectManager>('ProjectManager', ProjectManagerSchema);
