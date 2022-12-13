import path from 'path';
import sql3 from 'sqlite3';
const sqlite3 = sql3.verbose();

// open the database
const db = new sqlite3.Database(path.resolve(__dirname, 'identifier.sqlite'),
    sqlite3.OPEN_READWRITE, (err: Error | null) => {
    if (err) {
        throw Error('could not connected database')
    }
    console.log('Connected to the identifier database.');
});

export default db;