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


   // Check if a given username is allowed. Returns true if the username is valid,
   // otherwise false. The regex should match any validation performed by the database
   // or during entry in the front-end forms.
   static validUsername(username) {
      // TODO: move the regex out somewhere more configurable & accessible?
      return /^\w{4,16}$/.test(username);
   }


   // Check if a given email is, if not _valid_, at least vaguely emaily looking.
   static validEmail(email) {
      return /^[\w%+.]+@[a-z\d.-]+\.[a-z]{2,}$/i.test(email);
   }


   // Check if a given password meets some chosen criteria defined by a regex.
   static validPassword(password) {
      // The password is capped at 72 characters as that is the maximum possible
      // length that won't be truncated by bcrypt (strictly it is 72 bytes, which
      // could be truncated as low as 18 characters in utf-8).
      return /^.{20,72}$/.test(password);
   }
}

