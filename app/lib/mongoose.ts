// lib/mongodb.ts
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

// Define types for cached connection
interface CachedMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend global with mongoose cache
declare global {
  var mongoose: CachedMongoose | undefined;
}

// Initialize cache
let cached: CachedMongoose = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 1,
      minPoolSize: 0,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log('MongoDB connected via Mongoose');
        return mongoose;
      })
      .catch((error) => {
        console.error('Mongoose connection error:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Get database instance (for compatibility with existing code)
export async function getDb() {
  const conn = await dbConnect();
  return conn.connection.db;
}

// For backward compatibility with clientPromise
export const clientPromise = dbConnect().then((mongoose) => mongoose.connection.getClient());

export default dbConnect;