import mongoose, { Schema, Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string,
    dob: Date,
    role: string,
    gender: string,
    password: String,
    settings: {
        lastLoggedIn: Date,
        passwordUpdatedAt: Date,
        numberOfAttempts: number,
        loggedInTokens: Array<String>
    },
    setPassword(password: String): void,
    validatePassword(password: String): boolean,
    generateJwt(): string,
    validateJwt(token: string): string
}


export const UserSchema: Schema = new Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: 'Email is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid Email address']
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    contactNumber: {
        type: String
    },
    role:{
        type: String,
        enum: ['Admin', 'Resourse', 'Client', 'Project Manager', 'Delivary Team'] /** 1:Admin, 5: Resourse, 2: Client, 3: Project Manager, 4: Delivary Team */,
        default: 'Project Manager'
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        default: 'Male'
    },
    password: {
        type: String
    },
    settings: {
        lastLoggedIn: {
            type: Date
        },
        passwordUpdatedAt: {
            type: Date
        },
        numberOfAttempts: {
            type: Number
        },
        loggedInTokens: [{
            type: String
        }]
    }
}, { timestamps: true });
UserSchema.pre('save', function(next){
    const password = this.get('password');
    if(!!password){
        this.updateOne({ password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)) }).exec();
    }
    next()
})
UserSchema.pre('update', function (next) {
    const password = this.getUpdate().$set.password;
    if(!!password){
        try {
            this.getUpdate().$set.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
            next()
        } catch (error) {
            return next(error);
        }
    } else {
        next()
    }
});
UserSchema.methods.validatePassword = function (password: string): boolean {
    return bcrypt.compareSync(password, this.password);
}
UserSchema.methods.generateJwt = function (): string {
    const {_id, role} = this;
    return jwt.sign({_id, role}, `${process.env.API_KEY}`)
}

/*
UserSchema.methods.genHash = (password:string) => bcrypt.hashSync(password, bcrypt.genSaltSync(8));
UserSchema.methods.validate = function(password:string) {
    const user = this;
    return  bcrypt.compareSync(password, user.password);
}*/
export default mongoose.model<IUser>('User', UserSchema);;
