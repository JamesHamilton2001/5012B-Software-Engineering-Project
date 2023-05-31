import * as bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default class Goal {
  constructor(data){
    Object.assign(this, data);

      // TODO: load/init other shit?
   }
   //add method that creates a new goal, taking
   //user_id, target, exercise_type_id, end_time
   //from goal form
   //!needs testing!
   static async add(user_id,  exercise_type_id, target, end_time){
    
    const sql = 'INSERT INTO goal(user_id, exercise_type_id, target, start_time, end_time) VALUES(:user_id, :exercise_type_id, :target, :start_time, :end_time)';
    const args = {
      ':user_id': user_id,
      ':exercise_type_id': exercise_type_id,
      ':target': target,
      ':start_time': Math.floor(Date.now() / 1000),
      ':end_time': end_time,
   };
   const data = db.run(sql, args);
   return data;
  }
   // Main factory method.
  
   static async getByUserID(user_id) {
      const rows = await db.all('SELECT * FROM goal WHERE user_id = ?', user_id);
      if(rows === undefined)
         return null;
      return rows.map(x => new Goal(x));
   }
}
