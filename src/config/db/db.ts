import { config } from 'dotenv';
import path from "path";
config();
import sql3 from 'sqlite3';
import { DEVELOPMENT } from "../../constants";
const sqlite3 = sql3.verbose();

// open the database

const pathDevelopment = path.resolve(__dirname + '/identifier.sqlite');
const pathProduction = path.resolve(__dirname + '../../../../identifier.sqlite');

const url = process.env.NODE_ENV === DEVELOPMENT ? pathDevelopment : pathProduction;

const db = new sqlite3.Database(url,
    sqlite3.OPEN_READWRITE, (err: Error | null) => {
    if (err) {
        throw Error(err.message);
    }
    console.log('Connected to the identifier database.');
});

export default db;
