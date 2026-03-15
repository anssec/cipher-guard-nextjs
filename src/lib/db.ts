import mongoose from "mongoose";

const MONGODB = process.env.MONGODB!;

if (!MONGODB) {
  throw new Error("Please define the MONGODB environment variable in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB).then((m) => {
      console.log("DB Connected Successfully");
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
