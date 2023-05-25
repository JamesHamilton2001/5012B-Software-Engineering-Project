import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default class Exercise {
   constructor(data) {
      // JCopy/clone the properties from the given object to the new Exercise object.
      // This should be considered garbage in; garbage out, so the factory method(s)
      // should be used instead of the constructor directly.
      Object.assign(this, data);

      // TODO: load/init other shit?
   }


   // Main factory method. Pulls all exercise sessions associated with a given user
   // from the database, and returns them as an array of Exercise objects.
   static async getByUserID(user_id, start, end, limit, offset) {
      const sql = 'SELECT * FROM user_exercise_session WHERE user_id = :user_id AND timestamp BETWEEN :start AND :end ORDER BY timestamp DESC LIMIT :limit OFFSET :offset';
      const rows = await db.all(sql, {
         ':user_id': user_id,
         ':start': start || 0,
         ':end': end || Math.floor(Date.now() / 1000),
         ':limit': limit || -1,
         ':offset': offset || 0,
      });
      // TODO: reconsider this check
      if(rows === undefined)
         return null;
      return rows.map(x => new Exercise(x));
   }


   // Return list of all exercise types in the database.
   static async getTypes() {
      const sql = 'SELECT * FROM exercise_type';
      return db.all(sql);
   }


   // Add new type of exercise to exercise_type table.
   static async addType(name, metric) {
      const sql = 'INSERT INTO exercise_type(name, metric) VALUES(?, ?)';
      return db.run(sql, name, metric);
   }
}

