import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'loginform_users';
const USERS_COLLECTION = 'users';

let db;
let mongoClient;

export async function connectDB() {
  mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();
  db = mongoClient.db(DB_NAME);
  const host = MONGODB_URI.replace(/\/\/.*@/, '//').split('/')[0].replace('mongodb://', '') || '127.0.0.1:27017';
  console.log('MongoDB connected:', host);
  console.log('Data is stored in:', DB_NAME + '.' + USERS_COLLECTION, '— In Compass: connect to', host, 'then open database', `"${DB_NAME}"`, 'and collection', `"${USERS_COLLECTION}"`);
  return db;
}

export function getDb() {
  return db;
}

export function getUsersCollection() {
  if (!db) throw new Error('Database not connected');
  return db.collection(USERS_COLLECTION);
}

export { DB_NAME, USERS_COLLECTION };
