import { config } from 'dotenv';
config();
import sql3 from 'sqlite3';
const sqlite3 = sql3.verbose();

// open the database
const path = process.env.NODE_ENV === 'production' ? 'test' : '/Users/roeis/Desktop/node-backend/src/config/db/identifier.sqlite';

const db = new sqlite3.Database(path,
    sqlite3.OPEN_READWRITE, (err: Error | null) => {
    if (err) {
        throw Error(err.message);
    }
    console.log('Connected to the identifier database.');
});

export default db;