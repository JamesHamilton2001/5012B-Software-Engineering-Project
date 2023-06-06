import db from '../db.js';

export default class Exercise {
   constructor(data) {
      // Copy/clone the properties from the given object to the new Exercise object.
      // This should be considered garbage in; garbage out, so the factory method(s)
      // should be used instead of the constructor directly.
      Object.assign(this, data);

      // TODO: load/init other shit?
   }


   // Filter out unneeded properties when serialising for the client
   toJSON() {
      return {
         id: this.id,
         type: this.name,
         value: this.value,
         metric: this.metric,
         timestamp: this.timestamp,
      };
   }


   // Add new exercise session of given type for given user.
   static async add(user_id, exercise_type_id, value) {
      const sql = 'INSERT INTO user_exercise_session(user_id, exercise_type_id, timestamp, value) VALUES(:user_id, :exercise_type_id, :timestamp, :value)';
      const args = {
         ':user_id': user_id,
         ':exercise_type_id': exercise_type_id,
         ':timestamp': Math.floor(Date.now() / 1000),
         ':value': value,
      };
      const data = db.run(sql, args);
      return data;
   }


   // Main factory method. Pulls all exercise sessions associated with a given user
   // from the database, and returns them as an array of Exercise objects.
   static async getByUserID(user_id, start, end, limit, offset) {
      const sql = 'SELECT * FROM exercise_view WHERE user_id = :user_id AND timestamp BETWEEN :start AND :end ORDER BY timestamp DESC LIMIT :limit OFFSET :offset';
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


   // Secondary factory method. Pulls all exercise sessions associated with a given user
   // that are of a given type from the database, and returns them as an array of Exercise objects.
   static async getByTypeAndUserID(user_id, type_id, start, end, limit, offset) {
      const sql = 'SELECT * FROM exercise_view WHERE user_id = :user_id AND type_id = :type_id AND timestamp BETWEEN :start AND :end ORDER BY timestamp DESC LIMIT :limit OFFSET :offset';
      const rows = await db.all(sql, {
         ':user_id': user_id,
         ':type_id': type_id,
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

