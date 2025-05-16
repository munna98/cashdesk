// /lib/mongodb.ts
import mongoose from "mongoose";

// const MONGODB_URI = "mongodb://localhost:27017/cashapp";
const MONGODB_URI = "mongodb+srv://vercel-admin-user:IdJXdtR0SsU9L0i9@rentalshop.sjwxy.mongodb.net/?retryWrites=true&w=majority&appName=rentalshop";

// const MONGODB_URI = "mongodb+srv://vercel-admin-user:IdJXdtR0SsU9L0i9@rentalshop.sjwxy.mongodb.net/casapp?retryWrites=true&w=majority&appName=rentalshop";


if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI");

// Extend the global type to include a mongoose cache
interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Only declare if not already defined
  var mongoose: MongooseGlobal;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
