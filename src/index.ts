import './LoadEnv'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import mongoose from 'mongoose';
import UserDao from '@daos/User/UserDao';
import { IUser } from '@entities/User';

// Start the server
const port = Number(process.env.PORT || 3000);
const connectMongoose = () => {
    const uri = `${process.env.MONGO_URL}`;
    mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
    mongoose.connection.on('open', async () => {
        logger.info('Connected to Mongo.', process.env.MONGO_URL);
        const userDao = new UserDao();
        const isExist = await userDao.getOne('bhupathy@askpundit.com');
        const dob = new Date('1992-03-26');        
        if (!isExist) {
            const user: IUser = {
                email: 'bhupathy@askpundit.com',
                password: 'test@254',
                firstName: 'KICK',
                lastName: 'Bhupathi',
                contactNumber: '8008379444',
                dob,
                gender: 'Male'
            } as any;
            await userDao.add(user);
        }
    });
    mongoose.connection.on('error', (err) => {
        logger.error(err);
    })
}
app.listen(port, () => {
    connectMongoose();
    logger.info('Express server started on port: ' + port);
});
