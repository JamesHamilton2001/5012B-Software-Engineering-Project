import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db_file = 'debug.db';

console.log('Checking for database connection...');

if(!global.db) {
   global.db = await open({
      filename: db_file,
      driver: sqlite3.cached.Database
   });
   console.log('Database connection established.');
}


