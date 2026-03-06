import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error({ err }, 'MongoDB connection error');
        process.exit(1);
    }
};
export default connectDB;

