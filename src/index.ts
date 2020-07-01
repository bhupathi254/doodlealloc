import './LoadEnv'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import mongoose from 'mongoose';

// Start the server
const port = Number(process.env.PORT || 3000);
const connectMongoose = () => {
    const uri = `${process.env.MONGO_URL}`;
    mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
    mongoose.connection.on('open', () => {
        logger.info('Connected to Mongo.');
    });
    mongoose.connection.on('error', (err) => {
        logger.error(err);
    })
}
app.listen(port, () => {
    connectMongoose();
    logger.info('Express server started on port: ' + port);
});
