import mongoose, { Schema, Document } from 'mongoose';
import { IProjectManager } from './ProjectManager';
import { IUser } from './User';
type document = {
    name: string,
    type: string
}
type projectManager = {
    manager: IProjectManager['_id'],
    status: number
}
export interface IProject extends Document {
    name: string;
    displayName: string;
    clientId: string;
    totalHours: number;
    projectManagers: Array<projectManager>;
    type: number;
    createdBy: IUser['_id']
    status: number;
    documents: Array<document>;
}

const ProjectSchema = new Schema({
    name: {
        type: String
    },
    displayName: {
        type: String
    },
    projectManagers: [{
        manager: {
            type: Schema.Types.ObjectId,
            ref: 'ProjectManager'
        }, 
        status: {
            type: Number,
            default: 1,
            enum: [1, 2, 3] //1:active in project 2:inactive in project 3: deleted from project
        }
    }],
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4] //1:Active 2:Inactive 3:deleted 4:Completed
    },
    documents: [{
        name: String,
        type: String
    }]
});
export default mongoose.model<IProject>('Project', ProjectSchema);
