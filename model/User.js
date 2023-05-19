import * as bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

global.db = await open({
   filename: 'debug.db',
   driver: sqlite3.cached.Database
});

export default class User {
   constructor(data) {
      // JCopy/clone the properties from the given object to the new User object.
      // This should be considered garbage in; garbage out, so the factory method(s)
      // should be used instead of the constructor directly.
      Object.assign(this, data);

      // TODO: load things like groups, latest weight, etc. here? Probably best to load
      // those as requested instead perhaps..?
   }

   async matchPassword(password) {
      return await bcrypt.compare(password, this.password);
   }

   // Main factory method. Pulls the basic user data associated with a given username
   // from the database, throwing an error if the user is not found. (Note, idk really
   // if and _when_ that error will fire, or exactly what will happen to node without
   // some testing.)
   static async getByUsername(username) {
      var row = await db.get('SELECT * FROM user WHERE username = ?', username);
      if(row === undefined)
         throw new Error('User not found:' + username);
      return new User(row);
   }
}

