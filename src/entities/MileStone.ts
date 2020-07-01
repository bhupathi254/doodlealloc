import mongoose, { Schema, Document } from 'mongoose';
import { IProject } from './Project';
type document = {
    name: string,
    src: string
}
export interface IMileStone extends Document {
    projectId: IProject['_id'];
    documents: Array<document>;
    estimatedHours: number;
    actualHours: number;
    hoursBurned: number;
    status: number
}

const MileStoneSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4] //1:Active 2:Inactive 3:deleted 4:Completed
    },
    estimatedHours:{
        type: Number
    },
    actualHours:{
        type: Number
    },
    hoursBurned:{
        type: Number
    },
    documents: [{
        name: {
            type: String
        },
        src:{
            type: String
        }
    }]
});
export default mongoose.model<IMileStone>('MileStone', MileStoneSchema);
