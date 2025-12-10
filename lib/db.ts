import mongoose from 'mongoose';

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
  dbName: string;
}

// Global cache to prevent multiple connections per database
declare global {
  var mongooseConnections: Map<string, MongooseCache> | undefined;
}

let connectionsCache: Map<string, MongooseCache> = global.mongooseConnections || new Map();

if (!global.mongooseConnections) {
  global.mongooseConnections = connectionsCache;
}

function getMongoURI(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
  return uri;
}

/**
 * Get the base MongoDB URI without database name
 */
function getBaseMongoURI(): string {
  const uri = getMongoURI();
  // Remove database name from URI if present
  const uriObj = new URL(uri);
  uriObj.pathname = '';
  return uriObj.toString().replace(/\/$/, ''); // Remove trailing slash
}

/**
 * Connect to the admin database (fitconnect_admin)
 * This is the main database for admin users, gyms metadata, subscriptions, templates
 */
export async function connectAdminDB(): Promise<mongoose.Connection> {
  const dbName = 'fitconnect_admin';
  const cacheKey = dbName;

  // Check if already connected to this database
  const cached = connectionsCache.get(cacheKey);
  if (cached?.conn && cached.conn instanceof mongoose.Connection) {
    return cached.conn;
  }

  // Create new connection cache entry
  const newCache: MongooseCache = {
    conn: null,
    promise: null,
    dbName,
  };
  connectionsCache.set(cacheKey, newCache);

  if (!newCache.promise) {
    const baseUri = getBaseMongoURI();
    const fullUri = `${baseUri}/${dbName}`;
    
    const opts = {
      bufferCommands: false,
    };

    console.log(`🔌 Connecting to Admin DB: ${fullUri.replace(/\/\/[^@]+@/, '//***:***@')}`);

    const conn = mongoose.createConnection(fullUri, opts);
    
    newCache.promise = new Promise<mongoose.Connection>((resolve, reject) => {
      conn.on('connected', () => {
        console.log(`✅ Connected to Admin DB: ${dbName}`);
        resolve(conn);
      });
      
      conn.on('error', (err) => {
        reject(err);
      });
      
      // If already connected
      if (conn.readyState === 1) {
        console.log(`✅ Connected to Admin DB: ${dbName}`);
        resolve(conn);
      }
    });
  }

  try {
    newCache.conn = await newCache.promise;
  } catch (e) {
    newCache.promise = null;
    throw e;
  }

  return newCache.conn;
}

/**
 * Connect to a gym-specific database
 * Each gym has its own database: fc_gym_<gymId>
 * Note: MongoDB Atlas has a 38-byte limit for database names
 * MongoDB automatically creates the database when the first collection is created
 */
export async function connectGymDB(gymId: string): Promise<mongoose.Connection> {
  // Use shorter prefix to stay within 38-byte limit
  // fc_gym_ (7 chars) + ObjectId (24 chars) = 31 chars total
  const dbName = `fc_gym_${gymId}`;
  const cacheKey = dbName;

  // Check if already connected to this database
  const cached = connectionsCache.get(cacheKey);
  if (cached?.conn && cached.conn instanceof mongoose.Connection) {
    return cached.conn;
  }

  // Create new connection cache entry
  const newCache: MongooseCache = {
    conn: null,
    promise: null,
    dbName,
  };
  connectionsCache.set(cacheKey, newCache);

  if (!newCache.promise) {
    const baseUri = getBaseMongoURI();
    const fullUri = `${baseUri}/${dbName}`;
    
    const opts = {
      bufferCommands: false,
    };

    console.log(`🔌 Connecting to Gym DB: ${dbName}`);

    const conn = mongoose.createConnection(fullUri, opts);
    
    newCache.promise = new Promise<mongoose.Connection>((resolve, reject) => {
      conn.on('connected', () => {
        console.log(`✅ Connected to Gym DB: ${dbName}`);
        resolve(conn);
      });
      
      conn.on('error', (err) => {
        reject(err);
      });
      
      // If already connected
      if (conn.readyState === 1) {
        console.log(`✅ Connected to Gym DB: ${dbName}`);
        resolve(conn);
      }
    });
  }

  try {
    newCache.conn = await newCache.promise;
  } catch (e) {
    newCache.promise = null;
    throw e;
  }

  return newCache.conn as mongoose.Connection;
}

/**
 * Default connection - connects to admin database
 * Maintains backward compatibility
 * @deprecated Use connectAdminDB() or connectGymDB() instead
 */
async function connectDB(): Promise<mongoose.Connection> {
  return connectAdminDB();
}

export default connectDB;

