import * as bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import Exercise from './Exercise.js';


export default class User {
   // Validation regexes. These are used internally for backend validation, and also
   // can be supplied to the frontend via the API for DRYness.
   static USERNAME_REGEX = /^\w{4,16}$/;
  //  static PASSWORD_REGEX = /^.{20,72}$/;   //---------------CHANGE THIS BACK!!!!!!
   static PASSWORD_REGEX = /^.{1,72}$/;

   constructor(data) {
      // JCopy/clone the properties from the given object to the new User object.
      // This should be considered garbage in; garbage out, so the factory method(s)
      // should be used instead of the constructor directly.
      Object.assign(this, data);

      // TODO: load things like groups, latest weight, etc. here? Probably best to load
      // those as requested instead perhaps..?
   }


   // Returns a collection of the user's exercise data.
   async getExercise(start, end, limit, offset) {
      return Exercise.getByUserID(this.id, start, end, limit, offset);
   }


   // Adds a new weight entry to the database for the user.
   async addWeight(weight) {
      const sql = 'INSERT INTO user_weight (user_id, weight, timestamp) VALUES (:id, :weight, :timestamp)';
      const args = {
         ':id': this.id,
         ':weight': weight,
         ':timestamp': Math.floor(Date.now() / 1000),
      }
      return db.run(sql, args);
   }


   // Returns a collection of the user's weight data.
   async getWeight(start, end, limit, offset) {
      const sql = 'SELECT weight, timestamp FROM user_weight WHERE user_id = :id AND timestamp BETWEEN :start AND :end ORDER BY timestamp DESC LIMIT :limit OFFSET :offset';
      const args = {
         ':id': this.id,
         ':start': start || 0,
         ':end': end || Math.floor(Date.now() / 1000),
         ':limit': limit || -1,
         ':offset': offset || 0,
      }
      return db.all(sql, args);
   }


   async matchPassword(password) {
      return await bcrypt.compare(password, this.password);
   }

   // Main factory method. Pulls the basic user data associated with a given username
   // from the database, or null if the username wasn't found.
   static async getByUsername(username) {
      const row = await db.get('SELECT * FROM user WHERE username = ?', username);
      if(row === undefined)
         return null;
      return new User(row);
   }


   // Alternate factory method. Pulls the basic user data associated with a given id.
   static async getByID(id) {
      const row = await db.get('SELECT * FROM user WHERE id = ?', id);
      if(row === undefined)
         return null;
      return new User(row);
   }


   // Add a new User to the database.
   static async add(username, email, password, real_name, height) {
      const sql = 'INSERT INTO user (username, email, password, real_name, height) VALUES (:username, :email, :password, :real_name, :height)';
      return db.run(sql, {
         ':username': username,
         ':email': email,
         ':password': await this.hashPassword(password),
         ':real_name': real_name,
         ':height': height,
      });
   }


   // Hash a given password using bcrypt.
   static async hashPassword(password) {
      // TODO: move the salt rounds out somewhere more configurable & accessible?
      return await bcrypt.hash(password, 10);
   }


   // Check if a given username is allowed. Returns true if the username is valid,
   // otherwise false. The regex should match any validation performed by the database
   // or during entry in the front-end forms.
   static validUsername(username) {
      // TODO: move the regex out somewhere more configurable & accessible?
      return this.USERNAME_REGEX.test(username);
   }


   // Check if a given username already exists in the database. Case insensitive.
   static async availableUsername(username) {
      const row = await db.get('SELECT COUNT(*) AS n FROM user WHERE username = ?', username);
      return row['n'] == 0;
   }


   // Check if a given email is, if not _valid_, at least vaguely emaily looking.
   static validEmail(email) {
      return /^[\w%+.]+@[a-z\d.-]+\.[a-z]{2,}$/i.test(email);
   }


   // Check if a given email already exists in the database. Case insensitive.
   static async availableEmail(email) {
      const row = await db.get('SELECT COUNT(*) AS n FROM user WHERE email = ?', email);
      return row['n'] == 0;
   }


   // Check if a given password meets some chosen criteria defined by a regex.
   static validPassword(password) {
      // The password is capped at 72 characters as that is the maximum possible
      // length that won't be truncated by bcrypt (strictly it is 72 bytes, which
      // could be truncated as low as 18 characters in utf-8).
      return this.PASSWORD_REGEX.test(password);
   }


   // Check if a given height is 'valid'. This is defined by being either a number
   // or a string which can be interpretted as a number of cm or feet & inches, as
   // well as being within a range that isn't totally arbitrary.
   static validHeight(height) {
      if(isNaN(height))
         height = User.stringToHeight(height);
      if(isNaN(height))
         return false;
      // These new bounds are pulled from the supposed shortest woman and tallest
      // man who ever lived. Feel free to object to my whimsy.
      return height >= 61 && height <= 272;
   }


   // Covert a string describing a height in either cm or feet & inches to an actual number in cm.
   // Returns NaN if the format of the string can't be recognised, or if not given a string.
   static stringToHeight(height) {
      // TODO: just return immediately if given a number?
      if(typeof height === 'string' || height instanceof String) {
         const cm = height.match(/^\s*(\d+(?:\.\d+)?) ?(?:cm\.?)?\s*$/i);
         if(cm !== null)
            return Number(cm[1]);

         const ft_in = height.match(/^\s*(\d+)' ?(\d+(?:\.\d+)?) ?"?\s*$/);
         if(ft_in !== null)
            return (Number(ft_in[1]) * 12 + Number(ft_in[2])) * 2.54;
      }
      return NaN;
   }


   // Check if a given 'real name' is considered 'valid'. Something of an awkward concept, and
   // possibly just a bad idea to do try to police this at all?
   static validRealName(real_name) {
      return User.realNameRegex.test(real_name);
   }

   // JS does not, apparently, support unicode character classes in regexes, so this monstrosity
   // is meant to match (mostly) just things considered letters in all or at least hopefully _most_
   // writing systems supported by unicode.
   static realNameRegex = /^[A-Za-z\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC -.']{1,777}$/u;
}

