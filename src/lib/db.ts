import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI || MONGODB_URI === undefined) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let isConnected = false;

async function dbConnect() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error: any) {
    console.error("MongoDB connection failed:", error.message);
    throw new Error("Database connection failed");
  }
}

export default dbConnect;
