import mongoose from "mongoose";

export const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      break;
    } catch (err) {
      console.error(`MongoDB connection failed (${retries + 1}):`, err.message);
      retries++;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (retries === maxRetries) {
    console.error("❌ MongoDB connection failed after retries. Exiting...");
    process.exit(1);
  }
};
