import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,
            { serverSelectionTimeoutMS: 5000 }).then(() => console.log("MongoDB Connected")).catch((err) => console.log(err));
    } catch (err) {
        console.log(err);
    }
}