import * as bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


export default class User {
   constructor(data) {
      // JCopy/clone the properties from the given object to the new User object.
      // This should be considered garbage in; garbage out, so the factory method(s)
      // should be used instead of the constructor directly.
      Object.assign(this, data);

      // TODO: load things like groups, latest weight, etc. here? Probably best to load
      // those as requested instead perhaps..?
   }


   // Adds a new weight entry to the database for the user.
   async addWeight(weight) {
      const sql = 'INSERT INTO user_weight (user_id, weight, timestamp) VALUES (:id, :weight, :timestamp)';
      const args = {
         ':id': this.id,
         ':weight': weight,
         ':timestamp': Date.now(),
      }
      return db.run(sql, args);
   }


   // Returns a collection of the user's weight data.
   async getWeight(limit, start, end) {
      const sql = 'SELECT weight, timestamp FROM user_weight WHERE user_id = :id AND timestamp BETWEEN :start AND :end ORDER BY timestamp DESC LIMIT :limit';
      const args = {
         ':id': this.id,
         ':limit': limit || 1,
         ':start': start || 0,
         ':end': end || Date.now(),
      }
      return db.all(sql, args);
   }


   async matchPassword(password) {
      return await bcrypt.compare(password, this.password);
   }

   // Main factory method. Pulls the basic user data associated with a given username
   // from the database, throwing an error if the user is not found. (Note, idk really
   // if and _when_ that error will fire, or exactly what will happen to node without
   // some testing.)
   static async getByUsername(username) {
      const row = await db.get('SELECT * FROM user WHERE username = ?', username);
      if(row === undefined)
         return null;
      return new User(row);
   }
}

