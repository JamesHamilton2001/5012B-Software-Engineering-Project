import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default class Meal {
   constructor(data) {
      // Copy/clone the properties from the given object to the new Meal object.
      // This should be considered garbage in; garbage out, so the factory method(s)
      // should be used instead of the constructor directly.
      Object.assign(this, data);

      // TODO: load/init other shit?
   }


   // Get list of items comprising this meal from the database.
   async getItems() {
      const sql = 'SELECT * FROM user_meal_item WHERE user_meal_id = ?';
      const data = await db.all(sql, this.id);
      // TODO: process. perhaps a MealItem class or such?
      // TODO: merge in custom items. a MealItem class could abstract both?
      return data;
   }


   // Add new meal record for the given user
   static async add(user_id, meal_type_id, timestamp) {
      const sql = 'INSERT INTO user_meal(user_id, meal_type_id, timestamp) VALUES(:user_id, :meal_type_id, :timestamp)';
      const args = {
         ':user_id': user_id,
         ':meal_type_id': meal_type_id,
         ':timestamp': timestamp || Math.floor(Date.now() / 1000),
      };
      const data = db.run(sql, args);
      return data;
   }


   // Main factory method. Pulls all meal records associated with a given user
   // from the database, and returns them as an array of Meal objects.
   static async getByUserID(user_id, start, end, limit, offset) {
      const sql = 'SELECT * FROM user_meal WHERE user_id = :user_id AND timestamp BETWEEN :start AND :end ORDER BY timestamp DESC LIMIT :limit OFFSET :offset';
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
      return rows.map(x => new Meal(x));
   }


   // Return list of all meal types in the database.
   static async getTypes() {
      const sql = 'SELECT * FROM meal_type';
      return db.all(sql);
   }


   // Add new meal type to the database.
   static async addType(name) {
      const sql = 'INSERT INTO meal_type(name) VALUES(?)';
      return db.run(sql, name);
   }
}
