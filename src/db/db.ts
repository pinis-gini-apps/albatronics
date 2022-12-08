import path from 'node:path';
import sql3 from 'sqlite3';
const sqlite3 = sql3.verbose();

// open the database
let db = new sqlite3.Database(path.resolve(__dirname, 'identifier.sqlite'),
    sqlite3.OPEN_READWRITE, (err: Error | null) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the identifier database.');
});

export default db;