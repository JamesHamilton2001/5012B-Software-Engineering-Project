import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db_file = 'debug.db';

export const db = await open({
   filename: db_file,
   driver: sqlite3.cached.Database
});
export default db;

