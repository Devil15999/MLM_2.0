import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://devbiz2025_db_user:1QCT5kCpAAJ9QVTk@cluster0.fjgzzqo.mongodb.net/pentest_db?retryWrites=true&w=majority&appName=Cluster0';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Atlas Error] Connection failed: ${error.message}`);
  }
};
