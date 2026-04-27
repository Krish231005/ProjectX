import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "projectshut";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let mongoClientPromise: Promise<MongoClient> | undefined;

export async function getDatabase(): Promise<Db> {
  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment variables.");
  }

  mongoClientPromise =
    mongoClientPromise ??
    global._mongoClientPromise ??
    new MongoClient(uri).connect().then((client) => {
      return client;
    });

  if (process.env.NODE_ENV !== "production") {
    global._mongoClientPromise = mongoClientPromise;
  }

  const client = await mongoClientPromise;
  return client.db(dbName);
}
